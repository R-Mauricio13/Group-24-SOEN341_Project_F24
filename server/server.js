const express = require(`express`);
require('dotenv').config();
const mysql = require('mysql2')
const cors = require('cors');
const path = require(`path`);
const app = express();
app.use(cors());
app.use(express.json());



//In order to connect to your MySQL database, you have to put in your login info in the .env file
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});




//Api call to GET teams with team_name & team_size
app.get("/student_groups",(req,res)=>{
    const student_groups=process.env.TEAMS
    const query =`SELECT * FROM ${student_groups}`
    db.query(query,(err,data)=>{
        if(err)
        {
            return res.json("Error could not access MySQL")
        }
        return res.status(200).json(data);
    })
})


//Testing if we can access the db
app.get("/students", (req, res) => {
    const students = process.env.STUDENTS
    const query = `SELECT * FROM ${students}`;
    db.query(query, (err, data) => {
        if (err) {
            return res.json("Error no data found");
        }
        return res.status(200).json(data)
    });

})

app.get("/login", (req, res) => {
    const students = process.env.STUDENTS;
    const instructors = process.env.INSTRUCTORS;
    let personnel = "";

    if (req.query.user_role === "student") {
        personnel = students;
    } else if (req.query.user_role === "instructor") {
        personnel = instructors;
    } else {
        return res.status(400).json({ error: "Invalid user role" });
    }

    const query = `SELECT * FROM ?? WHERE username = ? AND user_role = ? AND user_password = ?`;

    db.query(query, [personnel, req.query.username, req.query.user_role, req.query.user_password], (err, data) => {
        if (err)
            return res.json(false);

        res.send(data.length > 0);

        // TODO: cookie auth here
    })
})

//Api call to post to SQL for team creation
app.post("/Create_Team", (req, res) => {
    console.log("Attempting to create team")
    const values = [
        req.body.team_name,
        req.body.team_size,
    ]

    console.log(values);
    let sql_team_table = process.env.TEAMS

    const query = `INSERT INTO ${sql_team_table} (team_name, team_size) Values(?,?)`
    console.log(`Query: ${query}`)


    db.query(query, values, (err, data) => {
        if (err) {
            console.error("MySQL error: ", err);
            return res.status(500).json("Error: Team creation failed");
        }
        console.log("Data inserted successfully:", data);
        return res.status(200).json(data);
    });
})
//Testing POST to submit data to SQL
app.post("/create", (req, res) => {
    console.log("Attempting to create account");
    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.user_role,
        req.body.username,
        req.body.user_password,

    ];
    console.log(values);
    let person_type = ""
    const person_name = values[0]
    const person_username = values[3]
    if (req.body.user_role === "student") {
        person_type = process.env.STUDENTS
        console.log(`attempting to add student: ${person_name} with username :${person_username}`)

    }
    else {
        person_type = process.env.INSTRUCTORS
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
const port = 8080;
app.listen(port, () => {
    console.log(`Server port running on '${port}'`);
})
