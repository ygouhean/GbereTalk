const express = require('express');
const userController = require('./../controllers/userController');
const router = express.Router();

// Routes d'authentification
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.get('/logout', userController.logout);

// Routes de gestion du mot de passe
router.post('/forgotPassword', userController.forgotPassword);
router.patch('/resetPassword/:token', userController.resetPassword);

// Routes de pages
router.get('/', userController.home);
router.get('/login', userController.login);
router.get('/register', userController.register);
router.get('/forgot_password', userController.forgot_password);
router.get('/reset_password', userController.reset_password);
router.get('/chat', userController.index);

module.exports = router;