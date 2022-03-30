var mongoose = require("mongoose")

var Mail = mongoose.Schema({
    senderId : {type:mongoose.Schema.Types.ObjectId,ref:"account"},
    recieverId : {type:mongoose.Schema.Types.ObjectId,ref:"account"},
    subject : {type:String},
    content : {type:String},
    attachment : {type:String,default:false},
    date : {type:Date},
    status: {type:Number,default:1}
})

// status 1. send, 0 = draft -1 = trash

var MailModels = mongoose.model("mail",Mail);


module.exports  = MailModels;