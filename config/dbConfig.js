var mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/gmail",function (error) {
    if (error) {
        console.log(error);
    }
    else{
        console.log('connected');
    }
});

module.exports = mongoose 

