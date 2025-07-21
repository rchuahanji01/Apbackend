const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config();
const port = process.env.port || 3000
const connectDb = require('./Database/mongodb')
const PostgresDb = require('./Database/postgresdb')
const encrypt = require('./Middelwares/DecryptJson')
const cors = require('cors')
app.use(cors());

// ✅ OR: Allow specific origin (more secure for prod)
app.use(cors({
  origin: 'http://localhost:5173', // or your deployed frontend domain
  credentials: true, // only if you're using cookies
}));

app.get('/' , async (req,res)=>{
    try{
        res.send("hellow")
    }catch(err){
        res.status(500).json({message:"something went wrong" , err})
    }
})

app.use('/api/Automation/index' , require('./restApi/mainIndex/index'))
app.use('/api/Automation/Auth' , require('./restApi/Auth/Auth'))
console.log('<<<<<<<<<<<<<<<<<< all route executed>>>>>>>>>>>>>>>>>>>')
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