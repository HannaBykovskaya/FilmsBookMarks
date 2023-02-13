const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.js');

const filmsCheckSchema = new Schema({
    filmsAll:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'FilmsAll'
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model("FilmsCheck", filmsCheckSchema);