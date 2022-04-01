var express = require("express")
const { connect } = require("./config/dbConfig")
var bodyParser = require('body-parser')
var flash = require('express-flash')
var app  = express()
var session =require("express-session");
var urLencoded = bodyParser.urlencoded({extended:false})
require("express-dynamic-helpers-patch")(app);


app.dynamicHelpers({session:function(req,res){
    return req.session;
}})



connect
app.locals.moment = require("moment")

app.use(express.json());
app.use(urLencoded)
app.use(flash());


app.use(session({
    secret:"ayush kamchor he",
    resave:true,
    saveUninitialized:true,
    cookie:{
        maxAge:24 * 60 * 60 * 1000,
    }
}))
var router = require('./route/router')

app.use("/",router)


app.set("view engine","pug")
app.set("views","./views")





app.listen(8081)



