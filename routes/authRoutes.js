const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty()
], authController.login);

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', [
    body('username').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], authController.register);

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/news');
        }
        res.redirect('/');
    });
});

module.exports = router;
