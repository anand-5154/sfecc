// Render edit form for news (admin only)
exports.getEditNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).render('error', {
                message: 'News not found',
                user: req.session.user || null
            });
        }
        res.render('news/edit', {
            news,
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Error loading edit form:', error);
        res.status(500).render('error', {
            message: 'Error loading edit form',
            user: req.session.user || null
        });
    }
};

// Handle update of news (admin only)
exports.updateNews = async (req, res) => {
    try {
        const { title, content } = req.body;
        const update = { title, content };
        if (req.file) {
            update.mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
            update.mediaUrl = `/uploads/${req.file.filename}`;
        }
        await News.findByIdAndUpdate(req.params.id, update);
        res.redirect(`/news/${req.params.id}`);
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).render('error', {
            message: 'Error updating news',
            user: req.session.user || null
        });
    }
};
const News = require('../models/News');

exports.getAllNews = async (req, res) => {
    try {
        const news = await News.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'username');
        
        // Get unique dates for the filter
        const availableDates = [...new Set(news.map(item => 
            item.createdAt.toISOString().split('T')[0]
        ))];
        
        // Get selected date from query or default to all
        const selectedDate = req.query.date || '';

        // Filter news if date is selected
        const filteredNews = selectedDate 
            ? news.filter(item => item.createdAt.toISOString().split('T')[0] === selectedDate)
            : news;

        res.render('news/list', { 
            news: filteredNews,
            user: req.session.user || null,
            availableDates,
            selectedDate
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).render('error', { 
            message: 'Error fetching news',
            user: req.session.user || null
        });
    }
};

exports.getCreateNews = (req, res) => {
    res.render('news/create', {
        user: req.session.user || null
    });
};

exports.createNews = async (req, res) => {
    try {
        console.log('Session user:', req.session.user); // Debug log

        // Accept session user id whether stored as `id` or `_id`
        const sessionUserId = req.session.user && (req.session.user._id || req.session.user.id);
        if (!sessionUserId) {
            throw new Error('User not authenticated');
        }

        const { title, content } = req.body;
        
        const newsData = {
            title,
            content,
            createdBy: sessionUserId
        };

        if (req.file) {
            newsData.mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
            newsData.mediaUrl = `/uploads/${req.file.filename}`;
        }

        const news = new News(newsData);
        await news.save();

        res.redirect('/news');
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).render('error', { 
            message: 'Error creating news',
            error: error.message,
            user: req.session.user || null
        });
    }
};

exports.getNewsDetail = async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
            .populate('createdBy', 'username');
        
        // Fetch feedbacks for this news
        const Feedback = require('../models/Feedback');
        const feedbacks = await Feedback.find({ news: req.params.id })
            .sort({ createdAt: -1 });
        
        if (!news) {
            return res.status(404).render('error', { 
                message: 'News not found',
                user: req.session.user || null
            });
        }
        
        res.render('news/detail', { 
            news,
            feedbacks,
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Error fetching news detail:', error);
        res.status(500).render('error', { 
            message: 'Error fetching news detail',
            user: req.session.user || null
        });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};
