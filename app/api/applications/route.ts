import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Você precisa estar autenticado.' }, { status: 401 });
    }

    if (user.role === 'recruiter') {
      const applications = await db.getApplicationsForRecruiter(user.id);
      return NextResponse.json({ applications });
    } else {
      const applications = await db.getApplicationsForCandidate(user.id);
      return NextResponse.json({ applications });
    }
  } catch (error) {
    console.error('Erro ao buscar candidaturas:', error);
    return NextResponse.json({ error: 'Erro ao carregar candidaturas.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      job_id,
      candidate_name,
      candidate_email,
      candidate_phone,
      candidate_location,
      linkedin_url,
      github_url,
      resume_link,
      cover_letter,
    } = body;

    if (!job_id || !candidate_name || !candidate_email || !resume_link) {
      return NextResponse.json(
        { error: 'Preencha todos os campos obrigatórios (Nome, E-mail e Link do Currículo/Portfólio).' },
        { status: 400 }
      );
    }

    const application = await db.createApplication({
      job_id: parseInt(job_id, 10),
      candidate_id: user?.id,
      candidate_name,
      candidate_email,
      candidate_phone: candidate_phone || user?.phone,
      candidate_location: candidate_location || user?.location,
      linkedin_url: linkedin_url || user?.linkedin_url,
      github_url: github_url || user?.github_url,
      resume_link,
      cover_letter,
    });

    return NextResponse.json(
      { message: 'Candidatura enviada com sucesso! Boa sorte!', application },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao enviar candidatura:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao enviar sua candidatura.' },
      { status: 500 }
    );
  }
}
