const express= require("express")
const router = express.Router();
const bcrypt = require('bcrypt')

//express provides mini route handler that organize routes separately from main app. Instead of writing all routes in app.js. dev creates routers like userRouter, authRouter, etc to keep code clean and modular
//routers make the project easier to manage, scale, and maintain 
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { model } = require("mongoose");
const nodemailer = require('nodemailer');




//some config for nodemailer--this is owner emails this will send otp to everyone
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'rajakaryan710@gmail.com',
        pass:process.env.COMPANY_PASSWORD
    }
})
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

router.post("/sendotp", async (req,res)=>{
    const {email}= req.body;
    //generating random 6 digit otp 
    const otp = Math.floor(100000 + Math.random()* 900000);
    try{
        const mailOptions ={
            from:process.env.COMPANY_EMAIL,
            to:email,
            subject:"OTP for verification",
            text:`Your OTP for verification is ${otp}`
        }

        transporter.sendMail(mailOptions, async (err, info)=>{
            if(err){
                res.status(500).json({
                    message:err.message
                });
            }
            else{
                //saving opt to specific user in db
                const user = await User.findOne({email});
                if(!user){
                    return res.status(400).json({
                        message:'User not found'

                    });
                }

                user.otp = otp;
                await user.save();
                console.log(otp);

                
                res.json({
                    message:"OTP sent successfully"
                });
            }
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message
        });
    }

})

//changing password when it is done we remove otp 
router.post('/changepassword', async (req, res)=>{
    const {email, otp, newpassword}  = req.body;

    try{
        const user =await  User.findOne({email});
        if(!user){
            return res.status(404).json({
        message: "User not found"
    });
        }

        //about invalid otp
        if(user.otp != otp){
           return res.status(400).json({
                message:"Invalid OTP"
            });
        }

        //when everything is great user is authenicated then we change the password
        user.password = newpassword;
        user.otp = null;
        await user.save();

        res.json({
            message:"Password changed successfully"
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




/*{
    "username": "Neha Ydav",
    "email": "manrajaaaak3456@gmail.com",
    "password": "123456789manish"
}*/