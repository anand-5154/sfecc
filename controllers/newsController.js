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
        const { title, content, mediaType } = req.body;
        const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const news = new News({
            title,
            content,
            mediaType,
            mediaUrl,
            createdBy: req.session.user._id
        });

        await news.save();
        res.redirect('/news');
    } catch (error) {
        res.status(500).render('error', { 
            message: 'Error creating news',
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
