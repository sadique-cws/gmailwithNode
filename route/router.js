var express = require("express");
const { body, validationResult, check } = require('express-validator');
const { HomePage,Login, Signup, loginAction, Logout } = require("../controllers/AccountController");
const {Inbox, compose, OutBox,draft,trash, viewMail, moveToTrash}  = require("../controllers/GmailController");
const isAuth = require("../middleware/auth");
var router = express.Router()



router.get("/",HomePage);

router.post("/",[
    check("email").isEmail(),
    check("fname").isAlpha(),
    check("contact").isLength({max:10})
],Signup);

router.post("/compose",isAuth,compose)

router.get("/login",Login);
router.get("/logout",Logout);

router.post("/login",loginAction);


router.get("/inbox",isAuth,Inbox);
router.get("/outbox",isAuth,OutBox);
router.get("/draft",isAuth,draft);
router.get("/trash",isAuth,trash);
router.get("/view/:id",isAuth,viewMail);
router.get("/move-to-trash/:id",isAuth,moveToTrash);




module.exports = router