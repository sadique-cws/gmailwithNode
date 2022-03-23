var express = require("express");
const { body, validationResult, check } = require('express-validator');
const { HomePage,Login, Signup } = require("../controllers/AccountController");
var router = express.Router()


router.get("/",HomePage);
router.post("/",[
    check("email").isEmail(),
    check("fname").isAlpha(),
    check("contact").isLength({max:10})
],Signup);

router.get("/login",Login);


module.exports = router