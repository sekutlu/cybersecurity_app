import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import User from '@/models/User';
import Lesson from '@/models/Lesson';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lesson') || searchParams.get('lessonId');
    
    const filter: any = { isActive: true };
    if (lessonId) {
      filter.lessonId = lessonId;
    }

    const quizzes = await Quiz.find(filter)
      .sort({ createdAt: -1 });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Quizzes fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, questions, category, difficulty, timeLimit, lessonId } = await request.json();
    const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    await connectDB();

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      category,
      difficulty,
      timeLimit,
      lessonId,
      createdBy: userId,
    });

    return NextResponse.json({
      message: 'Quiz created successfully',
      quiz,
    });
  } catch (error) {
    console.error('Quiz creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}