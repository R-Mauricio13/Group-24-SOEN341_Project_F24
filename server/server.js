const express=require(`express`);
require('dotenv').config();
const mysql=require('mysql2')


//In order to connect to your MySQL database, you have to put in your login info in the .env file
const db=mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const app=express();
const path= require(`path`);

//Testing if we can access the db
app.get("/api",(req,res)=>{
    const query ="SELECT * FROM students";
    db.query(query,(err,data)=>{
        if(err)
        {
            return res.json("Error no data found");
        }
       return res.json(data);
    });

})

//Loading the homepage upon startup
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'../client/home.html'))
});

//Establishing port connection
const port= 8000;
app.listen(port,() =>
{
    console.log(`Server port running on '${port}'`);
})