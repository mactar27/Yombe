import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    // Try Vercel Blob first (works in production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const blob = await put(filename, file, { access: 'public' });
      return NextResponse.json({ url: blob.url });
    }

    // Fallback: write to local public/uploads (dev only)
    const { writeFile, mkdir } = await import('fs/promises');
    const path = await import('path');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);
    return NextResponse.json({ url: '/uploads/' + filename });
  } catch (err: any) {
    console.error('[upload]', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
