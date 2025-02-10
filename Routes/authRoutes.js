const express = require("express");
const { login, register } = require("../Controller/authController");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);

module.exports = router;
