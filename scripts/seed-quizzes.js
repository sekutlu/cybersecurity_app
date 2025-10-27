const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://relebohilesekutlu26_db_user:password112@cluster0.y5n8s0i.mongodb.net/cybersecure_db?retryWrites=true&w=majority');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Quiz Schema
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  passScore: { type: Number, default: 80 },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: String
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

const seedQuizzes = async () => {
  try {
    await connectDB();

    // Clear existing quizzes
    await Quiz.deleteMany({});

    const quizzes = [
      {
        title: "Cybersecurity Fundamentals Quiz",
        description: "Test your knowledge of basic cybersecurity concepts from the Google Cybersecurity Certificate course",
        category: "Malware,Phishing",
        difficulty: "beginner",
        lessonId: "68ff3e242181f9e5a73ac117", // Google Cybersecurity Certificate lesson
        passScore: 80,
        questions: [
          {
            question: "What is the primary goal of cybersecurity?",
            options: ["To make computers faster", "To protect digital systems and data", "To create new software", "To design websites"],
            correctAnswer: "To protect digital systems and data",
            explanation: "Cybersecurity focuses on protecting digital systems, networks, and data from cyber threats and unauthorized access."
          },
          {
            question: "Which of the following is considered a social engineering attack?",
            options: ["Installing antivirus software", "Phishing emails", "Regular software updates", "Using strong passwords"],
            correctAnswer: "Phishing emails",
            explanation: "Phishing emails are a common social engineering attack where attackers impersonate legitimate entities to steal sensitive information."
          },
          {
            question: "What does CIA stand for in cybersecurity?",
            options: ["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Computer Internet Access", "Cyber Investigation Authority"],
            correctAnswer: "Confidentiality, Integrity, Availability",
            explanation: "The CIA triad represents the three core principles of information security: Confidentiality, Integrity, and Availability."
          },
          {
            question: "Which type of malware can replicate itself and spread to other systems?",
            options: ["Spyware", "Adware", "Virus", "Firewall"],
            correctAnswer: "Virus",
            explanation: "A virus is a type of malware that can replicate itself and spread from one computer to another, often causing damage to files and systems."
          },
          {
            question: "What is the best practice for creating strong passwords?",
            options: ["Use personal information", "Use the same password everywhere", "Use a mix of letters, numbers, and symbols", "Use short, simple words"],
            correctAnswer: "Use a mix of letters, numbers, and symbols",
            explanation: "Strong passwords should include a combination of uppercase and lowercase letters, numbers, and special symbols to make them harder to crack."
          }
        ],
        createdBy: "68ff3af3e942de2562a7f439",
        isActive: true
      },
      {
        title: "Cybersecurity Basics Assessment",
        description: "Quick assessment of cybersecurity fundamentals and best practices",
        category: "Malware",
        difficulty: "beginner",
        lessonId: "68ff516e2181f9e5a73ac196", // Edureka cybersecurity lesson
        passScore: 80,
        questions: [
          {
            question: "What is cybersecurity?",
            options: ["A type of computer game", "Protection of digital systems from threats", "A programming language", "A type of hardware"],
            correctAnswer: "Protection of digital systems from threats",
            explanation: "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks and unauthorized access."
          },
          {
            question: "Which of these is NOT a common cyber threat?",
            options: ["Malware", "Phishing", "Regular software updates", "Ransomware"],
            correctAnswer: "Regular software updates",
            explanation: "Regular software updates are actually a cybersecurity best practice, not a threat. They help patch security vulnerabilities."
          },
          {
            question: "What should you do if you receive a suspicious email?",
            options: ["Click all links to investigate", "Forward it to everyone", "Delete it and report it", "Reply asking for more information"],
            correctAnswer: "Delete it and report it",
            explanation: "Suspicious emails should be deleted and reported to your IT security team. Never click on suspicious links or attachments."
          },
          {
            question: "How often should you update your passwords?",
            options: ["Never", "Every few years", "Regularly, especially if compromised", "Only when forced to"],
            correctAnswer: "Regularly, especially if compromised",
            explanation: "Passwords should be updated regularly and immediately if there's any indication they may have been compromised."
          }
        ],
        createdBy: "68ff3af3e942de2562a7f439",
        isActive: true
      }
    ];

    await Quiz.insertMany(quizzes);
    console.log('Quizzes seeded successfully!');
    console.log(`Created ${quizzes.length} quizzes`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    process.exit(1);
  }
};

seedQuizzes();