const mongoose = require('mongoose');
require('dotenv').config()

const userSchema = new mongoose.Schema({
    chatId: { type: String, required: true, unique: true },
    username: { type: String },
    isPremium: { type: Boolean, default: false },
    // Tambahkan kolom lain yang Anda perlukan untuk data pengguna
});

const User = mongoose.model('User', userSchema);

module.exports = User;
