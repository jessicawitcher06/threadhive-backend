const mongoose = require('mongoose');

const subredditSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, required: true }
});

module.exports = mongoose.model('Subreddit', subredditSchema);