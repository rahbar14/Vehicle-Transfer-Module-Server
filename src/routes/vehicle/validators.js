const Joi = require("joi");

exports.createVal = Joi.object({
    vehicle_number: Joi.string().required(),
    vehicle_type: Joi.string().required(),
})