import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('user-id') || request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await connectDB();
    // For now, return empty array as we're using localStorage
    const progress = [];
    
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, lessonId, status, completedAt } = await request.json();
    
    if (!userId || !lessonId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    // For now, just return success as we're using localStorage
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving lesson progress:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}