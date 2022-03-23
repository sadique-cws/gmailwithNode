const AccountModels = require("../models/AccountsModel")
const { body, validationResult } = require('express-validator');

const HomePage = (req,res) =>{
    return res.render("home")
}

const Signup = async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("danger","something went wrong")
      res.redirect("/");
    }
    if(req.body.password === req.body.cnf_password) {

        var checkStudent = await AccountModels.findOne({contact: req.body.contact,email: req.body.email})

        if(checkStudent  == null){
            var account = new AccountModels({
                fname : req.body.fname,
                lname : req.body.lname,
                email : req.body.email,
                contact : req.body.contact,
                dob : req.body.dob,
                gender : req.body.gender,
                password : req.body.password,
            });
            account.save();
        }
        else{
            req.flash('info', 'Email or contact already exits');
            console.log('Email or contact already exists in the DB')
        }
    }
    else{
        req.flash('danger', 'password not match');
        
    }

    res.redirect("/");
}
const Login = (req,res) =>{
    return res.render("login")
}


module.exports = {
    HomePage,
    Login,
    Signup,
}