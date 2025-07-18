const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config();
const port = process.env.port || 3000
const connectDb = require('./Database/mongodb')


app.get('/' , async (req,res)=>{
    try{
        res.send("hellow")
    }catch(err){
        res.status(500).json({message:"something went wrong" , err})
    }
})
const StartServer = async ()=>{
    try{
        
        app.listen(port , ()=>{
            console.log(`server is running on http://localhost:${port}`)
        })
        await connectDb()
    }catch(err){
        console.log('An exception occured while connectinf db' , err)
    }
}

StartServer()