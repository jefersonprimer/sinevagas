import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const jobId = parseInt(resolvedParams.id, 10);
    if (isNaN(jobId)) {
      return NextResponse.json({ error: 'ID de vaga inválido.' }, { status: 400 });
    }

    const job = await db.getJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Vaga não encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Erro ao buscar vaga:', error);
    return NextResponse.json({ error: 'Erro ao carregar detalhes da vaga.' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const resolvedParams = await params;
    const jobId = parseInt(resolvedParams.id, 10);
    if (isNaN(jobId)) {
      return NextResponse.json({ error: 'ID de vaga inválido.' }, { status: 400 });
    }

    const success = await db.deleteJob(jobId, user.id);
    if (!success) {
      return NextResponse.json({ error: 'Vaga não encontrada ou você não tem permissão para excluí-la.' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Vaga removida com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar vaga:', error);
    return NextResponse.json({ error: 'Erro ao excluir vaga.' }, { status: 500 });
  }
}
