// mongoose helps us interact with MongoDB
const mongoose = require('mongoose');

// bcrypt is used for hashing passwords
const bcrypt = require('bcrypt');


// ---------------- USER SCHEMA ----------------

// user schema defines the structure of documents inside MongoDB collection
const userSchema = new mongoose.Schema({

    // username field
    username: {
        type: String,
        required: true
    },

    // email field
    // unique:true means duplicate emails are not allowed
    email: {
        type: String,
        required: true,
        unique: true
    },

    // password field
    password: {
        type: String,
        required: true
    }

}, {

    // automatically adds:
    // createdAt
    // updatedAt
    timestamps: true
});



// ---------------- PASSWORD HASHING MIDDLEWARE ----------------

// pre('save') middleware runs BEFORE saving user data into MongoDB

userSchema.pre('save', async function () {

    // 'this' refers to current user document
    const user = this;

    // if password is not modified then do nothing
    // prevents password from getting hashed again and again
    if (!user.isModified('password')) return;

    // generate salt
    // salt is random data added before hashing password
    // 10 = salt rounds (standard security level)
    const salt = await bcrypt.genSalt(10);

    // convert normal password into hashed password
    user.password = await bcrypt.hash(user.password, salt);

    // no need for next()
    // because async function automatically returns a Promise
});



// ---------------- CREATE MODEL ----------------

// creates User model from schema
// Mongoose automatically converts 'User'
// into 'users' collection in MongoDB

const User = mongoose.model('User', userSchema);



// ---------------- EXPORT MODEL ----------------

// exporting model so it can be used in routes/controllers
module.exports = User;