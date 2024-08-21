const express = require("express");
const responseHandler = require("../../utils/responseHandler");
const validate = require("../../utils/validate");
const authMiddleware = require("../../middleware/auth");
const upload = require("../../utils/multer");
const { createVehicle, vehicles } = require("./controllers");
const { createVal } = require("./validators");

const router = express.Router();

router.post("/create-vehicle", authMiddleware, upload("vehicle_docs").fields([{ name: "puc_certificate", maxCount: 1 }, { name: "insurance_cert", maxCount: 1 }]), validate(createVal), responseHandler(createVehicle))
router.get("/vehicles-list", authMiddleware, responseHandler(vehicles))

module.exports = router