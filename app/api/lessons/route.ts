import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lesson from '@/models/Lesson';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    const lessons = await Lesson.find({ isActive: true })
      .sort({ createdAt: -1 });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Lessons fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, content, videoUrl, youtubeId, duration, tutor, icon, difficulty, category } = await request.json();
    const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    await connectDB();

    const lesson = await Lesson.create({
      title,
      description,
      content,
      videoUrl,
      youtubeId,
      duration: duration ? parseInt(duration) : 0,
      tutor,
      icon,
      difficulty,
      category,
      createdBy: userId,
    });

    return NextResponse.json({
      message: 'Lesson created successfully',
      lesson,
    });
  } catch (error) {
    console.error('Lesson creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}