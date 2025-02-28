const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', isAuthenticated, newsController.getAllNews);
router.get('/create', isAdmin, newsController.getCreateNews);
router.post('/create', isAdmin, upload.single('media'), newsController.createNews);
router.get('/:id', isAuthenticated, newsController.getNewsDetail);
router.delete('/:id', isAdmin, newsController.deleteNews);

module.exports = router;
