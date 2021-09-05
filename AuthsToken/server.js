const express = require("express");
const bpr = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookp = require("cookie-parser");

const app = express();
const port = process.env.port || 8000;
console.log(path.join(__dirname, "views"));

app.use(cookp());
app.use(bpr.json());
app.use(bpr.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

const users=[{
  name:'jatin',
  email:'jatin@gmail.com',
  password:'1111'
}]



app.get("/", (req, res) => {
  console.log(users)

  res.render("index");
});

app.get("/login",authenticate,(req, res) => {
  if(req.isAuth){
    res.redirect("/home");
  }else res.render("login");

});

app.post("/register", (req, res) => {
  if(req.body){
    users.push(req.body)
   return res.redirect("/login");
  }
  res.redirect("/");
});

app.post("/login", (req, res) => {
  const {email,password} = req.body;
  const Authuser =  users.filter(user=>user.email===email)
  
  if(!Authuser[0]){
    return res.redirect("/login");
  }
  if(Authuser[0].password===password){
    res.cookie("token", "1122",{httpOnly:true});
    res.redirect("/home");
  }
   
});

function authenticate(req, res, next) {
  const token = req.cookies.token;
  if (token === "1122") {
    req.isAuth = true;
  }
  next();
}

app.get("/home",authenticate,(req, res) => {
  if (req.isAuth) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie('token').redirect('/login')
});



app.listen(port, () => {
  console.log(`listening to ${port}`);
});
