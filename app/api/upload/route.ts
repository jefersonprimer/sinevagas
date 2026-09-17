import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const uploadType = (formData.get('type') as string) || 'pdf'; // 'pdf' ou 'avatar'

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const fileExt = path.extname(file.name).toLowerCase();

    if (uploadType === 'avatar') {
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
      if (!allowedExts.includes(fileExt) && !file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Apenas imagens nos formatos JPG, PNG ou WEBP são permitidas para a foto de perfil.' },
          { status: 400 }
        );
      }
    } else {
      const isPdf = file.type === 'application/pdf' || fileExt === '.pdf';
      if (!isPdf) {
        return NextResponse.json(
          { error: 'Formato inválido. Por favor, envie um arquivo em formato PDF.' },
          { status: 400 }
        );
      }
    }

    // Tamanho máximo: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'O arquivo é muito grande. O tamanho máximo permitido é 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folderName = uploadType === 'avatar' ? 'avatars' : 'uploads';
    const uploadsDir = path.join(process.cwd(), 'public', folderName);
    await mkdir(uploadsDir, { recursive: true });

    const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const prefix = uploadType === 'avatar' ? 'avatar' : 'cv';
    const fileName = `${prefix}_${Date.now()}_${sanitizedOriginal}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    const fileUrl = `/${folderName}/${fileName}`;

    return NextResponse.json({
      message: 'Upload realizado com sucesso!',
      url: fileUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error('Erro ao processar upload:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao salvar o arquivo no servidor.' },
      { status: 500 }
    );
  }
}
