//check whether this user is valid one or not

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ',''); // we get only token no extra charac
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);   //it is actually a obj that has userId
        console.log(decoded);

        const user = await User.findOne({
        _id:decoded.userId
        });

        if(!user){
            throw new Error("Unable to login, Invalid credentials");
        }

        //when everything is good then send the user in req part
        req.user = user;
        req.token = token;
        next();    //-- call to next api
    }
    catch(err){
        res.status(401).json({
            message:err.message
        });
    }
}

module.exports = auth;