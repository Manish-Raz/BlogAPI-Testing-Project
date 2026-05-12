const express = require('express')
const bodyParser = require('body-parser')
const app = express();

const PORT = 8000;
const cors = require('cors')
const authRoutes = require("./routes/authRoutes");


//when project starts then this two things will be automatically called 
require('dotenv').config();
require('./db');

app.use(cors());
app.use(bodyParser.json());
app.use("/users",authRoutes)

// app.use(express.json());


app.get('/',(req,res)=>{
    res.json({
        message:"Welcome to the API "
    })
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})