const express = require("express");
const userControllers = require("../controllers/user");
const isAuth =require("../middleware/is-auth");

const router = express.Router();

router.get("/user/list/:userId",isAuth,userControllers.getUser);

router.post("/add-item",userControllers.postAddItem);
router.post("/delete",userControllers.deleteUserListItem);

router.post("/createList",userControllers.postCreateList);

router.post("/deleteList",userControllers.postDeleteList);

router.get("/",userControllers.home);

module.exports = router;