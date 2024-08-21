const Joi = require("joi");

exports.createVal = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().max(10).required(),
})