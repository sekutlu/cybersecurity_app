const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://relebohilesekutlu26_db_user:password112@cluster0.y5n8s0i.mongodb.net/cybersecurity_app?retryWrites=true&w=majority&appName=Cluster0';

// User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  bio: String,
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
  quizScores: [{ score: Number, totalQuestions: Number, date: Date }],
  badges: [String],
});

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'cyberadmin@cybersecure.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('CyberAdmin123!', 12);
    const admin = await User.create({
      name: 'Cyber Admin',
      email: 'cyberadmin@cybersecure.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'Default administrator for CyberSecure platform',
    });

    console.log('Admin created successfully:');
    console.log('Email: cyberadmin@cybersecure.com');
    console.log('Password: CyberAdmin123!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();