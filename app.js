const express = require("express");
const app = express();
const port = process.env.port || 3000;
const user = require("./models/usermodel");
const bcrypt = require("bcryptjs");
let curr = [];
let curr_user = "-1";
require("./db/conn");

app.set("view engine", "ejs"); //setting up ejs

app.use(express.static("public")); //setting up public static folder
app.use(express.json()); //to use bodyparser and json format files
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  curr_user = "-1";
  cur = [];
  res.render("login");
});

app.post("/", async (req, res) => {
  try {
    const email = req.body.e_mail;
    const pass = req.body.password;
    const find_user = await user.findOne({ e_mail: email });
    console.log(find_user);

    if (find_user === null) {
      res.render("error", {
        err: "Invalid Email Address!",
        route: "/",
      });
    } else if (bcrypt.compareSync(pass, find_user.password)) {
      curr_user = find_user._id;
      curr = find_user.data;
      console.log(curr);
      res.redirect("home");
    } else {
      res.render("error", {
        err: "Wrong Password!",
        route: "/",
      });
    }
  } catch (err) {
    res.send(err);
  }
});

app.get("/home", async (req, res) => {
  if (curr_user !== "-1") {
    await user.findByIdAndUpdate(curr_user, { $set: { data: curr } });
  }
  res.render("home", { blogs: curr });
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/register", async (req, res) => {
  try {
    // console.log(req.body);
    const pass = req.body.password;
    const cpass = req.body.cpassword;
    const fname = req.body.first_name;
    const lname = req.body.last_name;
    const email = req.body.e_mail;
    const phone = req.body.phone_number;
    const Gender = req.body.Gender;
    const dob = req.body.date_of_birth;
    if (cpass === pass) {
      const existing = await user.find({ e_mail: email });
      // console.log(existing.length);
      if (existing.length > 0) {
        res.render("error", {
          err: "Email Already Exists!",
          route: "/register",
        });
      } else {
        const user_reg = new user({
          first_name: fname,
          last_name: lname,
          date_of_birth: dob,
          gender: Gender,
          e_mail: email,
          phone_number: phone,
          password: pass,
        });
        console.log(user_reg);

        user_reg.save();

        res.render("login");
      }
    } else {
      res.render("error", {
        err: "Passwords Don't match!",
        route: "/register",
      });
    }
  } catch (err) {
    res.status(400).send(req);
  }
});

app.post("/home", (req, res) => {
  curr.push({
    user_title: req.body.title,
    user_data: req.body.data,
  });
  res.redirect("home");
});

app.listen(port, () => {
  console.log("Online...");
});
