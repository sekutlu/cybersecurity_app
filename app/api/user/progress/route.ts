import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const totalQuizzes = user.quizScores.length;
    const averageScore = totalQuizzes > 0 
      ? Math.round(user.quizScores.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes)
      : 0;

    return NextResponse.json({
      username: user.name,
      quizzesTaken: totalQuizzes,
      averageScore,
      completedLessons: user.completedLessons,
      badges: user.badges,
      lastActive: user.lastActive,
    });
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, score, totalQuestions, lessonId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    await connectDB();

    const updateData: any = {
      lastActive: new Date(),
    };

    if (score !== undefined && totalQuestions !== undefined) {
      updateData.$push = {
        quizScores: { score, totalQuestions, date: new Date() }
      };
    }

    if (lessonId !== undefined) {
      updateData.$addToSet = {
        completedLessons: lessonId
      };
    }

    await User.findByIdAndUpdate(userId, updateData);

    return NextResponse.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}