import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db, User } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'sinevagas_super_secret_jwt_key_2026';

export interface TokenPayload {
  userId: number;
  email: string;
  role: 'candidate' | 'recruiter';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(req?: Request): Promise<User | null> {
  try {
    let token: string | undefined;

    if (req) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
      if (!token) {
        const cookieHeader = req.headers.get('cookie');
        if (cookieHeader) {
          const match = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
          if (match) {
            token = match[1];
          }
        }
      }
    }

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const dbUser = await db.findUserById(payload.userId);
    if (dbUser) return dbUser;

    return {
      id: payload.userId,
      name: payload.email ? payload.email.split('@')[0] : 'Usuário',
      email: payload.email,
      password_hash: '',
      role: payload.role || 'candidate',
      created_at: new Date().toISOString()
    };
  } catch {
    return null;
  }
}
