const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const path = require('path');
const { userJoin } = require('./../utils/users');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res, msg) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    res.cookie('user_id', user.id, cookieOptions);

    // Remove password from output
    user.password = undefined;
    return res.status(statusCode).json({
        status: 'success',
        message: msg,
        token,
        data: {user}
    });
}

/**
 * Sign Up
 */
exports.signup = catchAsync(async (req, res, next) => {
    await User.create(req.body);
    return res.status(200).json({
        status: "success",
        message: "Inscription réussie"
    })
});

/**
 * Sign In
 */
exports.signin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    // 1) Vérifier si email et password existent
    if (!email || !password) {
        return res.status(200).json({
            status: 'fail',
            message: 'Veuillez saisir votre email et mot de passe'
        });
    }

    // 2) Vérifier si l'utilisateur existe et si le mot de passe est correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !await user.correctPassword(password, user.password)) {
        return res.status(200).json({
            status: 'fail',
            message: 'Email ou mot de passe incorrect'
        });
    }

    // 3) Si tout est ok, envoyer le token
    createSendToken(user, 200, res, 'Connexion réussie');
});

/**
 * Forgot Password
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get User based on Posted Email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(200).json({
            status: 'fail',
            message: 'Veuillez fournir une adresse email'
        });
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/reset_Password?token=${resetToken}`;
    const message = `Bonjour,

                     Vous avez demandé à réinitialiser votre mot de passe sur GbêrêTalk.
                     Pour définir un nouveau mot de passe, veuillez cliquer sur le lien ci-dessous :

                                                  🔗 ${resetURL}

                     Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer ce message en toute sécurité.

                     Cordialement,
                     L’équipe GbêrêTalk `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Votre token de réinitialisation de mot de passe (valide 10 min)',
            message
        });

        return res.status(200).json({
            status: 'success',
            message: 'Token envoyé par email',
            token: resetToken
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Une erreur s\'est produite lors de l\'envoi de l\'email. Veuillez réessayer plus tard !', 500));
    }
});

/**
 * Reset Password
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get User based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return res.status(200).json({
            status: 'fail',
            message: 'Le token est invalide ou a expiré'
        });
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4) Log the user in, send JWT
    return res.status(200).json({
        status: 'success',
        message: 'Réinitialisation du mot de passe réussie'
    });
});

/**
 * Logout
 */
exports.logout = async (req, res) => {
    res.clearCookie('user_id');
    res.clearCookie('jwt');
    res.status(200).json({ status: 'success' });
}

/**
 * Login Page
 */
exports.login = async (req, res) => {
    res.status(200).render('login');
};

/**
 * Register Page
 */
exports.register = async (req, res) => {
    res.status(200).render('register');
};

/**
 * Forgot password Page
 */
exports.forgot_password = async (req, res) => {
    res.status(200).render('forgot_password');
};

/**
 * Forgot password Page
 */
exports.reset_password = async (req, res) => {
    res.status(200).render('reset_password');
};

/**
 * Home Page
 */
exports.home = async (req, res) => {
    res.status(200).render('home');
};

/**
 * Index Page (Chat Application)
 */
exports.index = async (req, res) => {
    console.log("aa", req.cookies.jwt)
    if (req.cookies.jwt == undefined) {
        return res.status(200).render('login');
    } else
        res.status(200).render('index', { user: req.user })
};