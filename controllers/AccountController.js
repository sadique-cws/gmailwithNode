

const HomePage = (req,res) =>{
    return res.render("home")
}
const Login = (req,res) =>{
    return res.render("login")
}


module.exports = {
    HomePage,
    Login
}