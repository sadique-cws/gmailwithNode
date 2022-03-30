const AccountModels = require("../models/AccountsModel");

function isAuth(req,res,next){
    AccountModels.findById(req.session.user).exec(function(error,user){
        if(error){
            return next(error);
        }
        else{
            if(user == null){
                res.redirect("/login");
            }
            else{
                return next();
            }
        }
    })
}

module.exports = isAuth;