const express = require("express");
const responseHandler = require("../../utils/responseHandler");
const { test } = require("./controllers");

const router = express.Router();

router.get("/", responseHandler(test))

module.exports = router