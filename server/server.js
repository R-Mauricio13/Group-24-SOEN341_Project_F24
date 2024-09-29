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

app.get("/login",(req, res)=>{
    const students = process.env.STUDENTS;
    const instructors = process.env.INSTRUCTORS;
    let personnel = "";

    if (req.query.user_role==="student")
        personnel = students;
    else
        personnel = instructors;

    const query = `SELECT user_password FROM ${personnel} WHERE username = ?`;

    db.query(query, [req.query.username], (err, data) => {
        if (err)
            return res.json(false);

        res.send(data[0]?.user_password == req.query.user_password);
    })
})

app.get('/existingTeams', (req, res) => {
    const query = 'SELECT team_name FROM student_groups'; // Adjust table name as needed
    db.query(query, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching teams' });
        }
        return res.status(200).json(data); // Respond with existing team names
    });
});

//Testing POST to submit data to SQL
app.post("/create",(req,res)=>{
    
    const values=[
        req.body.first_name,
        req.body.last_name,
        req.body.user_role,
        req.body.username,
        req.body.user_password,
      
    ];
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

// POST to create a new team
app.post("/createTeam", (req, res) => {
    const { team_name, team_size } = req.body;

    // Validate input values
    if (!team_name || !team_size) {
        return res.status(400).json("Both team name and size are required and cannot be null.");
    }

    // First, check if the team name already exists
    const checkQuery = `SELECT * FROM student_groups WHERE team_name = ?`;
    
    db.query(checkQuery, [team_name], (err, data) => {
        if (err) {
            console.error("MySQL error: ", err);
            return res.status(500).json("Error checking existing teams");
        }

        if (data.length > 0) {
            // If a team with that name already exists, send an error response
            return res.status(400).json("Team name already exists. Please choose a different name.");
        } else {
            // If the team name doesn't exist, proceed to insert
            const insertQuery = `INSERT INTO student_groups (team_name, team_size) VALUES (?, ?)`;
            db.query(insertQuery, [team_name, team_size], (err, data) => {
                if (err) {
                    console.error("MySQL error: ", err);
                    return res.status(500).json("Error: Team creation failed");
                }
                console.log("Data inserted successfully:", data);
                return res.status(201).json("Team created successfully!");
            });
        }
    });
});


//Establishing port connection
const port= 8080;
app.listen(port,() =>
{
    console.log(`Server port running on '${port}'`);
})