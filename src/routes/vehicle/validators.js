const Joi = require("joi");

exports.createVal = Joi.object({
    vehicle_number: Joi.string().required(),
    vehicle_type: Joi.string().required(),
})


exports.transferVal = Joi.object({
    vehicle_number: Joi.string().required(),
    driver_id: Joi.number().integer().required(),
})

exports.historyVal = Joi.object({
    vehicle_number: Joi.string().required(),
})