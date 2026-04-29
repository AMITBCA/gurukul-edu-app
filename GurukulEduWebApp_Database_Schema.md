# Gurukul Edu WebApp - Database Schema

## MongoDB Collections (SQL tables की जगह)

### 1. users collection

fields:
- name: String
- email: String (unique)
- password: String
- role: String (`admin`, `teacher`, `student`)
- profilePicture: String
- batchId: ObjectId (Batch reference)
- enrollmentNumber: String
- parentContact: String
- isVerified: Boolean
- isActive: Boolean
- verificationToken: String
- verificationTokenExpire: Date
- resetPasswordToken: String
- resetPasswordExpire: Date
- sessions: Array of objects `{ token, device, ip, createdAt }`
- timestamps: createdAt, updatedAt

### 2. batches collection

fields:
- name: String
- description: String
- teachers: [ObjectId] (User references)
- students: [ObjectId] (User references)
- status: String (`active`, `inactive`)
- timestamps

### 3. attendances collection

fields:
- studentId: ObjectId (User reference)
- batchId: ObjectId (Batch reference)
- date: Date
- status: String (`Present`, `Absent`, `Late`)
- markedBy: ObjectId (User reference of teacher/admin)
- timestamps

### 4. materials collection

fields:
- title: String
- description: String
- batchId: ObjectId (Batch reference)
- teacherId: ObjectId (User reference)
- fileUrl: String
- fileType: String (`PDF`, `Video`, `Note`, `Image`)
- publicId: String
- timestamps

### 5. tests collection

fields:
- testName: String
- batchId: ObjectId (Batch reference)
- teacherId: ObjectId (User reference)
- totalMarks: Number
- date: Date
- results: Array of objects `{ studentId, marksObtained, feedback }`
- timestamps

### 6. fees collection

fields:
- studentId: ObjectId (User reference)
- batchId: ObjectId (Batch reference)
- totalAmount: Number
- amountPaid: Number
- status: String (`Paid`, `Pending`, `Overdue`)
- dueDate: Date
- paymentHistory: Array of objects
    - amount: Number
    - date: Date
    - paymentMethod: String
    - transactionId: String
    - remarks: String
- assignedBy: ObjectId (User reference)
- timestamps

## Important Notes for Exam

- MongoDB में tables नहीं होते, collections होते हैं। लेकिन exam में tables बोलना आसान है, इसलिए "collections (tables)" कह सकते हैं।
- `users` collection में सभी roles stored होते हैं।
- `batchId`, `studentId`, `teacherId` उठाने के लिए `ObjectId` use किया गया है।
- `Fee` model में status अपने आप update होता है `pre('save')` hook से जो `amountPaid` और `dueDate` के आधार पर चलता है।

## Live database दिखाने के लिए

### फ़ाइलें जो डेटाबेस स्ट्रक्चर बताती हैं
- `backend/models/User.js`
- `backend/models/Batch.js`
- `backend/models/Attendance.js`
- `backend/models/Material.js`
- `backend/models/Test.js`
- `backend/models/Fee.js`

### Database collection names
- `users`
- `batches`
- `attendances`
- `materials`
- `tests`
- `fees`

### एक लाइन में समझाइए
```
MongoDB में यह app 6 main collections use करता है: users, batches, attendances, materials, tests, fees.
```
