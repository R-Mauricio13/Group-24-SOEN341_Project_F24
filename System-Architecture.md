```mermaid

graph TB
    subgraph "Frontend Layer"
        UI[React UI Components]
        Login[Login Component]
        StudentView[Student View]
        InstructorView[Instructor View]
        PeerReview[Peer Review Forms]
    end

    subgraph "Business Logic Layer"
        Auth[Authentication Service]
        UserMgmt[User Management]
        TeamMgmt[Team Management] 
        ReviewMgmt[Review Management]
    end

    subgraph "Data Layer"
        DB[(Database)]
        Cache[(Cache)]
    end

    subgraph "External Services"
        Email[Email Service]
        FileStorage[File Storage]
    end

    %% Frontend to Business Logic
    UI --> |HTTP/REST| Auth
    Login --> |POST /login| Auth
    StudentView --> |GET /students| UserMgmt
    InstructorView --> |GET /teams| TeamMgmt
    PeerReview --> |POST /reviews| ReviewMgmt

    %% Business Logic to Data
    Auth --> |SQL| DB
    Auth --> |Redis| Cache
    UserMgmt --> DB
    TeamMgmt --> DB
    ReviewMgmt --> DB

    %% Business Logic to External Services
    ReviewMgmt --> |SMTP| Email
    TeamMgmt --> |S3/Files| FileStorage

    %% Data Flow Labels
    classDef frontend fill:#42A5F5,stroke:#1976D2,color:white
    classDef business fill:#66BB6A,stroke:#388E3C,color:white
    classDef data fill:#FFA726,stroke:#F57C00,color:white
    classDef external fill:#EC407A,stroke:#C2185B,color:white

    class UI,Login,StudentView,InstructorView,PeerReview frontend
    class Auth,UserMgmt,TeamMgmt,ReviewMgmt business
    class DB,Cache data
    class Email,FileStorage external
