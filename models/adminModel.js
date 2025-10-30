const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Email invalide'
    }
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  permissions: {
    canDeleteUsers: {
      type: Boolean,
      default: false
    },
    canBlockUsers: {
      type: Boolean,
      default: false
    },
    canViewMessages: {
      type: Boolean,
      default: false
    },
    canManageGroups: {
      type: Boolean,
      default: false
    },
    canViewStatistics: {
      type: Boolean,
      default: true
    }
  }
});

// Hasher le mot de passe avant sauvegarde
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode pour comparer les mots de passe
adminSchema.methods.correctPassword = async function(candidatePassword, adminPassword) {
  return await bcrypt.compare(candidatePassword, adminPassword);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
