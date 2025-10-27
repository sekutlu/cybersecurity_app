import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Lesson from '@/models/Lesson';
import Quiz from '@/models/Quiz';

export async function POST() {
  try {
    await connectDB();

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'cyberadmin@cybersecure.com' });
    let adminUser;
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('CyberAdmin123!', 12);
      adminUser = await User.create({
        name: 'Cyber Admin',
        email: 'cyberadmin@cybersecure.com',
        password: hashedPassword,
        role: 'admin',
        bio: 'Default administrator for CyberSecure platform',
      });
    } else {
      adminUser = existingAdmin;
    }

    // Create sample lessons
    const sampleLessons = [
      {
        title: 'Password Security Fundamentals',
        description: 'Learn how to create and manage strong passwords to protect your accounts.',
        content: 'Strong passwords are your first line of defense against cyber attacks. A good password should be at least 12 characters long, include a mix of uppercase and lowercase letters, numbers, and special characters. Avoid using personal information like birthdays or names. Consider using a password manager to generate and store unique passwords for each account.',
        youtubeId: 'aEmF3Iylvr4',
        category: 'Authentication',
        difficulty: 'beginner',
        icon: 'lock',
        createdBy: adminUser._id,
      },
      {
        title: 'Recognizing Phishing Attacks',
        description: 'Identify and avoid phishing emails and websites that steal your information.',
        content: 'Phishing attacks trick users into revealing sensitive information by impersonating trusted entities. Look for suspicious email addresses, urgent language, spelling errors, and requests for personal information. Always verify the sender through a separate communication channel before clicking links or downloading attachments.',
        youtubeId: 'XBkzBrXlle0',
        category: 'Social Engineering',
        difficulty: 'beginner',
        icon: 'alert-triangle',
        createdBy: adminUser._id,
      },
      {
        title: 'Safe Internet Browsing',
        description: 'Best practices for staying safe while browsing the internet.',
        content: 'Safe browsing involves being cautious about the websites you visit and the links you click. Use reputable browsers with security features enabled, keep your browser updated, avoid downloading software from untrusted sources, and be wary of pop-ups and suspicious advertisements.',
        youtubeId: 'ULGILG-ZhO0',
        category: 'Web Security',
        difficulty: 'beginner',
        icon: 'globe',
        createdBy: adminUser._id,
      },
    ];

    for (const lessonData of sampleLessons) {
      const existingLesson = await Lesson.findOne({ title: lessonData.title });
      if (!existingLesson) {
        await Lesson.create(lessonData);
      }
    }

    // Create sample quiz
    const sampleQuiz = {
      title: 'Cybersecurity Basics Quiz',
      description: 'Test your knowledge of fundamental cybersecurity concepts.',
      category: 'General',
      difficulty: 'beginner',
      questions: [
        {
          question: 'What makes a password strong?',
          options: [
            'Using your birthday',
            'At least 12 characters with mixed case, numbers, and symbols',
            'Using the same password everywhere',
            'Writing it down on paper'
          ],
          correctAnswer: 'At least 12 characters with mixed case, numbers, and symbols',
          explanation: 'Strong passwords should be long, complex, and unique to each account.'
        },
        {
          question: 'What is phishing?',
          options: [
            'A type of fishing',
            'A computer virus',
            'An attempt to steal information by impersonating trusted entities',
            'A software update'
          ],
          correctAnswer: 'An attempt to steal information by impersonating trusted entities',
          explanation: 'Phishing attacks use deception to trick users into revealing sensitive information.'
        },
        {
          question: 'What should you do if you receive a suspicious email?',
          options: [
            'Click all links to investigate',
            'Forward it to everyone',
            'Delete it and verify with the sender through another channel',
            'Reply asking for more information'
          ],
          correctAnswer: 'Delete it and verify with the sender through another channel',
          explanation: 'Always verify suspicious communications through a separate, trusted channel.'
        }
      ],
      createdBy: adminUser._id,
    };

    const existingQuiz = await Quiz.findOne({ title: sampleQuiz.title });
    if (!existingQuiz) {
      await Quiz.create(sampleQuiz);
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      admin: {
        email: 'cyberadmin@cybersecure.com',
        password: 'CyberAdmin123!',
      },
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}