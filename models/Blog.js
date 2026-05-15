const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title:{
        type: String, 
        required:true
    },
    blog:{
        type:String,
        required: true
    },
    owner:{
        //who created this blog-that person id will be stored here-this format is used mongodb to store obj
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }
},{
    timestamps:true
});

const Blog = mongoose.model('Blog',blogSchema);

module.exports = Blog;
