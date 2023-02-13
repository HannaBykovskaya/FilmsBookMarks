const mongoose = require('mongoose');
const FilmsCheck = require('../models/filmsCheck.js');
const User = require('../models/user.js');

mongoose.set('strictQuery', true);
// mongoose.connect('mongodb://localhost:27017/YourCollection');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
const user =  new User({
      //name: 'Enter Your Name'
})
await user.save();
};
 
seedDB().then(() => {
    mongoose.connection.close();
});