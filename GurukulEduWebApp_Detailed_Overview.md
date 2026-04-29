# Gurukul Edu WebApp - Detailed Overview

## 1. प्रोजेक्ट का उद्देश्य
यह ऐप एक स्कूल / कोचिंग मैनेजमेंट सिस्टम है जिसमें छात्र, शिक्षक और एडमिन के लिए अलग-अलग डैशबोर्ड होते हैं।

मुख्य काम:
- यूज़र रजिस्ट्रेशन और लॉगिन
- बैच मैनेजमेंट
- अटेंडेंस मार्किंग
- स्टडी मटेरियल अपलोड और दिखाना
- टेस्ट मैनेजमेंट
- फीस असाइन और स्टेटस
- रोल-बेस्ड एक्सेस कंट्रोल

## 2. टेक्नोलॉजी स्टैक

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Google OAuth
- Socket.IO Client
- Recharts
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- Multer + Cloudinary
- Nodemailer
- Socket.IO
- node-cron
- PDFKit

### Database
- MongoDB
- Mongoose Schemas
- Collections (SQL में tables की तरह)

## 3. ऐप का आर्किटेक्चर

### Backend
- `backend/server.js` : ऐप का entry point
- `backend/config/db.js` : MongoDB से कनेक्शन
- `backend/routes/` : API endpoints
- `backend/controllers/` : लॉजिक
- `backend/models/` : MongoDB स्कीमा
- `backend/middleware/` : authentication और authorization
- `backend/jobs/cronJobs.js` : scheduled notification jobs
- `backend/uploads/` : स्टेटिक फ़ाइलें

### Frontend
- `frontend/src/main.jsx` : React app स्टार्ट
- `frontend/src/App.jsx` : Router setup
- `frontend/src/context/AuthContext.jsx` : ऑथ मैनेजमेंट
- `frontend/src/pages/` : अलग-अलग यूज़र पेज
- `frontend/src/components/` : UI कम्पोनेंट्स

## 4. Backend flow

### 4.1 Server initialization
- `server.js` में Express app बनाया गया है
- `cors()` और `express.json()` enabled है
- `/uploads` को static serve किया जाता है
- `/api` से सभी routes जोड़ दिए गए हैं
- MongoDB connect होने पर server start होता है

### 4.2 API route structure
- `/api/auth` : Authentication
- `/api/admin` : Admin actions
- `/api/batches` : बैच मैनेजमेंट
- `/api/attendance` : अटेंडेंस
- `/api/materials` : स्टडी मटेरियल
- `/api/tests` : टेस्ट
- `/api/teacher` : teacher-specific APIs
- `/api/student` : student-specific APIs
- `/api/fees` : फी मैनेजमेंट
- `/api/analytics` : एनालिटिक्स

## 5. Authentication Module

### routes
- `POST /api/auth/register`
- `GET /api/auth/verify-email/:token`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `PUT /api/auth/reset-password/:token`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

### Frontend flow
- `frontend/src/context/AuthContext.jsx` में:
  - login
  - register
  - verifyEmailToken
  - forgotPassword
  - resetPassword
  - googleLogin
  - logout
- सभी API कॉल `axios` से `/api/auth/*` पर होती हैं
- token `localStorage` में store होता है
- हर protected request में `Authorization: Bearer <token>` भेजा जाता है

### User roles
- `admin`
- `teacher`
- `student`

## 6. मुख्य मॉड्यूल्स

### 6.1 Batch Management
- Batch create/update/delete: admin
- सभी authenticated यूज़र बैच देख सकते हैं
- `/api/batches/:id/enroll` से स्टूडेंट enrollment
- `/api/batches/:id/students` से उस बैच के स्टूडेंट्स

### 6.2 Attendance
- टीचर या एडमिन attendance मार्क कर सकता है
- `/api/attendance/batch/:batchId` से एक बैच की attendance
- `/api/attendance/me` से current student की attendance
- `/api/attendance/stats` से attendance stats

### 6.3 Study Materials
- टीचर/एडमिन फ़ाइल upload करते हैं
- `/api/materials/batch/:batchId` से बैच का material fetch होता है
- फ़ाइल Cloudinary में upload हो सकती है

### 6.4 Tests
- टीचर/एडमिन नए टेस्ट बनाते हैं
- टेस्ट में student results stored होते हैं
- Students अपने results `/api/tests/me` से देख सकते हैं
- `/api/tests/batch/:batchId` से बैच के टेस्ट

### 6.5 Fees
- फीज़ assign केवल admin कर सकता है
- `/api/fees/` से सारी फीज़ें
- `/api/fees/myfees` से current student की फीज़ स्टेटस
- `fee.paymentHistory` में payment records रहते हैं

### 6.6 Admin Dashboard
- `GET /api/admin/users`
- `GET /api/admin/teachers`
- `POST /api/admin/teachers`
- `GET /api/admin/stats`

### 6.7 Teacher Dashboard
- टीचर अपने batches देख सकता है
- अपनी स्टैट्स / performance देख सकता है

### 6.8 Student Dashboard
- student को उनकी attendance, fees, study materials, tests दिखाई देती हैं

## 7. Frontend architecture

### Routing
- `frontend/src/App.jsx` में routes define हैं
- ProtectedRoute component से login चेक होता है
- `/dashboard` पर role-specific dashboards दिखते हैं
- Public pages: `/`, `/login`, `/register`, `/forgot-password`, `/reset-password/:token`, `/verify-email/:token`

### AuthContext
- सभी auth functions एक centralized context में हैं
- लॉगिन होने पर user state set होती है
- token validation और auto-login `/api/auth/me` से होती है

### Important frontend file
- `frontend/src/main.jsx`: axios base URL `http://localhost:5000`
- ये URL backend API से connect करता है

## 8. Database (MongoDB) काम कैसे करता है

### DB connection
- `backend/config/db.js` में MongoDB URI पढ़ा जाता है
- `mongoose.connect(process.env.MONGODB_URI)` से DB connect होता है
- अगर connection fail हुआ तो server start नहीं होगा

### MongoDB collection = SQL table
MongoDB में collection एक तरह की table होती है।

इस ऐप में मुख्य collections:
- users
- batches
- attendances
- materials
- tests
- fees

## 9. Database को exam में live कैसे दिखाएँ

> अगर exam में पूछा जाए कि डेटाबेस कहाँ से पता चलेगा, तो आप `backend/models/` दिखाइए।

### दिखाने का तरीका
- `backend/models/User.js` → users collection structure
- `backend/models/Batch.js` → batches collection structure
- `backend/models/Attendance.js` → attendances structure
- `backend/models/Material.js` → materials structure
- `backend/models/Test.js` → tests structure
- `backend/models/Fee.js` → fees structure

### अगर MongoDB live दिखाना हो
1. `backend/config/db.js` में MongoDB URI बताएं
2. `frontend/src/main.jsx` में Axios base URL `http://localhost:5000`
3. `backend/server.js` से server चलाएँ
4. Browser में `/api` या `/api/auth/me` call करके दिखाएँ

## 10. Run commands

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### पूरे प्रोजेक्ट को चलाने के लिए
- backend `http://localhost:5000`
- frontend `http://localhost:5173`

## 11. Quick summary
- यह MERN-टाइप application है
- Frontend React + Vite + Tailwind है
- Backend Node + Express + MongoDB है
- Authentication JWT से होती है
- Roles: admin, teacher, student
- Main modules: auth, batch, attendance, materials, tests, fees
- Database Collections: users, batches, attendances, materials, tests, fees
