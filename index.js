const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverRide =  require('method-override');
const ejsMate = require('ejs-mate');
const {filmsAllSchema} = require('./validateSchemas');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const User = require('./models/user');

const bodyParser = require('body-parser');
const app = express();

const FilmsAll = require('./models/filmsAll.js');
const FilmsCheck = require('./models/filmsCheck.js');

const userRoutes = require('./routes/users');
const filmRoutes = require('./routes/films');
 
const passport = require('passport');
const LocalStrategy = require('passport-local');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverRide('_method'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/YourCollection')
.then(()=>{
    console.log("Mongo connection open!");
})
.catch(err =>{
    console.log("Oh noo! Mongo Error!");
    console.log(err);
});

const sessionConfig = {
    name: ' ',
    secret:' ',
    resave:false,
    saveUninitialized: true,
    cookies:{
        httpOnly: true,
        secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/films', filmRoutes);
app.use('/', userRoutes);

app.get('/', (req, res)=>{
    res.render('home');
});

app.all('*', (req, res, next)=>{
    next(new ExpressError('Page not found!', 404))
});

app.use((err, req, res, next)=>{
    const {statusCode = 500, message = 'Something went wrong'} = err;
    if(!err.message) err.message = 'There are some errors!'
    res.status(statusCode).render('error', {err});
});

app.listen(3000, ()=>{
    console.log('Lets go on port 3000!')
});