const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Route de connexion admin (publique)
router.post('/login', adminController.loginAdmin);

// Toutes les routes suivantes nécessitent une authentification admin
router.use(adminController.protectAdmin);

// Dashboard et statistiques
router.get('/dashboard/stats', adminController.getDashboardStats);

// Gestion des utilisateurs
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUser);

router.patch('/users/:id/block', 
  adminController.restrictTo('canBlockUsers'), 
  adminController.blockUser
);

router.patch('/users/:id/unblock', 
  adminController.restrictTo('canBlockUsers'), 
  adminController.unblockUser
);

router.delete('/users/:id', 
  adminController.restrictTo('canDeleteUsers'), 
  adminController.deleteUser
);

// Gestion des groupes
router.get('/groups', 
  adminController.restrictTo('canManageGroups'), 
  adminController.getAllGroups
);

router.delete('/groups/:id', 
  adminController.restrictTo('canManageGroups'), 
  adminController.deleteGroup
);

// Gestion des messages (modération)
router.get('/messages', 
  adminController.restrictTo('canViewMessages'), 
  adminController.getMessages
);

router.delete('/messages/:id', 
  adminController.restrictTo('canViewMessages'), 
  adminController.deleteMessage
);

// Gestion des admins (super admin uniquement)
router.post('/admins', adminController.createAdmin);
router.get('/admins', adminController.getAllAdmins);
router.patch('/admins/:id/permissions', adminController.updateAdminPermissions);
router.delete('/admins/:id', adminController.deleteAdmin);

// Maintenance et sauvegarde (super admin uniquement)
router.post('/backup', adminController.backupDatabase);
router.post('/export', adminController.exportData);
router.post('/cleanup', adminController.cleanupData);

module.exports = router;
