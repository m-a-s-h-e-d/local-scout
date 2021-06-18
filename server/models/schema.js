var mongoose = require('mongoose');

var urlSchema = new mongoose.Schema({
    originalURL: String,
    codeURL: { type: String, unique: true },
    creationDate: { type: Date, default: Date.now }
})


module.exports = {
    URL: mongoose.model('URL', urlSchema)
};