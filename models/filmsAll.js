const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.js');

const filmsAllSchema = new Schema({
    title: String,
    year: Number,
    genre: String,
    image: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model("FilmsAll", filmsAllSchema);