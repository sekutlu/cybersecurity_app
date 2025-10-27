import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import User from '@/models/User';
import Lesson from '@/models/Lesson';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    const quiz = await Quiz.findById(params.id);
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Quiz fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { action } = body;
    
    await connectDB();
    
    if (action === 'addQuestion') {
      const { question } = body;
      const quiz = await Quiz.findById(params.id);
      if (!quiz) {
        return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
      }
      
      quiz.questions.push(question);
      await quiz.save();
      
      return NextResponse.json({ success: true, quiz });
    }
    
    if (action === 'updateQuiz') {
      const { title, description, category, difficulty, lessonId, questions } = body;
      const quiz = await Quiz.findByIdAndUpdate(
        params.id,
        {
          title,
          description,
          category,
          difficulty,
          lessonId,
          questions
        },
        { new: true }
      );
      
      if (!quiz) {
        return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, quiz });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 });
  }
}