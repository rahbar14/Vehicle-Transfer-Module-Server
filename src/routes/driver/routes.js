const express = require("express");
const responseHandler = require("../../utils/responseHandler");
const validate = require("../../utils/validate");
const authMiddleware = require("../../middleware/auth");
const upload = require("../../utils/multer");
const { createDriver, drivers } = require("./controllers");
const { createVal } = require("./validators");

const router = express.Router();

router.post("/create-driver", authMiddleware, upload("profile").single("photo"), validate(createVal), responseHandler(createDriver))
router.get("/drivers-list", authMiddleware, responseHandler(drivers))

module.exports = router