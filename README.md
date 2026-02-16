# EduVillage - Online Learning Management System

<div align="center">

![EduVillage Banner](https://img.shields.io/badge/EduVillage-LMS-blue?style=for-the-badge)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-4169E1?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**A modern, full-stack Learning Management System built for scalable digital education**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [User Roles & Workflows](#-user-roles--workflows)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Security Features](#-security-features)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**EduVillage** is a comprehensive, full-stack Online Learning Management System (LMS) designed to digitize and streamline the educational experience. It provides a robust platform where students can learn, teachers can teach, and administrators can manage the entire ecosystem efficiently.

### Project Objectives

- **Scalability**: Built to handle growing numbers of users and courses
- **Security**: Implements industry-standard authentication and authorization
- **User-Friendly**: Intuitive interfaces tailored for each user role
- **Comprehensive**: Complete feature set for modern digital learning

---

## ✨ Features

### 👨‍🎓 For Students
- 📝 User registration and secure authentication
- 📚 Browse and enroll in available courses
- 📖 Access course materials and lessons
- 📊 Attempt quizzes and assessments
- 📈 Track learning progress and performance
- 🎓 View completion certificates

### 👨‍🏫 For Teachers
- 🎯 Create and manage courses
- 📝 Upload lessons and learning materials
- ❓ Design quizzes and assessments
- 📊 Evaluate student submissions
- 👥 Monitor student progress
- 📢 Publish and update course content

### 👨‍💼 For Administrators
- 👥 Manage user accounts (Students, Teachers, Admins)
- 📚 Monitor and control all courses
- 📊 Generate system-wide reports
- 🔧 Configure system settings
- 📈 View analytics and insights
- 🛡️ Maintain platform security

---

## 🛠 Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React.js (Vite)** | Fast, modern UI framework |
| **React Router DOM** | Client-side routing |
| **Axios** | HTTP client for API requests |
| **CSS3** | Styling and responsive design |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **JWT** | Secure token-based authentication |
| **bcrypt** | Password hashing and encryption |

### Database
| Technology | Purpose |
|-----------|---------|
| **PostgreSQL** | Relational database management |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Git & GitHub** | Version control and collaboration |
| **Postman** | API testing and documentation |
| **VS Code** | Integrated development environment |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Layer                           │
│              (Students, Teachers, Admins)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                            │
│              React.js + Vite + Router                        │
│                   (User Interface)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼ HTTP/HTTPS (Axios)
┌─────────────────────────────────────────────────────────────┐
│                     API Layer                                │
│            Node.js + Express.js + JWT                        │
│              (Business Logic & Auth)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                   Database Layer                             │
│                    PostgreSQL                                │
│              (Data Persistence & Storage)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 User Roles & Workflows

### 🔵 Student Workflow

```
Register/Login → View Dashboard → Browse Courses → Enroll in Course
       ↓
View Lessons → Complete Lessons → Attempt Quizzes → Track Progress
       ↓
View Results → Earn Certificate → Continue Learning
```

**Key Actions:**
1. Register and create student profile
2. Browse available courses
3. Enroll in desired courses
4. Access lessons and study materials
5. Complete quizzes and assessments
6. Monitor progress dashboard
7. Download certificates upon completion

### 🟢 Teacher Workflow

```
Register/Login → View Dashboard → Create Course → Add Course Details
       ↓
Upload Lessons → Create Quizzes → Publish Course → Monitor Enrollments
       ↓
Evaluate Students → Provide Feedback → Update Content → View Analytics
```

**Key Actions:**
1. Register as a teacher
2. Create new courses with descriptions
3. Upload lessons and learning materials
4. Design quizzes and assessments
5. Publish courses to students
6. Evaluate student submissions
7. Track student performance
8. Update and improve course content

### 🟡 Admin Workflow

```
Login → Admin Dashboard → Manage Users → Monitor Courses
       ↓
View Reports → System Analytics → Configure Settings → Maintain Security
       ↓
Handle Issues → Generate Insights → Optimize Platform
```

**Key Actions:**
1. Secure admin login
2. Manage all user accounts
3. Monitor course creation and enrollment
4. Generate comprehensive reports
5. View platform analytics
6. Configure system settings
7. Ensure data security
8. Resolve platform issues

---

## 📁 Project Structure

```
EduVillage/
│
├── Backend/                          # Backend application
│   ├── config/                       # Configuration files
│   │   └── db.js                     # Database configuration
│   ├── controllers/                  # Route controllers
│   │   ├── authController.js         # Authentication logic
│   │   ├── courseController.js       # Course management
│   │   ├── userController.js         # User operations
│   │   ├── enrollmentController.js   # Enrollment logic
│   │   └── quizController.js         # Quiz management
│   ├── middleware/                   # Custom middleware
│   │   ├── authMiddleware.js         # JWT verification
│   │   └── roleMiddleware.js         # Role-based access
│   ├── models/                       # Database models
│   │   ├── User.js                   # User model
│   │   ├── Course.js                 # Course model
│   │   ├── Lesson.js                 # Lesson model
│   │   └── Quiz.js                   # Quiz model
│   ├── routes/                       # API routes
│   │   ├── authRoutes.js             # Auth endpoints
│   │   ├── courseRoutes.js           # Course endpoints
│   │   ├── userRoutes.js             # User endpoints
│   │   └── enrollmentRoutes.js       # Enrollment endpoints
│   ├── utils/                        # Utility functions
│   │   ├── validators.js             # Input validation
│   │   └── helpers.js                # Helper functions
│   ├── server.js                     # Entry point
│   └── package.json                  # Backend dependencies
│
├── EduVillage/                       # Frontend application
│   ├── public/                       # Static assets
│   │   └── assets/                   # Images, icons, etc.
│   ├── src/                          # Source code
│   │   ├── assets/                   # React assets
│   │   ├── components/               # React components
│   │   │   ├── admin/                # Admin components
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   └── Reports.jsx
│   │   │   ├── auth/                 # Authentication components
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── student/              # Student components
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── CourseList.jsx
│   │   │   │   ├── LessonView.jsx
│   │   │   │   └── Progress.jsx
│   │   │   └── teacher/              # Teacher components
│   │   │       ├── Dashboard.jsx
│   │   │       ├── CreateCourse.jsx
│   │   │       ├── ManageLessons.jsx
│   │   │       └── StudentEvaluation.jsx
│   │   ├── context/                  # React Context API
│   │   │   └── AuthContext.jsx       # Authentication state
│   │   ├── helpers/                  # Helper functions
│   │   │   └── api.js                # API configuration
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── services/                 # API services
│   │   │   ├── authService.js
│   │   │   ├── courseService.js
│   │   │   └── userService.js
│   │   ├── App.jsx                   # Main App component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── vite.config.js                # Vite configuration
│   └── package.json                  # Frontend dependencies
│
├── .env                              # Environment variables
├── .gitignore                        # Git ignore file
├── README.md                         # Project documentation
├── package-lock.json                 # Lock file
└── package.json                      # Root dependencies
```

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **PostgreSQL** (v15.x or higher)
- **Git**

### Step 1️⃣: Clone the Repository

```bash
git clone https://github.com/aishwaryabadam/EduVillage.git
cd EduVillage
```

### Step 2️⃣: Database Setup

1. **Install PostgreSQL** (if not already installed)

2. **Create a new database:**
```sql
CREATE DATABASE eduvillage;
```

3. **Create database tables** (run the SQL schema provided in `/Backend/database/schema.sql`)

### Step 3️⃣: Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file (see Environment Configuration below)

# Start the backend server
npm start
```

The backend server will run on `http://localhost:5000`

### Step 4️⃣: Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd EduVillage

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will run on `http://localhost:5173`

---

## 🔐 Environment Configuration

Create a `.env` file in the **Backend** directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eduvillage
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_URL=postgresql://your_username:your_password@localhost:5432/eduvillage

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Security Note:** Never commit the `.env` file to version control. Keep your JWT_SECRET secure and unique.

---

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login user and return JWT | Public |
| `POST` | `/api/auth/logout` | Logout user | Private |
| `GET` | `/api/auth/me` | Get current user profile | Private |

**Example Request:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "student"
}
```

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/users/profile` | Get user profile | Private |
| `PUT` | `/api/users/profile` | Update user profile | Private |
| `GET` | `/api/users` | Get all users (Admin only) | Admin |
| `DELETE` | `/api/users/:id` | Delete user (Admin only) | Admin |

### Course Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/courses` | Create a new course | Teacher |
| `GET` | `/api/courses` | Get all courses | Public |
| `GET` | `/api/courses/:id` | Get course details | Public |
| `PUT` | `/api/courses/:id` | Update course | Teacher |
| `DELETE` | `/api/courses/:id` | Delete course | Teacher/Admin |
| `GET` | `/api/courses/teacher/:teacherId` | Get teacher's courses | Teacher |

**Example Request:**
```json
POST /api/courses
{
  "title": "Introduction to React",
  "description": "Learn React from scratch",
  "category": "Web Development",
  "duration": "8 weeks",
  "level": "Beginner"
}
```

### Enrollment Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/enroll/:courseId` | Enroll in a course | Student |
| `GET` | `/api/enroll/student` | Get student enrollments | Student |
| `GET` | `/api/enroll/course/:courseId` | Get course enrollments | Teacher |
| `DELETE` | `/api/enroll/:enrollmentId` | Unenroll from course | Student |

### Lesson Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/lessons` | Add lesson to course | Teacher |
| `GET` | `/api/lessons/course/:courseId` | Get course lessons | Private |
| `GET` | `/api/lessons/:id` | Get lesson details | Private |
| `PUT` | `/api/lessons/:id` | Update lesson | Teacher |
| `DELETE` | `/api/lessons/:id` | Delete lesson | Teacher |

### Quiz Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/quizzes` | Create quiz | Teacher |
| `GET` | `/api/quizzes/course/:courseId` | Get course quizzes | Private |
| `POST` | `/api/quizzes/:id/attempt` | Submit quiz attempt | Student |
| `GET` | `/api/quizzes/:id/results` | Get quiz results | Student |

### Progress Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/progress` | Get student progress | Student |
| `GET` | `/api/progress/course/:courseId` | Get course progress | Student |
| `POST` | `/api/progress/update` | Update lesson progress | Student |

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    Users    │         │   Courses   │         │   Lessons   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id (PK)     │────┐    │ id (PK)     │────┐    │ id (PK)     │
│ name        │    │    │ title       │    │    │ course_id(FK)│
│ email       │    │    │ description │    │    │ title       │
│ password    │    │    │ teacher_id(FK)   │    │ content     │
│ role        │    │    │ category    │    │    │ order       │
│ created_at  │    │    │ duration    │    │    │ created_at  │
└─────────────┘    │    │ level       │    │    └─────────────┘
                   │    │ created_at  │    │
                   │    └─────────────┘    │
                   │            │          │
                   │            └──────────┘
                   │
                   ├────────────┐
                   │            │
                   ▼            ▼
            ┌─────────────┐  ┌─────────────┐
            │ Enrollments │  │   Quizzes   │
            ├─────────────┤  ├─────────────┤
            │ id (PK)     │  │ id (PK)     │
            │ student_id(FK)  │ course_id(FK)│
            │ course_id(FK)   │ title       │
            │ enrolled_at │  │ questions   │
            │ progress    │  │ passing_score│
            │ status      │  │ created_at  │
            └─────────────┘  └─────────────┘
                   │
                   ▼
            ┌─────────────┐
            │  Progress   │
            ├─────────────┤
            │ id (PK)     │
            │ student_id(FK)
            │ lesson_id(FK)│
            │ completed   │
            │ score       │
            │ completed_at│
            └─────────────┘
```

### Core Tables

**Users Table:**
- Stores all user information (Students, Teachers, Admins)
- Password is hashed using bcrypt
- Role determines access permissions

**Courses Table:**
- Contains course details and metadata
- Links to teacher (creator) via teacher_id

**Lessons Table:**
- Stores individual lesson content
- Ordered sequentially within each course

**Enrollments Table:**
- Tracks student-course relationships
- Monitors enrollment status and progress

**Quizzes Table:**
- Contains quiz questions and answers
- Links to parent course

**Progress Table:**
- Tracks individual lesson completion
- Stores quiz scores and timestamps

---

## 🔒 Security Features

### Authentication & Authorization
- ✅ **JWT-based authentication** - Secure, stateless session management
- ✅ **bcrypt password hashing** - Industry-standard encryption (10 salt rounds)
- ✅ **Role-based access control (RBAC)** - Granular permission system
- ✅ **Protected routes** - Frontend and backend route protection
- ✅ **Token expiration** - Automatic logout after 7 days (configurable)

### Data Protection
- ✅ **SQL injection prevention** - Parameterized queries
- ✅ **XSS protection** - Input sanitization
- ✅ **CORS configuration** - Controlled cross-origin requests
- ✅ **Environment variables** - Sensitive data protection
- ✅ **HTTPS ready** - SSL/TLS encryption support

### Best Practices
- ✅ Password complexity requirements
- ✅ Rate limiting on authentication endpoints
- ✅ Secure HTTP headers
- ✅ Input validation and sanitization
- ✅ Error handling without information leakage

---

## 📸 Screenshots

### Login Page
_Secure authentication interface for all user roles_

### Student Dashboard
_Overview of enrolled courses and progress tracking_

### Course Catalog
_Browse and enroll in available courses_

### Lesson Viewer
_Interactive lesson content with multimedia support_

### Teacher Panel
_Course creation and student management interface_

### Admin Dashboard
_System-wide analytics and user management_

### Progress Tracking
_Detailed student performance metrics_

---

## 🤝 Contributing

We welcome contributions to EduVillage! Here's how you can help:

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/aishwaryabadam/EduVillage.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues

### Development Guidelines

- Follow the existing code structure
- Write meaningful commit messages
- Update documentation as needed
- Test your changes thoroughly
- Ensure no security vulnerabilities

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aishwarya Badam**

- GitHub: [@aishwaryabadam](https://github.com/aishwaryabadam)
---

## 🙏 Acknowledgments

- React.js team for the amazing frontend framework
- Node.js and Express.js communities
- PostgreSQL for robust database management
- All contributors and supporters of this project

---


⭐ Star this repository if you find it helpful!

</div>
## 📸 Project Screenshots
<img width="1246" height="647" alt="Screenshot 2026-02-12 232005" src="https://github.com/user-attachments/assets/d44977e5-b406-4e5e-93c1-b39e8b8bde58" />
<img width="1260" height="641" alt="Screenshot 2026-02-12 232018" src="https://github.com/user-attachments/assets/098bf470-8289-43f1-bf1b-c0cf69c4fc47" />
<img width="1250" height="627" alt="Screenshot 2026-02-12 232031" src="https://github.com/user-attachments/assets/aafad540-7488-4ddc-b1c1-37a6561f820a" />
<img width="512" height="637" alt="Screenshot 2026-02-12 232128" src="https://github.com/user-attachments/assets/d26931e8-5b29-4784-9633-687a086c0172" />
<img width="495" height="624" alt="Screenshot 2026-02-12 232157" src="https://github.com/user-attachments/assets/2893d6bf-1fda-427f-86f4-67ddbd0a0774" />



