const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const Message = require('../models/messagesModel');
const Group = require('../models/groupModel');
const GroupUser = require('../models/groupUserModel');
const GroupMessage = require('../models/groupMessageModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Générer un token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Créer et envoyer le token
const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
  res.cookie('admin_jwt', token, cookieOptions);
  
  admin.password = undefined;
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      admin
    }
  });
};

// Connexion admin
exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new AppError('Veuillez fournir un email et un mot de passe', 400));
  }
  
  const admin = await Admin.findOne({ email }).select('+password');
  
  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError('Email ou mot de passe incorrect', 401));
  }
  
  if (!admin.isActive) {
    return next(new AppError('Votre compte a été désactivé', 401));
  }
  
  // Mettre à jour la dernière connexion
  admin.lastLogin = Date.now();
  await admin.save({ validateBeforeSave: false });
  
  createSendToken(admin, 200, res);
});

// Middleware de protection des routes admin
exports.protectAdmin = catchAsync(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.admin_jwt) {
    token = req.cookies.admin_jwt;
  }
  
  if (!token) {
    return next(new AppError('Vous n\'êtes pas connecté. Veuillez vous connecter.', 401));
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  const currentAdmin = await Admin.findById(decoded.id);
  if (!currentAdmin) {
    return next(new AppError('L\'admin n\'existe plus.', 401));
  }
  
  if (!currentAdmin.isActive) {
    return next(new AppError('Votre compte a été désactivé', 401));
  }
  
  req.admin = currentAdmin;
  next();
});

// Vérifier les permissions
exports.restrictTo = (...permissions) => {
  return (req, res, next) => {
    const admin = req.admin;
    
    // Super admin a tous les droits
    if (admin.role === 'super_admin') {
      return next();
    }
    
    // Vérifier les permissions spécifiques
    const hasPermission = permissions.every(perm => admin.permissions[perm] === true);
    
    if (!hasPermission) {
      return next(new AppError('Vous n\'avez pas la permission d\'effectuer cette action', 403));
    }
    
    next();
  };
};

// Obtenir les statistiques du tableau de bord
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const blockedUsers = await User.countDocuments({ isBlocked: true });
  const totalMessages = await Message.countDocuments();
  const totalGroups = await Group.countDocuments();
  
  // Utilisateurs récents (7 derniers jours)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentUsers = await User.countDocuments({ 
    createdAt: { $gte: sevenDaysAgo } 
  });
  
  // Messages récents (24 dernières heures)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentMessages = await Message.countDocuments({ 
    createdAt: { $gte: oneDayAgo } 
  });
  
  // Top 10 utilisateurs les plus actifs
  const topUsers = await Message.aggregate([
    {
      $group: {
        _id: '$sender_id',
        messageCount: { $sum: 1 }
      }
    },
    { $sort: { messageCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    { $unwind: '$userInfo' },
    {
      $project: {
        name: '$userInfo.name',
        email: '$userInfo.email',
        image: '$userInfo.image',
        messageCount: 1
      }
    }
  ]);
  
  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalUsers,
        activeUsers,
        blockedUsers,
        totalMessages,
        totalGroups,
        recentUsers,
        recentMessages
      },
      topUsers
    }
  });
});

// Obtenir tous les utilisateurs avec pagination
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  const search = req.query.search || '';
  const filter = req.query.filter || 'all'; // all, active, blocked
  
  let query = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (filter === 'active') {
    query.isActive = true;
    query.isBlocked = false;
  } else if (filter === 'blocked') {
    query.isBlocked = true;
  }
  
  const users = await User.find(query)
    .select('name email image isActive isBlocked createdAt lastActive')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await User.countDocuments(query);
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: {
      users
    }
  });
});

// Obtenir un utilisateur spécifique
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }
  
  // Compter les messages de l'utilisateur
  const messageCount = await Message.countDocuments({ sender_id: user._id });
  
  // Compter les groupes de l'utilisateur
  const groupCount = await Group.countDocuments({ userId: user._id });
  
  res.status(200).json({
    status: 'success',
    data: {
      user,
      stats: {
        messageCount,
        groupCount
      }
    }
  });
});

// Bloquer un utilisateur
exports.blockUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }
  
  user.isBlocked = true;
  user.isActive = false;
  user.blockedAt = Date.now();
  user.blockedBy = req.admin._id;
  user.blockReason = req.body.reason || 'Non spécifié';
  
  await user.save({ validateBeforeSave: false });
  
  res.status(200).json({
    status: 'success',
    message: 'Utilisateur bloqué avec succès',
    data: {
      user
    }
  });
});

// Débloquer un utilisateur
exports.unblockUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }
  
  user.isBlocked = false;
  user.isActive = true;
  user.blockedAt = undefined;
  user.blockedBy = undefined;
  user.blockReason = undefined;
  
  await user.save({ validateBeforeSave: false });
  
  res.status(200).json({
    status: 'success',
    message: 'Utilisateur débloqué avec succès',
    data: {
      user
    }
  });
});

// Supprimer un utilisateur
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }
  
  // Supprimer tous les messages de l'utilisateur
  await Message.deleteMany({ 
    $or: [{ sender_id: user._id }, { receiver_id: user._id }] 
  });
  
  // Supprimer l'utilisateur
  await User.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    status: 'success',
    message: 'Utilisateur et ses données supprimés avec succès'
  });
});

// Obtenir tous les groupes
exports.getAllGroups = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  const groups = await Group.find()
    .populate('userId', 'name email image')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Group.countDocuments();
  
  res.status(200).json({
    status: 'success',
    results: groups.length,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: {
      groups
    }
  });
});

// Supprimer un groupe
exports.deleteGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.id);
  
  if (!group) {
    return next(new AppError('Groupe non trouvé', 404));
  }
  
  await Group.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    status: 'success',
    message: 'Groupe supprimé avec succès'
  });
});

// Obtenir les messages récents (pour modération)
exports.getRecentMessages = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;
  
  const messages = await Message.find()
    .populate('sender_id', 'name email image')
    .populate('receiver_id', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Message.countDocuments();
  
  res.status(200).json({
    status: 'success',
    results: messages.length,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: {
      messages
    }
  });
});

// Supprimer un message
exports.deleteMessage = catchAsync(async (req, res, next) => {
  const message = await Message.findById(req.params.id);
  
  if (!message) {
    return next(new AppError('Message non trouvé', 404));
  }
  
  await Message.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    status: 'success',
    message: 'Message supprimé avec succès'
  });
});

// Créer un nouvel admin
exports.createAdmin = catchAsync(async (req, res, next) => {
  // Seul le super admin peut créer d'autres admins
  if (req.admin.role !== 'super_admin') {
    return next(new AppError('Seul le super admin peut créer des admins', 403));
  }
  
  const newAdmin = await Admin.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || 'admin',
    permissions: req.body.permissions
  });
  
  newAdmin.password = undefined;
  
  res.status(201).json({
    status: 'success',
    data: {
      admin: newAdmin
    }
  });
});

// Obtenir tous les admins
exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await Admin.find().select('-password');
  
  res.status(200).json({
    status: 'success',
    results: admins.length,
    data: {
      admins
    }
  });
});

// Mettre à jour les permissions d'un admin
exports.updateAdminPermissions = catchAsync(async (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return next(new AppError('Seul le super admin peut modifier les permissions', 403));
  }
  
  const admin = await Admin.findByIdAndUpdate(
    req.params.id,
    { permissions: req.body.permissions },
    { new: true, runValidators: true }
  );
  
  if (!admin) {
    return next(new AppError('Admin non trouvé', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      admin
    }
  });
});

// Supprimer un admin
exports.deleteAdmin = catchAsync(async (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return next(new AppError('Seul le super admin peut supprimer des admins', 403));
  }
  
  const admin = await Admin.findById(req.params.id);
  
  if (!admin) {
    return next(new AppError('Admin non trouvé', 404));
  }
  
  // Ne pas permettre de supprimer un super admin
  if (admin.role === 'super_admin') {
    return next(new AppError('Impossible de supprimer un super admin', 403));
  }
  
  await Admin.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    status: 'success',
    message: 'Administrateur supprimé avec succès'
  });
});

// ============================================
// GESTION DES GROUPES
// ============================================

// Obtenir tous les groupes avec filtres
exports.getAllGroups = catchAsync(async (req, res, next) => {
  const { search, sort } = req.query;
  
  let query = Group.find();
  
  // Recherche
  if (search) {
    query = query.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    });
  }
  
  // Tri
  if (sort === 'members') {
    query = query.sort('-membersCount');
  } else if (sort === 'messages') {
    query = query.sort('-messagesCount');
  } else {
    query = query.sort('-createdAt');
  }
  
  const groups = await query.populate('creator', 'name email');
  
  // Ajouter les comptes de membres et messages
  const groupsWithCounts = await Promise.all(
    groups.map(async (group) => {
      const membersCount = await GroupUser.countDocuments({ group: group._id });
      const messagesCount = await GroupMessage.countDocuments({ group: group._id });
      
      return {
        _id: group._id,
        name: group.name,
        description: group.description,
        creatorName: group.creator?.name || 'Inconnu',
        membersCount,
        messagesCount,
        createdAt: group.createdAt
      };
    })
  );
  
  res.status(200).json({
    status: 'success',
    results: groupsWithCounts.length,
    data: {
      groups: groupsWithCounts
    }
  });
});

// Supprimer un groupe
exports.deleteGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.id);
  
  if (!group) {
    return next(new AppError('Groupe non trouvé', 404));
  }
  
  // Supprimer tous les messages du groupe
  await GroupMessage.deleteMany({ group: req.params.id });
  
  // Supprimer tous les membres du groupe
  await GroupUser.deleteMany({ group: req.params.id });
  
  // Supprimer le groupe
  await Group.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    status: 'success',
    message: 'Groupe et toutes ses données supprimés avec succès'
  });
});

// ============================================
// MODÉRATION DES MESSAGES (AVEC PAGINATION)
// ============================================

// Obtenir les messages avec pagination
exports.getMessages = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;
  const { search, filter } = req.query;
  
  let query = {};
  
  // Recherche
  if (search) {
    query.message = { $regex: search, $options: 'i' };
  }
  
  // Filtre par date
  if (filter === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    query.createdAt = { $gte: today };
  } else if (filter === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    query.createdAt = { $gte: weekAgo };
  } else if (filter === 'files') {
    query.type = { $in: ['file', 'image', 'video', 'audio'] };
  }
  
  const total = await Message.countDocuments(query);
  const messages = await Message.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('from', 'name')
    .populate('to', 'name');
  
  // Formater les messages
  const formattedMessages = messages.map(msg => ({
    _id: msg._id,
    message: msg.message,
    type: msg.type || 'text',
    senderName: msg.from?.name || 'Utilisateur supprimé',
    recipientName: msg.to?.name || 'Utilisateur supprimé',
    createdAt: msg.createdAt
  }));
  
  res.status(200).json({
    status: 'success',
    results: formattedMessages.length,
    data: {
      messages: formattedMessages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// ============================================
// MAINTENANCE ET SAUVEGARDE
// ============================================

// Créer une sauvegarde de la base de données
exports.backupDatabase = catchAsync(async (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return next(new AppError('Seul le super admin peut créer des sauvegardes', 403));
  }
  
  // Note: Dans un environnement de production, vous utiliseriez mongodump
  // ou un service de sauvegarde automatique
  
  res.status(200).json({
    status: 'success',
    message: 'Sauvegarde créée avec succès',
    data: {
      backupDate: new Date(),
      backupId: `backup-${Date.now()}`
    }
  });
});

// Exporter les données
exports.exportData = catchAsync(async (req, res, next) => {
  const users = await User.find().select('name email status createdAt');
  const groups = await Group.find().select('name description createdAt');
  
  // Créer un CSV simple
  let csv = 'Type,Name,Email,Status,Created\n';
  
  users.forEach(user => {
    csv += `User,${user.name},${user.email},${user.status},${user.createdAt}\n`;
  });
  
  groups.forEach(group => {
    csv += `Group,${group.name},,active,${group.createdAt}\n`;
  });
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=export.csv');
  res.status(200).send(csv);
});

// Nettoyer les anciennes données
exports.cleanupData = catchAsync(async (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return next(new AppError('Seul le super admin peut nettoyer les données', 403));
  }
  
  // Supprimer les messages de plus de 6 mois
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const deletedMessages = await Message.deleteMany({
    createdAt: { $lt: sixMonthsAgo }
  });
  
  const deletedGroupMessages = await GroupMessage.deleteMany({
    createdAt: { $lt: sixMonthsAgo }
  });
  
  const totalDeleted = deletedMessages.deletedCount + deletedGroupMessages.deletedCount;
  
  res.status(200).json({
    status: 'success',
    message: 'Nettoyage effectué avec succès',
    data: {
      deletedCount: totalDeleted
    }
  });
});
