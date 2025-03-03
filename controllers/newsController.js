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

        if (!req.session.user || !req.session.user.id) {
            throw new Error('User not authenticated');
        }

        const { title, content } = req.body;
        
        // Create news object with required fields
        const newsData = {
            title,
            content,
            createdBy: req.session.user.id
        };

        // Add media info only if a file was uploaded
        if (req.file) {
            newsData.mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
            newsData.mediaUrl = `/uploads/${req.file.filename}`;
        }

        console.log('Creating news with data:', newsData); // Debug log

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
