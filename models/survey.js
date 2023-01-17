const Joi = require('joi');

const schema = Joi.object().keys({
    score: Joi.number().required(),
    comment: Joi.string().required(),
    
});

module.exports = schema;