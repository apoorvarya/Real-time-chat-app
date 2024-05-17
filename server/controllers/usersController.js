const Users=require("../model/userModel");
const bcrypt=require("bcrypt");
module.exports.register = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const usernameCheck = await Users.findOne({ username });
      if (usernameCheck) {
        return res.json({ msg: "Username already exists", status: false });
      }
      const emailCheck = await Users.findOne({ email });
      if (emailCheck) {
        return res.json({ msg: "Email already exists", status: false });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Users.create({
        username,
        email,
        password: hashedPassword,
      });
      const userObj = user.toObject(); // Convert Mongoose model to plain JavaScript object
      delete userObj.password;
      return res.json({ status: true, user: userObj });
    } catch (ex) {
      next(ex);
    }
  };
  

module.exports.login = async(req,res,next)=>{
    try{
        const{username, password} = req.body;
        const user=await Users.findOne({username});
        if(!user){
            return res.json({msg: "Incorrect username or password",status: false})
        }
    
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.json({msg: "Incorrect username or password",status: false})
        }
        delete user.password;
        return res.json({status:true,user});
    }
    catch(ex){
        next(ex);
    }
    
}; 
module.exports.setAvatar = async (req, res, next) => {
    try {
      const userId = req.params.id;
      console.log(userId);
      const avatarImage = req.body.image;
      const userData = await Users.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage, 
        },
        { new: true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  };

module.exports.getAllUsers=async(req,res,next)=>{
    try{
        const users= await Users.find({_id: { $ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    }catch(ex){
        next(ex);
    }
};

module.exports.firebaseLogin = async(req, res, next)=>{
  try{
    const {email} = req.body;
    console.log(email)
    if(email){
      const user = await Users.findOne({email}); 
      if(user){
        delete user.password;
        return res.json({status: true, user});
      }else{
        return res.json({
          status: false,
          msg: "Email not found in database, welcome new user.",
        });
      }
    }
  }catch(ex){
    next(ex);
  }
};
module.exports.checkUsername = async(req, res, next) => {
  try{
    const { username } = req.body;
    const user = await Users.findOne({username});
    if(user){
      return res.json({
        status: false,
        msg: "Username unavailable.",
      });
    }else{
      return res.json({
        status: true,
        msg: "Username available."
      });
    }
  }catch(ex){
    next(ex);
  }
}