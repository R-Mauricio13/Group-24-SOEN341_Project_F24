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

app.get("/members", (req, res) => {
    const members = process.env.MEMBERS
    const query = `SELECT * FROM ${members}`;
    db.query(query, (err, data) => {
        if (err) {
            return res.json("Error no data found");
        }
        return res.status(200).json(data)
    });

})


app.get("/student-members", (req, res)=> {
    const students=process.env.STUDENTS
    const student_group_members = process.env.MEMBERS;
    // const students = 'user_student';
    const query =`SELECT us.username, us.user_id, us.first_name, us.last_name, us.user_role, us.user_password, sg.team_name FROM ${students} us LEFT JOIN ${student_group_members} sg ON us.username = sg.username`;
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

// POST to add member to a team or to change a member's team
app.post("/addMemberToTeam", (req, res) => {
    const { team_name,  username,} = req.body;

    let student_groups = process.env.TEAMS;

    // Validate input
    if (!team_name || !username) {
        return res.status(400).json("team_name and username are required.");
    }

    //check if the team exists and retrieve its size
    const checkTeamQuery = `SELECT team_size FROM ${student_groups} WHERE team_name = ?`;

    db.query(checkTeamQuery, [team_name], (err, teamData) => {
        if (err || teamData.length === 0) {
            return res.status(500).json("Error finding team.");
        }

        const maxTeamSize = teamData[0].team_size;
        let student_group_members = process.env.MEMBERS;
        
        // Count how many members are already in this team
        const countMembersQuery = `SELECT COUNT(*) AS memberCount FROM ${student_group_members} WHERE team_name = ?`;
        
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
                const checkMemberQuery = `SELECT username FROM ${student_group_members} WHERE username = ?`;


                db.query(checkMemberQuery, [username], (err, memberData) => {
                    if (err) {
                        return res.status(500).json("Error checking member's current team.");
                    }
            
                    if (memberData.length > 0) {
                        // Username already exists - update the team for this username
                        const updateMemberTeamQuery = `UPDATE ${student_group_members} SET team_name = ? WHERE username = ?`;
                        
                        db.query(updateMemberTeamQuery, [team_name, username], (err, updateResult) => {
                            if (err) {
                                return res.status(500).json("Error updating member's team.");
                            }
                            
                            return res.status(200).json("Student's team updated successfully.");
                        });
                    } else{ 
                          //Insert if no team assigned
                        const insertMemberQuery = `INSERT INTO ${student_group_members} (team_name, username) VALUES (?, ?)`;
                
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
const port = 8080;
app.listen(port, () => {
    console.log(`Server port running on '${port}'`);
})
