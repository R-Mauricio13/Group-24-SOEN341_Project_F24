
```mermaid

classDiagram
    %% Authentication Package
    class Login {
        -username: string
        -user_password: string
        -user_role: string
        -loggedin: boolean
        +handleChange()
        +validateCredentials()
        +checkLogin()
    }

    class AuthService {
        +login()
        +logout()
        +checkLoginStatus()
        +validateSession()
    }

    %% User Management Package
    class User {
        <<abstract>>
        #id: string
        #name: string
        #email: string
        +getProfile()
    }

    class Student {
        -teamId: string
        -reviews: Review[]
        +submitReview()
        +viewTeam()
    }

    class Instructor {
        -courses: Course[]
        +createAssignment()
        +manageTeams()
    }

    %% Review System Package
    class PeerReview {
        -reviewId: string
        -reviewerId: string
        -revieweeId: string
        -conceptual_rating: number
        -practical_rating: number
        -concept_comment: string
        -practical_comment: string
        +submitReview()
        +validateForm()
    }

    class Review {
        -id: string
        -rating: number
        -comments: string
        -timestamp: Date
        +create()
        +update()
    }

    %% Team Management Package
    class Team {
        -teamId: string
        -name: string
        -members: Student[]
        +addMember()
        +removeMember()
        +getMembers()
    }

    class Course {
        -courseId: string
        -name: string
        -teams: Team[]
        -assignments: Assignment[]
        +createTeam()
        +assignReviewers()
    }

    class Assignment {
        -id: string
        -title: string
        -description: string
        -dueDate: Date
        -reviews: Review[]
        +create()
        +distribute()
    }

    %% View Components Package
    class StudentView {
        -user: Student
        -activeView: string
        +renderDashboard()
        +handleNavigation()
    }

    class InstructorView {
        -user: Instructor
        -activeView: string
        +renderDashboard()
        +handleNavigation()
    }

    class ViewStudents {
        -students: Student[]
        +fetchStudents()
        +displayList()
    }

    class ViewStudentTeam {
        -team: Team
        -members: Student[]
        +fetchTeamDetails()
        +updateTeam()
    }

    %% Relationships
    
    User <|-- Student
    User <|-- Instructor
    Login --> AuthService
    AuthService --> User
    Student "1" -- "*" PeerReview : submits
    Student "*" -- "1" Team : belongs to
    Instructor "1" -- "*" Course : manages
    Course "1" -- "*" Team : contains
    Course "1" -- "*" Assignment : has
    Assignment "1" -- "*" Review : contains
    PeerReview --> Review : creates
    StudentView --> ViewStudents
    StudentView --> ViewStudentTeam
    InstructorView --> ViewStudents
    Team --> Student : contains
    ViewStudentTeam --> Team
    ViewStudents --> Student
