import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este e-mail já está cadastrado.' },
        { status: 400 }
      );
    }

    const userRole = role === 'recruiter' ? 'recruiter' : 'candidate';
    const passwordHash = await hashPassword(password);
    const user = await db.createUser(name, email, passwordHash, userRole);

    const token = generateToken(user);

    const response = NextResponse.json({
      message: 'Cadastro realizado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao realizar o cadastro.' },
      { status: 500 }
    );
  }
}
