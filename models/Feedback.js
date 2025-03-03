const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    news: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema); 