var express = require("express");
const { body, validationResult, check } = require('express-validator');
const { HomePage,Login, Signup, loginAction } = require("../controllers/AccountController");
const {Inbox}  = require("../controllers/GmailController");
var router = express.Router()


router.get("/",HomePage);
router.post("/",[
    check("email").isEmail(),
    check("fname").isAlpha(),
    check("contact").isLength({max:10})
],Signup);

router.get("/login",Login);
router.post("/login",loginAction);


router.get("/inbox",Inbox);




module.exports = router