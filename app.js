const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config();
const port = process.env.port || 3000

app.get('/' , async (req,res)=>{
    try{
        res.send("hellow")
    }catch(err){
        res.status(500).json({message:"something went wrong" , err})
    }
})
app.listen(port , ()=>{
    console.log(`server is running on http://localhost:${port}`)
})
