const express = require("express");
const { validateToken } = require("../Controller/authController");
const router = express.Router();

router.get("/validateToken", validateToken);

module.exports = router;
