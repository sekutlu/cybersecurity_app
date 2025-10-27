import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'cyberadmin@cybersecure.com' });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 200 }
      );
    }

    // Create default admin user
    const hashedPassword = await bcrypt.hash('CyberAdmin123!', 12);

    const adminUser = await User.create({
      name: 'Cyber Admin',
      email: 'cyberadmin@cybersecure.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'Default administrator for CyberSecure platform',
    });

    return NextResponse.json({
      message: 'Admin user created successfully',
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error('Admin initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize admin user' },
      { status: 500 }
    );
  }
}