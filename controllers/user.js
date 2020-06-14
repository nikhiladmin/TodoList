const User =require("../models/user");

exports.getUser =(req,res,next)=>{
    User.findById(req.params.userId).then(user=>{
       
        res.render("user/list",{
            pageTitle:"TODO",
            todoList : user.todolist
        });
    })
   
}

exports.postAddItem=(req,res,next)=>{
    const userListId = req.body.userListId;
    const itemName = req.body.newItem;
    req.user.addItem(userListId,itemName).then(()=>{
        return res.redirect("/user/list/"+req.user.id);
    }
    ).catch(err=>{
        console.log(err);
    });
}

exports.deleteUserListItem=(req,res,next)=>{
    const userListId= req.body.userListId;
    const deleteItemName =req.body.deleteItemName;
    req.user.deleteItem(userListId,deleteItemName).then(()=>{
        return res.redirect("/user/list/"+req.user.id);
    }
    ).catch(err=>{
        console.log(err);
    });
}

exports.postCreateList=(req,res,next)=>{
    const listName =req.body.newList;
    const newList = {
        listTitle : listName,
        listItem : []
    }
    User.updateOne(
        { _id: req.user.id }, 
        { $push: { todolist : newList } },
    ).then(()=>{
        return res.redirect("/user/list/"+req.user.id);
    }).catch(err=>{
        console.log(err);
    });
    
}


exports.postDeleteList = (req,res,next)=>{
    const userListId = req.body.deleteList;
    User.updateOne(
        {_id : req.user.id},
        {"$pull" : { "todolist" :{ _id : userListId}}
    }
    ).then(()=>{
        return res.redirect("/user/list/"+req.user.id);
    }).catch(err=>{
        console.log(err);
    });
}

exports.home =(req,res,next)=>{
    res.render("home",{
        pageTitle : "TODO List"
    });
}