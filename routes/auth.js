const express = require("express");
const {body} =require("express-validator");
const authControllers = require("../controllers/auth");
const User = require("../models/user");
const UserExist= require("../middleware/ExistingUser");
const router = express.Router();

router.get("/login",UserExist,authControllers.getLogin);
router.post("/login",[
    body("email",'Email is not correct').isEmail(),
    body("password").isLength({min :6}).withMessage('must be at least 6 chars long')
],authControllers.postLogin);


router.get("/signup",UserExist,authControllers.getSignup);

router.post("/signup",  [
        body("email").isEmail().custom((value) =>{
            return User.findOne({ email: value })
            .then(userDoc => {
            if (userDoc) {
                console.log(userDoc);
            return Promise.reject('Email already Exist !');
          }
        })
    }),
        body("password","must be at least 6 chars long").isLength({min :6}),
        body("confirmPassword")
        .custom((value ,{req})=>{
            if(value !== req.body.password){
                throw new Error("Password does not match !");
            }else{
            return true;
            }
   })],
authControllers.postSignup);


router.post("/logout",authControllers.postLogout);

module.exports = router;