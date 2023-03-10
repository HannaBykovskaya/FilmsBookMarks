const filmsAll = require('./models/filmsAll');
const ExpressError  = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) =>{
   if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed first');
   return  res.redirect('/login');
} next();
};

module.exports.isAuthor = async(req, res, next) =>{
   const {id }= req.params;   
const film = await filmsAll.findById(id);
if(!film.author.equals(req.user._id)){
   req.flash('error', 'You do not have permission to do that!');
  return  res.redirect(`/films/onefilm/${id}`);
}next();
};
