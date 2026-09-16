import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { readWishes, writeWishes, WishRecord } from '@/lib/wishesStore';

export async function POST(req: NextRequest) {
  try {
    const { name, message, expiry, album } = await req.json();
    
    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
    }

    // Generate a cryptographically secure 32-character hex ID
    const id = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();

    const wishes = readWishes();
    const newRecord: WishRecord = {
      id,
      name,
      message,
      expiry,
      timestamp,
      deleted: false,
      album
    };

    wishes[id] = newRecord;
    writeWishes(wishes);

    const origin = req.nextUrl.origin;
    const url = `${origin}/surprise/index.html?id=${id}`;

    return NextResponse.json({ id, url, timestamp });
  } catch (error) {
    console.error('Error in wishes create route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
