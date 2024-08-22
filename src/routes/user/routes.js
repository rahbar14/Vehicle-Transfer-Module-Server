const express = require("express");
const responseHandler = require("../../utils/responseHandler");
const { register, login, getUser, logout, dashboard } = require("./controllers");
const validate = require("../../utils/validate");
const { registerVal, loginVal } = require("./validators");
const authMiddleware = require("../../middleware/auth");

const router = express.Router();

router.post("/register", validate(registerVal), responseHandler(register))
router.post("/login", validate(loginVal), responseHandler(login))
router.get("/get-user", authMiddleware, responseHandler(getUser))
router.get("/dashboard", authMiddleware, responseHandler(dashboard))
router.get("/logout", authMiddleware, responseHandler(logout))

module.exports = router