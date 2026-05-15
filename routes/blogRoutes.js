const express= require("express")
const router = express.Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

router.post('/createblog',auth,async(req,res)=>{
const owner = (req.user._id);
const { title, blog} = req.body;

try{
    const newblog = new Blog({
        title,
        blog,
        owner
    });

    await newblog.save();
    res.json({
        message:"Blog created successfully"
    });
}
catch(err){
    res.status(500).json({
        message:err.message
    })
}
    // res.json({
    //     message:'ok',
    //     user:req.user
    // })
})

//get all blog routes
router.get('/getallblogs', async (req,res)=>{
    try{
        const blogs = await Blog.find({}); //all blog
        res.json({
            message:"Blog fetched successfully",
            blogs
        })

    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})

//specific blog
router.get("/getallblogs/:id", async (req,res)=>{
    try{
        const blog= await Blog.findById(req.params.id);
        res.json({
            message:"Blog fetched successfully",
            blog
        });
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})

//update blogs
router.patch('/updateblog/:id', auth, async (req,res)=>{
    const {title, blog } = req.body;

    try{
        //find the id of blog and and also the owner id
        const newblog = await Blog.findOne({_id:req.params.id, owner: req.user._id});
        if(!newblog){
            res.status(400).json({
                message:" Blog not found !!"
            })
        }
        newblog.title = title;
        newblog.blog= blog;
        await newblog.save();

        res.json({
            message:"Blog is updated successfully"
        })

    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})


//deleteblog
router.delete('/deleteblog/:id', auth, async (req, res) => {

    try {

        // Find the blog by id and owner
        const blog = await Blog.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        // If blog not found
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found !!"
            });
        }

        res.json({
            message: "Blog deleted successfully"
        });

    }
    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

module.exports = router;