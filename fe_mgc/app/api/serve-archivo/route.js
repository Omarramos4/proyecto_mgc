import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { headers } from 'next/headers';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rutaArchivo = searchParams.get('ruta');

    if (!rutaArchivo) {
      return NextResponse.json({ error: 'Ruta de archivo requerida' }, { status: 400 });
    }

    // Validar que la ruta sea segura (evitar path traversal)
    if (rutaArchivo.includes('..') || rutaArchivo.includes('\\..\\') || rutaArchivo.includes('/../')) {
      return NextResponse.json({ error: 'Ruta de archivo inválida' }, { status: 400 });
    }

    // Construir la ruta completa del archivo en el backend
    const filePath = path.resolve(process.cwd(), '..', 'be_mgc', 'storage', 'app', rutaArchivo);

    try {
      // Verificar que el archivo existe
      const stats = await stat(filePath);
      
      if (!stats.isFile()) {
        return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
      }

      // Leer el archivo
      const fileBuffer = await readFile(filePath);
      
      // Determinar el tipo de contenido basado en la extensión
      const extension = path.extname(filePath).toLowerCase();
      let contentType = 'application/octet-stream';
      
      switch (extension) {
        case '.pdf':
          contentType = 'application/pdf';
          break;
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.doc':
          contentType = 'application/msword';
          break;
        case '.docx':
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.xls':
          contentType = 'application/vnd.ms-excel';
          break;
        case '.xlsx':
          contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
      }

      // Crear respuesta con el archivo
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': stats.size.toString(),
          'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,
          'Cache-Control': 'public, max-age=31536000', // Cache por 1 año
        },
      });

    } catch (error) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
      }
      throw error;
    }

  } catch (error) {
    console.error('Error al servir archivo:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
