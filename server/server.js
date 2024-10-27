const express=require(`express`);
require('dotenv').config();
const mysql=require('mysql2')
const cors=require('cors');
const path= require(`path`);
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    // console.log(token);
    try {
        console.log("Token data:", token);
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user_id = tokenData.user_id;
        // console.log("user_id:", req.user_id);
        next();
    } catch (e) {
        res.clearCookie("token");
        return res.status(401).send("Invalid token");
    }
};

//In order to connect to your MySQL database, you have to put in your login info in the .env file
const db=mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});






//Testing if we can access the db
app.get("/students", cookieJwtAuth, (req, res)=>{
    const students=process.env.STUDENTS
    const query =`SELECT * FROM ${students}`;
    db.query(query,(err,data)=>{
        if(err)
        {
            return res.json("Error no data found");
        }
       return res.status(200).json(data)
    });

})

app.get("/login", (req, res) => {
    // const {email, password} = req.body;
    // const user_id = await app.AccountDatabase.loginUser(email, password);
    // if (user_id === false) {
    //     return res.status(401).redirect("http://intbets.com/login.html?invalid-creds=true");
    // };
    // const jwtToken = jwt.sign({user_id: user_id}, process.env.JWT_SECRET, {expiresIn: "2m"});
    // res.cookie("token", jwtToken, {
    //     httpOnly: true,
    //     // sameSite: 'None',  // need to set Secure too...
    // });
    // // res.status(200).send("Logged In!");
    // return res.redirect("http://intbets.com/account.html");

    const students = process.env.STUDENTS;
    const instructors = process.env.INSTRUCTORS;
    let personnel = "";

    if (req.query.user_role === "student") {
        personnel = students;
    } else if (req.query.user_role === "instructor") {
        personnel = instructors;
    } else {
        return res.status(400).redirect("http://localhost:3000/?error-msg=Invalid user role");
    }

    const query = `SELECT * FROM ?? WHERE username = ? AND user_role = ? AND user_password = ?`;

    db.query(query, [personnel, req.query.username, req.query.user_role, req.query.user_password], (err, data) => {
        if (err)
            return res.status(400).redirect("http://localhost:3000/?error-msg=Unexpected server error");

        if (data.length > 0) {
            const jwtToken = jwt.sign({user_id: data[0].id}, process.env.JWT_SECRET, {expiresIn: "2m"});
            res.cookie("token", jwtToken, {
                httpOnly: true,
                // sameSite: 'None',  // need to set Secure too...
            });
            if (req.query.user_role === "student") {
                return res.status(200).redirect("http://localhost:3000/Student_Login");
            } else if (req.query.user_role === "instructor") {
                return res.status(200).redirect("http://localhost:3000/Instructor_Login");
            }
            // return res.redirect("http://localhost:3000/introduction");
        }

        return res.status(401).redirect("http://localhost:3000/?error-msg=Invalid username or password");

    })
})

//Testing POST to submit data to SQL
app.post("/create",(req,res)=>{
    console.log("Attempting to create account");
    const values=[
        req.body.first_name,
        req.body.last_name,
        req.body.user_role,
        req.body.username,
        req.body.user_password,
      
    ];
    console.log(values);
    let person_type=""
    const person_name=values[0]
    const person_username=values[3]
    if(req.body.user_role==="student")
    {
        person_type=process.env.STUDENTS
        console.log(`attempting to add student: ${person_name} with username :${person_username}`)

    }
    else
    {
        person_type=process.env.INSTRUCTORS
        console.log(`attempting to add instructor: ${person_name} with username :${person_username}`)

    } 
    
    const query = `INSERT INTO ${person_type} (first_name, last_name, user_role, username, user_password) VALUES (?,?,?,?,?)`;

    console.log("Executing query:", query, "with values:", values);

    
    db.query(query, values, (err, data) => {
        if (err) {
            console.error("MySQL error: ", err);
            return res.status(500).json("Error: Account creation failed");
        }
        console.log("Data inserted successfully:", data);
        return res.status(200).json(data);
    });

});


//Establishing port connection
const port= 8080;
app.listen(port,() =>
{
    console.log(`Server port running on '${port}'`);
})
