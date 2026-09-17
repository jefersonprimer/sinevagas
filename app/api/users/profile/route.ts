import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Você precisa estar autenticado.' }, { status: 401 });
    }

    const { 
      name, 
      last_name, 
      email,
      avatar_url, 
      employment_status, 
      location, 
      resume_url,
      preferred_role,
      expected_salary,
      preferred_contract,
      professional_summary,
      cpf,
      phone,
      linkedin_url,
      github_url,
    } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'O nome é obrigatório.' }, { status: 400 });
    }

    const updatedUser = await db.updateUserProfile(currentUser.id, {
      name,
      last_name,
      email,
      avatar_url,
      employment_status,
      location,
      resume_url,
      preferred_role,
      expected_salary,
      preferred_contract,
      professional_summary,
      cpf,
      phone,
      linkedin_url,
      github_url,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'Erro ao atualizar perfil do usuário.' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        last_name: updatedUser.last_name || '',
        email: updatedUser.email,
        role: updatedUser.role,
        avatar_url: updatedUser.avatar_url || '',
        employment_status: updatedUser.employment_status || '',
        location: updatedUser.location || '',
        resume_url: updatedUser.resume_url || '',
        preferred_role: updatedUser.preferred_role || '',
        expected_salary: updatedUser.expected_salary || '',
        preferred_contract: updatedUser.preferred_contract || '',
        professional_summary: updatedUser.professional_summary || '',
        cpf: updatedUser.cpf || '',
        phone: updatedUser.phone || '',
        linkedin_url: updatedUser.linkedin_url || '',
        github_url: updatedUser.github_url || '',
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json({ error: 'Erro ao salvar alterações do perfil.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Você precisa estar autenticado.' }, { status: 401 });
    }

    await db.deleteUser(currentUser.id);

    const response = NextResponse.json({ message: 'Sua conta foi excluída com sucesso.' });
    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    return NextResponse.json({ error: 'Ocorreu um erro ao excluir a conta.' }, { status: 500 });
  }
}
