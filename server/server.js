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
<<<<<<< HEAD
    const query =`SELECT * FROM ${user_students}`;
=======
    const students=process.env.STUDENTS
    const query =`SELECT * FROM ${students}`;
>>>>>>> 75425f42546cd0effd2af0f91f2a9eade70faf90
    db.query(query,(err,data)=>{
        if(err)
        {
            return res.json("Error no data found");
        }
       return res.status(200).json(data)
    });

})

app.get("/login",(req, res)=>{
    const students = process.env.STUDENTS;
    const instructors = process.env.INSTRUCTORS;
    let personnel = "";
    console.log(req.query);

    if (req.query.role==="student")
    {
        console.log("Student Login");
        personnel = students;
    }
    else
    {
        console.log("Instructor Login");
        personnel = instructors;
    }

    const query = `SELECT password FROM ${personnel} WHERE username = ?`;

    db.query(query, [req.query.username], (err, data) => {
        console.log(query);
        if (err)
        {
            return res.json("No account found");
        }
        
        console.log("Account found");
        console.log(data[0].password);
        res.send(data[0].password);
    })
})

//Testing POST to submit data to SQL
app.post("/create",(req,res)=>{
    
    const values=[
        req.body.firstname,
        req.body.lastname,
        req.body.role,
        req.body.username,
        req.body.password,
       
    ];
    let person_type=""
    const person_name=values[0]

    if(req.body.role==="student")
    {
        person_type=process.env.STUDENTS
<<<<<<< HEAD
        console.log("this is a student")
=======
        console.log(`attempting to add student: ${person_name}`)

>>>>>>> 75425f42546cd0effd2af0f91f2a9eade70faf90
    }
    else
    {
        person_type=process.env.INSTRUCTORS
        console.log(`attempting to add instructor: ${person_name}`)

    } 
    
    const query=`INSERT INTO ${person_type} (firstname,lastname,role,username,password) VALUES(?)`;


    
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