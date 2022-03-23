var mongoose = require("mongoose")

var Account = mongoose.Schema({
    fname : {type:String},
    lname : {type:String},
    contact : {type:String},
    email : {type:String},
    dob : {type:Date},
    gender : {type:String},
    password: {type:String}
})

var AccountModels = mongoose.model("account",Account);


module.exports  = AccountModels;