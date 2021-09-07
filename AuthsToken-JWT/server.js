const express = require("express");
const bpr = require("body-parser");
const cook = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.port || 8000;
app.use(cook());
app.use(bpr.json());
app.use(bpr.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

const users = [
  {
    name: "jatin",
    email: "jatin@gmail.com",
    password: "1111",
  },
];

const secret = "this is secret jwt string";

function auth(req, res, next) {
  jwt.verify(req.cookies.token, secret, (err, decode) => {
    if (err) {
      next();
    } else res.redirect("/home");
  });
}

app.get("/", auth, (req, res) => {
  res.render("index");
});

app.post("/register", (req, res) => {
  if (req.body) {
    users.push(req.body);
    return res.redirect("/login");
  }
  res.redirect("/");
});

app.get("/login", auth, (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  console.log("login");
  const { email, password } = req.body;
  const Authuser = users.filter((user) => user.email === email);
  if (!Authuser[0]) {
    return res.redirect("/login");
  }

  if (Authuser[0].password === password) {
    const token = jwt.sign({ name: Authuser[0].name }, secret);
    res.cookie("token", token);
    res.redirect("/home");
  } else res.redirect("/login");
});

app.get("/home", (req, res) => {
  jwt.verify(req.cookies.token, secret, (err, decode) => {
    if (!err) res.render("home", { user: decode.name });
    else res.redirect("/login");
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

app.listen(port, () => {
  console.log(`listening to ${port}`);
});
