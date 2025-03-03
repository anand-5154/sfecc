const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

router.get('/', newsController.getAllNews);
router.get('/create', isAdmin, newsController.getCreateNews);
router.post('/create', isAdmin, upload.single('media'), newsController.createNews);
router.get('/:id', isAuthenticated, newsController.getNewsDetail);
router.delete('/:id', isAdmin, newsController.deleteNews);

module.exports = router;
