import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        last_name: user.last_name || '',
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url || '',
        employment_status: user.employment_status || '',
        location: user.location || '',
        resume_url: user.resume_url || '',
        preferred_role: user.preferred_role || '',
        expected_salary: user.expected_salary || '',
        preferred_contract: user.preferred_contract || '',
        professional_summary: user.professional_summary || '',
        cpf: user.cpf || '',
        phone: user.phone || '',
        linkedin_url: user.linkedin_url || '',
        github_url: user.github_url || '',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
