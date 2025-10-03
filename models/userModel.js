const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Un utilisateur doit avoir un nom'],
        maxlength: [10, 'Le nom d\'utilisateur doit contenir 10 caractères maximum.']
    },
    email: {
        type: String,
        required: [true, 'Veuillez fournir votre adresse email'],
        unique: true,
        validate: [validator.isEmail, 'Veuillez fournir une adresse email valide']
    },
    password: {
        type: String,
        required: [true, 'Veuillez fournir un mot de passe'],
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères.']
    },
    notification: {
        type: String,
        default: 1
    },
    is_muted: {
        type: String,
        default: 1
    },
    location: {
        type: String,
        required: [true, 'Veuillez fournir une localisation'],
    },
    image: {
        type: String,
        default: 'default_image.jpg'
    },
    description: {
        type: String,
        default: 'Si plusieurs langues fusionnent, la grammaire de la langue résultante est plus simple et plus régulière que celle de chacune prise individuellement.',
        maxlength: [200, 'La description ne peut pas dépasser 200 caractères.']
    },
    status: {
        type: String,
        enum: ['Disponible', 'Occupé(e)'],
        default: 'Disponible'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: false,
    }
},
    {
        timestamps: {
        }
    });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    // Hacher le mot de passe avec un coût de 12
    this.password = await bcrypt.hash(this.password, 12);

    // Supprimer le champ passwordConfirm
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime());
        return JWTTimestamp < changedTimestamp;
    }
    // False signifie Non Modifié
    return false;
}

/**
 * Réinitialiser le mot de passe
 */
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;