import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/auth'; // Adjust the path based on your project structure

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      console.log('Unauthorized access attempt.');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error validating request:', error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
