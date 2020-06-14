const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   email :{
       type :String,
       required :true
   },
   password :{
    type :String,
    required :true
    },
    todolist :[
        {
            listTitle : {
                type :String,
            },
            listItem : [{
                type :String,
            }]
        }
    ]
});

userSchema.methods.addItem=function(id,itemName){
    const listIndex = this.todolist.findIndex(ct=>{
        return ct.id.toString() === id.toString();
    });
   const itemList = [...this.todolist[listIndex].listItem];
   itemList.push(itemName);
   this.todolist[listIndex].listItem = itemList;
   return this.save();
}

userSchema.methods.deleteItem=function(id ,deleteItemName){
    const listIndex = this.todolist.findIndex(ct=>{
        return ct.id.toString() === id.toString();
    });
    const updateList = this.todolist[listIndex].listItem.filter(item=>{
        return item !== deleteItemName.toString();
    });
    this.todolist[listIndex].listItem = updateList;
    return this.save();
}

module.exports = mongoose.model("Product", userSchema);