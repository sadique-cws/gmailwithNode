var express = require("express");
const { HomePage,Login } = require("../controllers/AccountController");
var router = express.Router()

router.get("/",HomePage);
router.get("/login",Login);


module.exports = router