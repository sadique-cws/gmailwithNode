var express = require("express")
var app  = express()

var router = require('./route/router')

app.use("/",router)


app.set("view engine","pug")
app.set("views","./views")





app.listen(8081)



