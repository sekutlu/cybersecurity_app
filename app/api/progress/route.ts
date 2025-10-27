import { NextResponse } from 'next/server';
import progress from '@/data/progress.json';

export async function GET() {
  return NextResponse.json(progress[0]);
}
