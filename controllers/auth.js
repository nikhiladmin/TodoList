const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
   res.render("auth/login", {
      pageTitle: "Login",
      oldInput: { email: "", password: "" },
      errorMessage :null
   });
};

exports.postLogin = (req, res, next) => {
   const email =req.body.email;
   const password=req.body.password;
   const errors = validationResult(req);
   if(!errors.isEmpty()){
    return res.status(422).render("auth/login",{
        pageTitle : "login",
        errorMessage : errors.array()[0].msg,
        oldInput : {email :email,password :password },
    });
  }

  User.findOne({email :email}).then(user=>{
    if(!user){
        req.flash("error","Invalid Email or Password");
        return res.redirect("/signup");
        }
        bcrypt.compare(password, user.password)
        .then(isMatch=>{
            if(isMatch){
            req.session.isLoggedIn = true;  
            req.session.user=user;
            return req.session.save(()=>{
            res.redirect("/user/list/"+user.id);
            });
            }else{
                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                    res.status(422).render("auth/login",{
                    pageTitle : "login",
                    errorMessage : "Password not correct !",
                    oldInput : {email :email,password :password },
                });
                
            }
        })
        .catch(err=> console.log(err));
    })
.catch(err=> console.log(err));
};

exports.getSignup = (req, res, next) => {
   res.render("auth/Signup", {
      pageTitle: "Signup",
      errorMessage : null,
      oldInput: { email: "", password: "", confirmPassword: "" },
   });
};

exports.postSignup = (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;
   const confirmPassword = req.body.confirmPassword;
 const errors = validationResult(req);
   if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("auth/signup", {
         path: "/signup",
         pageTitle: "Signup",
         errorMessage: errors.array()[0].msg,
         oldInput: { email: email, password: password, confirmPassword: confirmPassword },
         validationErrors: errors.array()
      });
   }
   bcrypt
   .hash(password, 12)
   .then(hashedPassword => {
     const user = new User({
       email: email,
       password: hashedPassword,
       todolist :[]
     });
     return user.save();
   }).then(result=>{
       res.redirect("/login");
   })
.catch(err => {
 console.log(err);
});
};

exports.postLogout = (req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect("/login");
    });
}
