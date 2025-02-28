const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Create feedback
router.post('/:newsId', isAuthenticated, async (req, res) => {
    try {
        if (!req.body.comment || !req.body.comment.trim()) {
            throw new Error('Comment is required');
        }

        // Check if user data exists in session
        if (!req.session.user) {
            throw new Error('User not authenticated');
        }

        // Get user data from database
        const user = await User.findById(req.session.user._id || req.session.user.id);
        if (!user) {
            throw new Error('User not found');
        }

        // Create feedback with user data from database
        const feedback = new Feedback({
            news: req.params.newsId,
            user: user._id,
            username: user.username,
            comment: req.body.comment.trim()
        });

        console.log('Creating feedback:', {
            newsId: req.params.newsId,
            userId: user._id,
            username: user.username
        });
        
        await feedback.save();
        res.redirect(`/news/${req.params.newsId}`);
    } catch (error) {
        console.error('Feedback submission error:', error);
        console.error('Session user data:', req.session.user);
        res.status(500).render('error', { 
            message: 'Error submitting feedback: ' + error.message,
            user: req.session.user || null
        });
    }
});

// Get all feedbacks (admin only)
router.get('/', isAdmin, async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('news', 'title')
            .sort({ createdAt: -1 });
            
        res.render('admin/feedbacks', { 
            feedbacks,
            user: req.session.user || null
        });
    } catch (error) {
        res.status(500).render('error', { 
            message: 'Error fetching feedbacks',
            user: req.session.user || null
        });
    }
});

module.exports = router; 