const express = require('express');
const User = require('../models/user');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const FilmsAll = require('../models/filmsAll.js');
const FilmsCheck = require('../models/filmsCheck.js');
const {filmsAllSchema} = require('../validateSchemas');
const passport = require('passport');

router.get('/register', catchAsync(async(req, res) =>{
res.render('./users/register')
}));  
   
router.post('/register', catchAsync(async(req, res) =>{
try{
const {email, username, password} = req.body;
const user = new User({email, username});
const registeredUser = await User.register(user, password);
req.login(registeredUser, err=>{
if(err) return next(err);
req.flash('success', `${username} welcome to FilmBookMarks`);
res.redirect('/films');
});
}catch(error){
    console.log(error)
req.flash('error', error.message);
res.redirect('register');
}
}));

router.get('/login', (req, res) =>{
    res.render('./users/login')
});  

router.post(
    '/login',
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
      failureMessage: true,
      keepSessionInfo: true,
    }),
    (req, res) => {
        const { username } = req.body;
      req.flash('success', `${username} welcome back!`);
      const redirectUrl = req.session.returnTo || '/films';
      res.redirect(redirectUrl);
});

router.get('/logout', (req, res) =>{
    req.logout((err)=>{
    if(err){
        return next(err);
    }req.flash('success', 'Goodbye!');
    res.redirect('/films');
}); 
}); 

module.exports = router;