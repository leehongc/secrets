//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;



const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


// mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const secretUsersSchema = new mongoose.Schema({
  username: String,
  password: String
});

const SecretUser = mongoose.model("SecretUser", secretUsersSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new SecretUser({
      username: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if (err){
        console.log(err)
      } else {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  SecretUser.findOne({username: username}, function(err, foundUser){
    if (err){
      console.log(err)
    } else {
      if (foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result===true){
            res.render("secrets");
          }
        });
      }
    }
  });
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
