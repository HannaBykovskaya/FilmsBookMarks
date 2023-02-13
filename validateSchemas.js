const Joi = require('joi');

module.exports.filmsAllSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required().min(1910).max(new Date().getFullYear()),
    genre: Joi.string().required(),
    image: Joi.string().required()
});