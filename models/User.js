//three field is needed 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//user schema

const userSchema = new mongoose.Schema({
    username:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true}
},{
    timestamps:true
});

//before saving we want to convert normal password to hashed ones
//it is actually middleware
userSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);  //salt is is random data added before hashing passwords. 10 is salt rounds --hashing process should be done 10 times --make it more 10 locks so that become difficult for hacker 10 -is standard

    user.password = await bcrypt.hash(user.password, salt);
  //once the password is changed to hashed password --continuw so next()
    next();
})



//we are creating model user that helps to interact with mongodb collection 
//Mongoose automatically converts it into a MongoDB collection name as users

const User = mongoose.model('user',userSchema);
mongoose.exports = User;