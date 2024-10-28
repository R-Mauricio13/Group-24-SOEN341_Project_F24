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
    // const students = 'user_student';
    const query =`SELECT ${students}.username, ${students}.id, ${students}.first_name, ${students}.last_name, ${students}.user_role, ${students}.user_password, student_team_members.team_name FROM ${students} LEFT JOIN student_team_members ON user_student.username = student_team_members.username`;
    db.query(query,(err,data)=>{
        if(err)
        {
            console.log(err);
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

app.get('/existingTeams', (req, res) => {

    const updateQuery = `
    UPDATE student_teams
    SET current_members = (
        SELECT COUNT(*)
        FROM student_team_members
        WHERE student_team_members.team_name = student_teams.team_name
    );`;

    db.query(updateQuery, (err) => {
        if (err) {
            console.error("Error updating team members count:", err);
            return res.status(500).json({ message: 'Error updating team members count' });
        }

        // Fetch teams only after the update is successful
        const selectQuery = 'SELECT team_name, team_size, current_members FROM student_teams';
        
        db.query(selectQuery, (err, data) => {
            if (err) {
                console.error("Error fetching teams:", err);
                return res.status(500).json({ message: 'Error fetching teams' });
            }
            
            return res.status(200).json(data); // Only one response
        });
    });
});

// app.get('/existingTeams', (req, res) => {
//     const query = 'SELECT team_name FROM student_teams'; // Adjust table name as needed
//     db.query(query, (err, data) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error fetching teams' });
//         }
//         return res.status(200).json(data); 
//     });
// }); 


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

// POST to create a new team
app.post("/createTeam", (req, res) => {
    const { team_name, team_size } = req.body;

    // Validate input values
    if (!team_name || !team_size) {
        return res.status(400).json("Both team name and size are required and cannot be null.");
    }

    // First, check if the team name already exists
    const checkQuery = `SELECT * FROM student_teams WHERE team_name = ?`;
    
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
            const insertQuery = `INSERT INTO student_teams (team_name, team_size) VALUES (?, ?)`;
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

// POST to add member to a team or to change a member's team
app.post("/addMemberToTeam", (req, res) => {
    const { team_name,  username,} = req.body;

    // Validate input
    if (!team_name || !username) {
        return res.status(400).json("team_name and username are required.");
    }

    //check if the team exists and retrieve its size
    const checkTeamQuery = `SELECT team_size FROM student_teams WHERE team_name = ?`;

    db.query(checkTeamQuery, [team_name], (err, teamData) => {
        if (err || teamData.length === 0) {
            return res.status(500).json("Error finding team.");
        }

        const maxTeamSize = teamData[0].team_size;
        
        // Count how many members are already in this team
        const countMembersQuery = `SELECT COUNT(*) as memberCount FROM student_team_members WHERE team_name = ?`;
        
        db.query(countMembersQuery, [team_name], (err, countResult) => {
            if (err) {
                return res.status(500).json("Error counting team members.");
            }

            const currentMembers = countResult[0].memberCount;

            if (currentMembers >= maxTeamSize) {
                // If the team is already full, return an message error
                return res.status(400).json({message:"This team is full. Cannot add more members."});
            } else {
                // If the team is not full, check if the member already exists
                const checkMemberQuery = `SELECT username FROM student_team_members WHERE username = ?`;


                db.query(checkMemberQuery, [username], (err, memberData) => {
                    if (err) {
                        return res.status(500).json("Error checking member's current team.");
                    }
            
                    if (memberData.length > 0) {
                        // Username already exists - update the team for this username
                        const updateMemberTeamQuery = `UPDATE student_team_members SET team_name = ? WHERE username = ?`;
                        
                        db.query(updateMemberTeamQuery, [team_name, username], (err, updateResult) => {
                            if (err) {
                                return res.status(500).json("Error updating member's team.");
                            }
                            
                            return res.status(200).json("Student's team updated successfully.");
                        });
                    } else{ 
                          //Insert if no team assigned
                        const insertMemberQuery = `INSERT INTO student_team_members (team_name, username) VALUES (?, ?)`;
                
                        db.query(insertMemberQuery, [team_name, username], (err, insertResult) => {
                            if (err) {
                                if (err.code === 'ER_DUP_ENTRY') {
                                    return res.status(400).json("Error: Member name already exists.")
                                }
                                return res.status(500).json("Error adding member to the team.");
                            }
        
                            
                            return res.status(200).json("Student added to the team successfully.");
                        });}

            });
            }
        });
    });
});

//Establishing port connection
const port= 8080;
app.listen(port,() =>
{
    console.log(`Server port running on '${port}'`);
})
