const UserExist =(req,res,next)=>{
    if(req.user){
        return res.redirect("/user/list/"+req.user.id);
    }
    next();
}
module.exports =UserExist;