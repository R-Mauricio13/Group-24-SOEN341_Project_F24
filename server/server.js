const express=require(`express`);
require('dotenv').config();
const mysql=require('mysql2')
const cors=require('cors');
const path= require(`path`);
const app=express();
app.use(cors());
app.use(express.json());



//In order to connect to your MySQL database, you have to put in your login info in the .env file
const db=mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});






//Testing if we can access the db
app.get("/students",(req,res)=>{
    const query =`SELECT * FROM ${students}`;
    db.query(query,(err,data)=>{
        if(err)
        {
            return res.json("Error no data found");
        }
       return console.log(data);
    });

})

//Testing POST to submit data to SQL
app.post("/create",(req,res)=>{
    
    const values=[
        req.body.firstname,
        req.body.lastname,
        req.body.role,
        req.body.username,
        req.body.password,
        req.body.team_id
    ];
    let person_type=""

    if(req.body.role==="student")
    {
        person_type=process.env.STUDENTS
        console.log("this is a student")

    }
    else
    {
        person_type=process.env.INSTRUCTORS
        console.log("this is an instructor")
    } 

    const query=`INSERT INTO ${person_type} (firstname,lastname,role,username,password VALUES(?)`;
    
    db.query(query,[values],(err,data)=>{
        if (err)
        {
            return res.json("Error account creation failed")
        }
        console.log("Account has been saved into database")
        return res.json(data)
    })

});


//Establishing port connection
const port= 8080;
app.listen(port,() =>
{
    console.log(`Server port running on '${port}'`);
})