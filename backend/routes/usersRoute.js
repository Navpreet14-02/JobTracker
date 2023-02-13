const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt")
const asyncHandler = require("express-async-handler")


router.post("/register", asyncHandler(async (req, res) => {


    const {username,password,role,email}=req.body;

    if(!username || !password || !role|| !email){
      res.status(404);
      throw new Error("Enter all the required details");
    }

    const userExists = await User.findOne({email})

    if(userExists){
      res.status(400);
      throw new Error("User already Exists")
    }


    const hashedPwd = await bcrypt.hash(password,10);

    const newuser = new User({
      username,
      role,
      email,
      password:hashedPwd,
    });

    const user = await newuser.save();


    if(user){
      res.status(201).json({
        success:true,
        message:"User Created Successfully",
      })
    }
    else{
      res.status(400);
      throw new Error("Invalid User Data");
    }

    
  
}));

router.post("/login", asyncHandler(async (req, res) => {


  const {email,password} = req.body;

  const user = await User.findOne({email})

  if(user && (await bcrypt.compare(password,user.password))){
    res.status(200).json(user)
  }
  else{
    res.status(400);
    throw new Error("Invalid Credentials")
  }

}));

router.post("/update", async (req, res) => {


  try {
    await User.findOneAndUpdate({ _id: req.body._id }, req.body);

    const user = await User.findOne({ _id: req.body._id });

    res.send(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
});


router.get("/getallusers", async(req, res) => {
  
  try {
      const users = await User.find()
      res.send(users)
  } catch (error) {
      return res.status(400).json({ error });
  }

});

module.exports = router;
