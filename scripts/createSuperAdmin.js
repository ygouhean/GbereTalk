const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/adminModel');

// Charger les variables d'environnement
dotenv.config({ path: './config.env' });

// Connexion à la base de données
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true
  })
  .then(() => console.log('✅ Connexion à la base de données réussie !'))
  .catch(err => {
    console.error('❌ Erreur de connexion à la base de données:', err);
    process.exit(1);
  });

// Créer le super admin
const createSuperAdmin = async () => {
  try {
    // Vérifier si un super admin existe déjà
    const existingAdmin = await Admin.findOne({ role: 'super_admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Un super admin existe déjà !');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nom:', existingAdmin.name);
      process.exit(0);
    }
    
    // Créer le super admin
    const superAdmin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@gberetalk.com',
      password: 'Admin@123456', // À CHANGER IMMÉDIATEMENT APRÈS LA PREMIÈRE CONNEXION
      role: 'super_admin',
      permissions: {
        canDeleteUsers: true,
        canBlockUsers: true,
        canViewMessages: true,
        canManageGroups: true,
        canViewStatistics: true
      }
    });
    
    console.log('✅ Super Admin créé avec succès !');
    console.log('');
    console.log('📋 Informations de connexion :');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email    : admin@gberetalk.com');
    console.log('🔑 Password : Admin@123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('⚠️  IMPORTANT : Changez ce mot de passe immédiatement après la première connexion !');
    console.log('');
    console.log('🌐 URL de connexion : http://localhost:2000/admin/login');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création du super admin:', error);
    process.exit(1);
  }
};

// Exécuter la fonction
createSuperAdmin();
