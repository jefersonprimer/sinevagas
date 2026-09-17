import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || undefined;
    const location = searchParams.get('location') || undefined;
    const type = searchParams.get('type') || undefined;

    const jobs = await db.getJobs(search, type, location);
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao carregar as vagas.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Você precisa estar autenticado para cadastrar uma vaga.' },
        { status: 401 }
      );
    }

    const {
      title,
      company,
      location,
      contract_type,
      salary,
      description,
      requirements,
      application_type,
      external_url,
      contact_whatsapp,
      contact_email,
    } = await req.json();

    if (!title || !company || !location || !contract_type || !description) {
      return NextResponse.json(
        { error: 'Preencha todos os campos obrigatórios (Título, Empresa, Localização, Tipo de contrato e Descrição).' },
        { status: 400 }
      );
    }

    const newJob = await db.createJob({
      title,
      company,
      location,
      contract_type,
      salary,
      description,
      requirements,
      user_id: user.id,
      application_type,
      external_url,
      contact_whatsapp,
      contact_email,
    });

    return NextResponse.json({ message: 'Vaga publicada com sucesso!', job: newJob }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao cadastrar a vaga.' },
      { status: 500 }
    );
  }
}
