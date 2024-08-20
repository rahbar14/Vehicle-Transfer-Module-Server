const express = require("express");
const responseHandler = require("../../utils/responseHandler");
const { register, login } = require("./controllers");
const validate = require("../../utils/validate");
const { registerVal, loginVal } = require("./validators");

const router = express.Router();

router.post("/register", validate(registerVal), responseHandler(register))
router.post("/login", validate(loginVal), responseHandler(login))

module.exports = router