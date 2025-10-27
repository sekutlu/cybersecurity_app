# CyberSecure - Cybersecurity Awareness Quiz App

A comprehensive cybersecurity awareness platform built for the DIIC3110 ICT4D course at Limkokwing University.

## 🚀 Features

### 🔐 Authentication System
- User registration and login
- Role-based access (User/Admin)
- Profile management with editable bio and stats
- Default admin account: `cyberadmin@cybersecure.com` / `CyberAdmin123!`

### 📚 Learning Platform
- Interactive lessons with YouTube video integration
- MongoDB-powered content management
- Progress tracking and completion badges
- Responsive design with Hack The Box inspired theme

### 🧪 Quiz System
- Database-driven quizzes with multiple choice questions
- Real-time scoring and progress tracking
- Detailed explanations for each answer
- Performance analytics

### 👨‍💼 Admin Dashboard
- Content management for lessons and quizzes
- User management capabilities
- YouTube video integration for lessons
- Import/export functionality for content

## 🎨 Design Theme

The application uses a professional cybersecurity theme inspired by Hack The Box:
- **Primary Colors**: Slate backgrounds (`slate-900`, `slate-800`)
- **Accent Color**: Bright green (`green-400`) for interactive elements
- **Typography**: Clean, modern fonts with high contrast
- **Components**: Dark cards with subtle borders and hover effects

## 🛠️ Technology Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: Custom JWT-based system with bcryptjs
- **UI Components**: Radix UI with custom styling
- **Animations**: Framer Motion
- **Video Integration**: YouTube Embed API

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (MongoDB connection string is pre-configured)
4. Seed the database with sample content:
   ```bash
   curl -X POST http://localhost:3000/api/admin/seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🗄️ Database Structure

### Collections:
- **Users**: Authentication, profiles, progress tracking
- **Lessons**: Content with YouTube integration
- **Quizzes**: Questions, answers, and explanations

### Sample Data:
- 3 cybersecurity lessons with YouTube videos
- 1 comprehensive quiz with explanations
- Admin user for content management

## 🎯 Educational Objectives

This platform addresses key ICT4D principles:
- **Community Awareness**: Accessible cybersecurity education
- **Digital Literacy**: Building essential security skills
- **Participatory Design**: User-friendly interface for diverse audiences
- **Sustainable Learning**: Progress tracking and gamification

## 👥 User Roles

### Regular Users
- Access lessons and quizzes
- Track learning progress
- Manage personal profile
- Earn badges and achievements

### Administrators
- Create and manage lessons
- Design and deploy quizzes
- Monitor user progress
- Import/export educational content

## 🔧 API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/lessons` - Fetch all lessons
- `GET /api/lessons/[id]` - Get specific lesson
- `POST /api/lessons` - Create new lesson (Admin)
- `GET /api/quizzes` - Fetch all quizzes
- `POST /api/quizzes` - Create new quiz (Admin)
- `POST /api/admin/seed` - Initialize database with sample data

## 🎓 Course Information

**Course**: DIIC3110 - Information and Communication Technology for Development (ICT4D)  
**Institution**: Limkokwing University of Creative Technology  
**Semester**: 5  
**Lecturers**: Mr Hlabeli Batloung, Ms Itumeleng Mokhachane

## 📱 Responsive Design

The application is fully responsive and works across:
- Desktop computers
- Tablets
- Mobile devices
- Various screen sizes and orientations

## 🔒 Security Features

- Password hashing with bcryptjs
- Input validation and sanitization
- Protected API routes
- Role-based access control
- Secure session management

## 🌟 Key Learning Topics

1. **Password Security**: Strong password creation and management
2. **Phishing Recognition**: Identifying and avoiding social engineering
3. **Safe Browsing**: Best practices for internet security
4. **Data Protection**: Personal information security
5. **Mobile Security**: Smartphone and tablet protection

This platform serves as a comprehensive solution for cybersecurity awareness training, specifically designed to bridge digital literacy gaps in communities while maintaining professional development standards.