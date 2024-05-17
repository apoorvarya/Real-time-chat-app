const {register,login, setAvatar,getAllUsers, firebaseLogin, checkUsername}=require("../controllers/usersController");
const router=require("express").Router();
router.post("/register",register);
router.post("/login",login);
router.post("/firebaseLogin",firebaseLogin );
router.post("/setavatar/:id",setAvatar)
router.get("/allUsers/:id",getAllUsers)
router.post("/checkUsername", checkUsername);
module.exports=router; 