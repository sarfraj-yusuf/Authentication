//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
// const mfe = require("mongoose-field-encryption").fieldEncryption;


const app = express();
app.set(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true }).then(() => {
    console.log("Connected to the mongodb server");
});



const userSchema = new mongoose.Schema({
    email: {
        type: 'string',
    },
    password: {
        type: 'string',
    }
});

userSchema.plugin(encrypt, {secret: process.env.SECRET_KEY, encryptedFields: ['password'], excludeFromEncryption: ['email']} );

const User = mongoose.model('User', userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        const userName =  req.body.username;
        User.findOne({email: userName}).then((user)=>{
            if(user.password === req.body.password){
                res.render("secrets");
            } else{
                res.redirect("/")
            }
        }).catch((error)=>{
            console.log(error);
        })
    });

app.route("/register")
    .get( (req, res) => {
        res.render("register");
    })
    .post( (req, res) => {
        User.create({email: req.body.username, password: req.body.password})
        .then(()=>{
            console.log("user Registered");
            
        });
        res.redirect("/login");
    });
app.get("/logout", (req, res) =>{
    res.redirect("/")
})


app.listen("3000", () => console.log("server has been started at port 3000"))