const User = require('../models/User');
const { validationResult } = require('express-validator');

// Export an object with all controller methods
module.exports = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            
            if (!user || !await user.comparePassword(password)) {
                return res.render('auth/login', { error: 'Invalid credentials' });
            }

            // Store complete user object in session
            req.session.user = {
                id: user._id,        // Store MongoDB _id as id
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            };

            // Save session before redirecting
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.render('auth/login', { error: 'Session error' });
                }
                res.redirect('/news');
            });

        } catch (error) {
            console.error('Login error:', error);
            res.render('auth/login', { error: 'An error occurred during login' });
        }
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
            }
            res.redirect('/auth/login');
        });
    },

    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.render('auth/register', {
                    error: 'Email already registered',
                    user: req.session.user || null
                });
            }

            const user = new User({ username, email, password });
            await user.save();
            
            req.session.user = {
                id: user._id,
                isAdmin: user.isAdmin
            };
            
            res.redirect('/news');
        } catch (error) {
            console.error('Registration error:', error);
            res.render('auth/register', {
                error: 'Error registering user',
                user: req.session.user || null
            });
        }
    },

    getLogin: (req, res) => {
        res.render('auth/login', {
            user: req.session.user || null
        });
    },

    getRegister: (req, res) => {
        res.render('auth/register', {
            user: req.session.user || null
        });
    },

    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            
            if (!user || !(await user.comparePassword(password))) {
                return res.render('auth/login', { 
                    error: 'Invalid credentials',
                    user: req.session.user || null
                });
            }

            req.session.user = {
                id: user._id,
                isAdmin: user.isAdmin
            };

            res.redirect('/news');
        } catch (error) {
            console.error('Login error:', error);
            res.render('auth/login', { 
                error: 'Server error',
                user: req.session.user || null
            });
        }
    },

    postRegister: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.render('auth/register', {
                    error: 'Email already registered',
                    user: req.session.user || null
                });
            }

            const user = new User({ username, email, password });
            await user.save();
            
            req.session.user = {
                id: user._id,
                isAdmin: user.isAdmin
            };
            
            res.redirect('/news');
        } catch (error) {
            console.error('Registration error:', error);
            res.render('auth/register', {
                error: 'Registration failed',
                user: req.session.user || null
            });
        }
    }
};
