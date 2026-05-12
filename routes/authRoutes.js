const express= require("express")
const router = express.Router();
const bcrypt = require('bcrypt')

//express provides mini route handler that organize routes separately from main app. Instead of writing all routes in app.js. dev creates routers like userRouter, authRouter, etc to keep code clean and modular
//routers make the project easier to manage, scale, and maintain 

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { model } = require("mongoose");




//get 
router.get("/",(req,res)=>{
    res.json({
        message:"User route is working..."
    })
})


//creating register routes
router.post('/register', async (req,res)=>{
    try{
        const {username,email,password}= req.body;
        const user = new User({ username, email, password});
        await user.save();
        res.json({
            message:"User created successfully"
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })

    }
})

//login routes
router.post('/login', async (req,res)=>{
    try{
        const {email,password}= req.body;
       const user = await User.findOne({email});
       if(!user){
        return res.status(400).json({
            message:"user not found"
        })
       }

       const isMatch = await bcrypt.compare(password, user.password);
       if(!isMatch){
        return res.status(400).json({
            message:"Invalid Credentials"
        });
       }

       //else 
        const token = jwt.sign({
            userId:user._id
        },process.env.JWT_SECRET_KEY);

        //when everything is fine then send this 
        res.json({
            token, user, message:"User logged in successfully"
        });
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })

    }
})
//we created router and added all routes into it so we export it


module.exports = router;