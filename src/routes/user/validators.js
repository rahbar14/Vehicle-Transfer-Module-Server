const Joi = require("joi");

exports.registerVal = Joi.object({
    email: Joi.string().email().required(),
    gender: Joi.string().valid("male", "female").required(),
    username: Joi.string().required(),
    password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
    phone: Joi.string().max(10).required(),
})

exports.loginVal = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})