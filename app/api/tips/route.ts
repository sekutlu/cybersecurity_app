import { NextResponse } from 'next/server';
import tips from '@/data/tips.json';

export async function GET() {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  return NextResponse.json({ tip: randomTip });
}
