# Gurukul Excellence (Integrated Smart Coaching Management & E-Learning System)

## Goal Description
Build a comprehensive digital ecosystem for JEE & NEET coaching that automates manual management tasks (attendance and fees) and provides students with continuous 24/7 access to study materials, lectures, and performance analytics.

**Tech Stack**: 
- **Frontend**: React.js (Vite), Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary (for study materials, profile pictures, etc.)

## User Roles
1. **Admin/Management**: Manages students, teachers, fees, attendance, and overall system.
2. **Teacher**: Uploads study materials, takes attendance, grades tests, and monitors performance.
3. **Student**: Accesses study materials, takes tests, views attendance and fee status, and tracks performance.

## Architecture design

### Frontend (`/frontend`)
- **Vite React App**: Fast build tool and modern React environment.
- **Tailwind CSS**: For responsive, custom, and beautiful UI.
- **React Router**: For client-side routing.
- **State Management**: Context API / Zustand (for lightweight state) or Redux Toolkit.
- **Axios**: For making HTTP requests to the backend.

### Backend (`/backend`)
- **Express.js**: REST API framework.
- **Mongoose**: MongoDB object modeling.
- **JWT**: For secure authentication and authorization.
- **Multer & Cloudinary**: For handling file uploads (PDFs, images, videos).

## Database Schema Design (MongoDB)

### 1. User (Admin, Teacher, Student)
- `_id`, `name`, `email`, `password` (hashed), `role` (enum: 'admin', 'teacher', 'student')
- `profilePicture` (Cloudinary URL)
- *If Student*: `batch`, `enrollmentNumber`, `parentContact`

### 2. Batch/Class
- `_id`, `name` (e.g., 'JEE 2026', 'NEET 2025'), `teachers` (Array of Refs)

### 3. Attendance
- `studentId`: ObjectId (Ref User)
- `batchId`: ObjectId (Ref Batch)
- `date`: Date
- `status`: String (Present/Absent/Late)
- `markedBy`: ObjectId (Ref User - Teacher)

### 4. Study Material
- `title`: String
- `description`: String
- `batchId`: ObjectId (Ref Batch)
- `teacherId`: ObjectId (Ref User)
- `fileUrl`: String (Cloudinary URL)
- `fileType`: String (PDF/Video/Note)
- `publicId`: String (Cloudinary ID)

### 5. Test & Performance
- `testName`: String
- `batchId`: ObjectId (Ref Batch)
- `teacherId`: ObjectId (Ref User)
- `totalMarks`: Number
- `date`: Date
- `results`: Array of `{ studentId: Ref User, marksObtained: Number, feedback: String }`

## Core Features & Implementation Plan

### Phase 1: Foundation & Authentication
- Setup Vite React frontend & Express backend.
- Connect to MongoDB Atlas.
- Implement User Auth (Registration/Login with JWT).
- Role-based routing on the frontend (Admin vs Student vs Teacher dashboards).

### Phase 2: Management Modules (Admin focus)
- **Batch Management**: CRUD for batches/classes.
- **Student/Teacher Management**: Enrolling students, assigning teachers to batches.
- **Fee Management**: Tracking payments, generating receipts, dashboard for pending fees.

### Phase 3: Teacher & Operations
- **Attendance Tracking**: UI for teachers to quickly mark attendance.
- **Study Materials**: Integration with Cloudinary to upload PDFs/Videos. Feed for students to view materials.
- **Test Management**: Creating tests and uploading results/scores.

### Phase 4: Student Portal & Analytics
- **Student Dashboard**: Overview of fees, attendance percentage, and recent materials.
- **Resource Center**: Searching and filtering study materials.
- **Performance Analytics**: Visualizing test scores over time using simple charts (e.g., Recharts).

### Phase 7: Automated Notifications & Communication
- **Automated Notifications System**: Background chron-jobs or triggered events to send Email/WhatsApp alerts for overdue fees, absent attendance, and published test results.
- **Admin Analytics Dashboard**: Graphical charts to visualize revenue growth, batch-wise attendance, and student performance metrics over time (using libraries like Recharts).
- **System-Wide Announcements**: A feature for Admins/Teachers to post global announcements visible on student dashboards.

## Proposed Changes
*This section will be populated with specific file paths once development starts and we map the folder structure.*

### Frontend Setup
#### [NEW] `frontend/package.json`
#### [NEW] `frontend/src/App.jsx`
#### [NEW] `frontend/src/pages/...`
#### [NEW] `frontend/src/components/...`

### Backend Setup
#### [NEW] `backend/models/Attendance.js`
#### [NEW] `backend/models/Material.js`
#### [NEW] `backend/models/Test.js`
#### [NEW] `backend/controllers/attendanceController.js`
#### [NEW] `backend/controllers/materialController.js`
#### [NEW] `backend/controllers/testController.js`
#### [NEW] `backend/routes/attendanceRoutes.js`
#### [NEW] `backend/routes/materialRoutes.js`
#### [NEW] `backend/routes/testRoutes.js`

### Phase 7: Automated Notifications Setup
#### [NEW] `backend/services/NotificationService.js` (Handles Email/SMS logic)
#### [NEW] `backend/jobs/cronJobs.js` (Scheduled jobs for fee reminders)
#### [MODIFY] `backend/controllers/attendanceController.js` (Trigger Absent alert)
#### [MODIFY] `backend/controllers/testController.js` (Trigger Test result alert)
#### [MODIFY] `backend/server.js` (Initialize cron jobs)

### Phase 7: Advanced Analytics
#### [NEW] `backend/controllers/analyticsController.js` (Aggregation APIs)
#### [NEW] `backend/routes/analyticsRoutes.js`
#### [NEW] `frontend/src/pages/admin/AnalyticsDashboard.jsx` (Recharts implementation)
#### [MODIFY] `backend/routes/index.js` (Register analytics routes)
#### [MODIFY] `frontend/src/pages/admin/AdminDashboard.jsx` (Add Analytics sidebar item)

## Verification Plan
1. **Automated Status Verification**: Check backend API endpoints via automated scripts (Postman or basic testing).
2. **Manual UI Testing**: Verify that the Vite app loads, responsive design applies correctly from Tailwind, and user flows (Login -> Dashboard -> Material Upload) work seamlessly.
3. **Database Checks**: Verify data records reflect accurately in MongoDB Atlas after frontend interactions.
