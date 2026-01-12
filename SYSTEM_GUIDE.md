# Notes & Lectures Management System
## B.Tech.Ed. IT Program - Kathmandu University

### System Overview
A comprehensive role-based academic platform for managing notes and lecture videos across 8 semesters (4-year program).

---

## 🔐 Demo Login Credentials

### Super Admin
- **Email:** admin@ku.edu.np
- **Password:** admin123
- **Capabilities:** Full system control

### Teacher
- **Email:** ram.sharma@ku.edu.np
- **Password:** teacher123
- **Capabilities:** Manage assigned subjects, upload materials, enroll students

### Student
- **Email:** rajesh.thapa@student.ku.edu.np
- **Password:** student123
- **Capabilities:** Access enrolled subjects, view/download materials

---

## 👨‍💼 Super Admin Features

### Teacher Management
- Create teacher accounts with email and password
- Deactivate teacher accounts
- View all teachers in the system

### Student Management
- Create student accounts with email and password
- Deactivate student accounts
- View all students in the system

### Subject Management
- Create subjects for each semester (1-8)
- Assign teachers to subjects
- Manage subject codes and names
- View all subjects across all semesters

---

## 👨‍🏫 Teacher Features

### My Subjects
- View all assigned subjects
- See semester and subject details
- Track number of notes, videos, and enrolled students

### Notes Management
- Upload notes (PDF/DOC/PPT format)
- Organize notes by subject
- Delete uploaded notes
- Notes stored in Google Drive in production

### Lecture Videos
- Upload lecture videos
- Link videos from Google Drive
- Organize videos by subject
- Delete uploaded videos

### Student Enrollment
- Enroll students using their email address
- Assign students to specific subjects
- Remove students from subjects
- View all enrolled students with details

---

## 👨‍🎓 Student Features

### My Subjects
- View all enrolled subjects
- Filter subjects by semester
- See teacher information
- Track available notes and videos per subject

### Notes Access
- Browse all notes for enrolled subjects
- View note details (title, subject, teacher, upload date)
- Download notes directly from the system
- Organized by subject and semester

### Lecture Videos
- Browse all lecture videos for enrolled subjects
- Watch videos online
- Download videos for offline viewing
- See video details and upload date

---

## 🎯 Key System Features

### Role-Based Access Control
- Three distinct user roles with specific permissions
- Secure login system
- Role-based dashboard routing

### Semester Organization
- 8 semesters (1st to 8th)
- 4-year program structure
- Semester-wise subject organization

### Subject Management
- Subject codes and names
- Teacher assignment
- Student enrollment tracking

### File Management
- Notes upload and storage
- Video upload and linking
- Google Drive integration (production)
- Direct download capability

### User Management
- Account creation by Super Admin
- Account activation/deactivation
- Email-based enrollment

---

## 📊 Database Structure

### Users Table
- id, name, email, password, role, status

### Semesters Table
- id, semester_name, semester_number (1-8)

### Subjects Table
- id, subject_name, subject_code, semester_id, teacher_id

### Enrollments Table
- id, student_id, subject_id, semester_id, status

### Notes Table
- id, title, file_name, file_path, file_type, subject_id, teacher_id, uploaded_at

### Lecture_Videos Table
- id, title, video_type, video_path, subject_id, teacher_id, uploaded_at

---

## 🔄 Typical Workflows

### 1. Setting Up a New Semester
1. Super Admin creates subjects for the semester
2. Super Admin assigns teachers to subjects
3. Super Admin creates student accounts
4. Teachers enroll students in their subjects

### 2. Teacher Uploading Content
1. Teacher logs in
2. Navigates to Notes or Videos tab
3. Selects subject and uploads content
4. Students automatically get access

### 3. Student Accessing Materials
1. Student logs in
2. Views enrolled subjects
3. Browses available notes and videos
4. Downloads materials for study

---

## 🚀 Production Considerations

### File Storage
- Integrate with Google Drive API
- Implement actual file upload functionality
- Set up proper file access permissions

### Security
- Implement JWT authentication
- Add password hashing (bcrypt)
- Set up HTTPS
- Add rate limiting
- Implement CSRF protection

### Database
- Use PostgreSQL or MySQL
- Implement proper indexes
- Set up backup systems
- Add data validation

### Features to Add
- Email notifications
- File preview functionality
- Search and filter capabilities
- Analytics dashboard
- Mobile app version
- Bulk operations
- Export/import functionality

---

## 📝 Notes

This is a frontend prototype built with React and TypeScript. For production deployment:

1. **Backend Required:** Implement with Node.js/Express or similar
2. **Database Required:** PostgreSQL, MySQL, or similar
3. **File Storage:** Google Drive API or AWS S3
4. **Authentication:** JWT with secure password hashing
5. **Email Service:** For notifications and password resets

**Important:** This system handles academic data. In production, ensure compliance with data protection regulations and implement proper security measures.

---

Built for Kathmandu University - B.Tech.Ed. IT Program
