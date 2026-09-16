import { NextRequest, NextResponse } from 'next/server';
import { readWishes, writeWishes } from '@/lib/wishesStore';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const wishes = readWishes();
    if (wishes[id]) {
      wishes[id].deleted = true;
      writeWishes(wishes);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
  } catch (error) {
    console.error('Error in wishes delete route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
