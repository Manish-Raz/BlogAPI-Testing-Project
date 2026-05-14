const express= require("express")
const router = express.Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

router.post('/createblog',auth,async(req,res)=>{
    console.log(req.user);
    res.json({
        message:'ok',
        user:req.user
    })
})


module.exports = router;