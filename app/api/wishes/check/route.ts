import { NextRequest, NextResponse } from 'next/server';
import { readWishes, isWishExpired } from '@/lib/wishesStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ valid: false, reason: 'missing_id' }, { status: 400 });
    }

    const wishes = readWishes();
    const wish = wishes[id];

    if (!wish) {
      return NextResponse.json({ valid: false, reason: 'not_found' });
    }

    if (wish.deleted) {
      return NextResponse.json({ valid: false, reason: 'deleted' });
    }

    if (isWishExpired(wish)) {
      return NextResponse.json({ valid: false, reason: 'expired' });
    }

    return NextResponse.json({
      valid: true,
      name: wish.name,
      message: wish.message,
      expiry: wish.expiry,
      timestamp: wish.timestamp,
      album: wish.album
    });
  } catch (error) {
    console.error('Error in wishes check route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
