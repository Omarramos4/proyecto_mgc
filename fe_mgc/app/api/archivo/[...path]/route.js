import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(req) {
  try {
    // Obtener la ruta del archivo desde la URL
    const url = new URL(req.url);
    // El pathname será algo como /api/archivo/archivos-coberturas/2025/08/20250820_1_1.pdf
    // Quitamos la parte inicial /api/archivo/
    const filePath = url.pathname.replace('/api/archivo/', '');
    
    // Construir la ruta completa al archivo en el backend
    const fullPath = path.resolve(process.cwd(), '..', 'be_mgc', 'storage', 'app', filePath);
    
    // Verificar si el archivo existe
    try {
      await fs.access(fullPath);
    } catch (error) {
      return new NextResponse('Archivo no encontrado', { status: 404 });
    }

    // Leer el archivo
    const fileBuffer = await fs.readFile(fullPath);
    
    // Determinar el tipo de contenido basado en la extensión
    const extension = path.extname(fullPath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.pdf':
        contentType = 'application/pdf';
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
      default:
        contentType = 'application/octet-stream';
    }

    // Retornar el archivo con el tipo de contenido apropiado
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        // Permitir que se abra en el navegador en lugar de descargar automáticamente
        'Content-Disposition': `inline; filename="${path.basename(fullPath)}"`,
        // Headers optimizados para cache
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 año
        'ETag': `"${Date.now()}"`, // Simple ETag
        // Headers de compresión
        'Vary': 'Accept-Encoding',
        // Headers de seguridad
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('Error al servir archivo:', error);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
