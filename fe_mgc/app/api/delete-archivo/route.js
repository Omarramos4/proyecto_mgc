import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rutaArchivo = searchParams.get('rutaArchivo');

    if (!rutaArchivo) {
      return NextResponse.json({ error: 'Ruta de archivo requerida' }, { status: 400 });
    }

    // Construir la ruta completa del archivo en el backend
    const filePath = path.resolve(process.cwd(), '..', 'be_mgc', 'storage', 'app', rutaArchivo);

    try {
      // Intentar eliminar el archivo
      await unlink(filePath);
      return NextResponse.json({ success: true });
    } catch (error) {
      // Si el archivo no existe, considerarlo como éxito
      if (error.code === 'ENOENT') {
        return NextResponse.json({ success: true, message: 'Archivo no encontrado' });
      }
      throw error;
    }

  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
