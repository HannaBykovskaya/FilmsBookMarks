const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const FilmsAll = require('../models/filmsAll.js');
const FilmsCheck = require('../models/filmsCheck.js');
const {filmsAllSchema} = require('../validateSchemas');
const {isLoggedIn, isAuthor} = require('../middleware');

const validateFilmsAll = (req, res, next) =>{
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
}};

router.get('/', catchAsync(async(req, res)=>{
    let films = await FilmsAll.find({}).populate({
        path:'author'
    });
    let filmsCheckList = await FilmsCheck.find({author: req.user}).populate({
    path: 'filmsAll'
    }).populate({ path: 'author'});
    res.render('films', {films,  filmsCheckList});
}));

router.post('/', isLoggedIn, catchAsync (async(req, res)=>{
    const filmCheck = new FilmsCheck({author: req.user._id, filmsAll:req.body._id });
     await filmCheck.save();
    let filmsCheckList = await FilmsCheck.find({author: req.user}).populate({
        path: 'filmsAll'
    }).populate({ path: 'author'});
    req.flash('success',' You add a film to Watched');
    res.redirect(`/films`);   
 }));

router.delete('/', catchAsync(async(req, res)=>{
     await FilmsCheck.deleteOne({author: req.user}); 
    req.flash('success',' You delete a film successfully');
    res.redirect(`/films`);
 }));

router.get('/form', isLoggedIn, catchAsync(async(req, res)=>{
    let film;
    res.render('form');
}));

router.post('/form', isLoggedIn, catchAsync(async(req, res)=>{
    const {title, year, genre, image} = req.body;
    const film = new FilmsAll( {title, year, genre, image, author: req.user._id});
    await film.save();
    req.flash('success',' You add a film successfully');
    res.redirect(`/films/`)
}));

router.get('/onefilm/:id', catchAsync(async(req, res)=>{
    let film = await FilmsAll.findById(req.params.id).populate({
        path: 'author'
    });
    if(!film){
        req.flash('error', 'Cannot find this film!');
        return res.redirect('/films/');
    };
    res.render('show', {film});
 }));

 router.get('/onefilm/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res)=>{
      let film = await FilmsAll.findByIdAndUpdate(req.params.id);
      res.render('edit', {film})
 }));

 router.post('/onefilm/:id/edit', isLoggedIn, isAuthor,  catchAsync(async(req, res)=>{
    let film = await FilmsAll.findByIdAndUpdate(req.params.id,  {...req.body});
    await film.save();
    req.flash('success',' You edit a film successfully');
    res.redirect(`/films/onefilm/${film._id}`)
 }));

 router.delete('/onefilm/:id', isLoggedIn, isAuthor, catchAsync(async(req, res)=>{
    const {id} = req.params;
    await FilmsAll.findByIdAndDelete(id);
    req.flash('error',' You delete a film successfully');
    res.redirect('/films')
 }));

module.exports = router;