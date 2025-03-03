const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

// Login routes
router.get('/login', (req, res) => {
    res.render('auth/login', { error: null });
});

router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty()
], authController.login);

// Register routes
router.get('/register', (req, res) => {
    res.render('auth/register', { error: null });
});

router.post('/register', [
    body('username').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], authController.register);

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/news');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/'); // Redirect to root (login page)
    });
});

module.exports = router;
