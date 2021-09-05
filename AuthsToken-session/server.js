const express = require("express");
const bpr = require("body-parser");
const session = require("express-session");
const store = require("express-mysql-session")(session);
const path = require("path");

const options = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "session",
  clearExpired: true
};

const mystore = new store(options);

const app = express();
const port = process.env.port || 8000;
//console.log(path.join(__dirname, "views"));
app.use(
  session({
    secret: "thisisrandom",
    cookie: {},
    resave: false,
    saveUninitialized: false,
    store: mystore,
  })
);
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

function auth(req, res, next) {
  if (req.session.isAuth && req.session.username) {
    console.log("auth---", req.session);
    res.redirect("/home");
    return;
  }
  console.log("auth--else");
  next();
  return;
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
    req.session.isAuth = true;
    req.session.username = Authuser[0].name;
    return res.redirect("/home");
  } else res.redirect("/login");
});

app.get("/home", (req, res) => {
  if (!req.session.isAuth) {
    console.log("NO home-");
    return res.redirect("/login");
  }
  console.log("homess-");
  res.render("home", { user: req.session.username });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");

  });
});

app.listen(port, () => {
  console.log(`listening to ${port}`);
});
