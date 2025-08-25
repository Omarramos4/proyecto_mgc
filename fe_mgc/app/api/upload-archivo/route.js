import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const tipoDocumento = formData.get('tipoDocumento');
    const coberturaId = formData.get('coberturaId') || 'temp';
    const userId = formData.get('userId'); // Para archivos de rechazo

    if (!file) {
      return NextResponse.json({ error: 'No se encontró el archivo' }, { status: 400 });
    }

    if (!tipoDocumento) {
      return NextResponse.json({ error: 'Tipo de documento requerido' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Obtener la fecha actual para organizar por año/mes
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const fechaFormato = fecha.toISOString().split('T')[0].replace(/-/g, '');
    
    // Obtener la extensión del archivo original
    const extension = path.extname(file.name);
    
    // Crear el nombre del archivo según el tipo de documento
    let nombreArchivo;
    if (tipoDocumento === 'rejection') {
      // Formato específico para archivos de rechazo: justificacion_rechazo_fecha_idcobertura_idusuarioquerechaza
      nombreArchivo = `justificacion_rechazo_${fechaFormato}_${coberturaId}_${userId || 'unknown'}${extension}`;
    } else {
      // Formato original para otros tipos de documentos
      nombreArchivo = `${fechaFormato}_${coberturaId}_${tipoDocumento}${extension}`;
    }
    
    // Definir la ruta en el backend (storage de Laravel)
    const backendPath = path.resolve(process.cwd(), '..', 'be_mgc', 'storage', 'app', 'archivos-coberturas', año.toString(), mes);
    const filePath = path.join(backendPath, nombreArchivo);

    // Crear el directorio si no existe (incluyendo año/mes)
    await mkdir(backendPath, { recursive: true });

    // Escribir el archivo solo en el backend
    await writeFile(filePath, buffer);

    // Devolver la ruta relativa del archivo (para la base de datos)
    const rutaRelativa = `archivos-coberturas/${año}/${mes}/${nombreArchivo}`;

    return NextResponse.json({ 
      success: true, 
      rutaArchivo: rutaRelativa,
      nombreArchivo: nombreArchivo,
      fullPath: filePath
    });

  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
