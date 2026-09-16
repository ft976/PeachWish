import fs from 'fs';
import path from 'path';

export interface AlbumMoment {
  imageUrl: string;
  caption: string;
}

export interface WishRecord {
  id: string;
  name: string;
  message: string;
  expiry: string; // '1h', '24h', '7d', 'never'
  timestamp: number;
  deleted?: boolean;
  album?: AlbumMoment[];
}

const DB_FILE = path.join(process.cwd(), 'wishes_db.json');

// Helper to safely read database
export function readWishes(): Record<string, WishRecord> {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return {};
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data || '{}');
  } catch (error) {
    console.error('Error reading wishes database:', error);
    return {};
  }
}

// Helper to safely write database
export function writeWishes(wishes: Record<string, WishRecord>) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(wishes, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing wishes database:', error);
  }
}

// Check if a wish has expired based on duration
export function isWishExpired(wish: WishRecord): boolean {
  if (wish.expiry === 'never') return false;
  let duration = 0;
  if (wish.expiry === '1h') duration = 60 * 60 * 1000;
  else if (wish.expiry === '3h') duration = 3 * 60 * 60 * 1000;
  else if (wish.expiry === '6h') duration = 6 * 60 * 60 * 1000;
  else if (wish.expiry === '12h') duration = 12 * 60 * 60 * 1000;
  else if (wish.expiry === '24h') duration = 24 * 60 * 60 * 1000;
  else if (wish.expiry === '7d') duration = 7 * 24 * 60 * 60 * 1000;
  else duration = 24 * 60 * 60 * 1000; // Safe fallback so links never expire instantly
  return Date.now() > wish.timestamp + duration;
}
