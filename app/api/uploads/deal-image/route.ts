import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/api-auth';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

export async function POST(req: Request) {
  const auth = await requireRole(req, ['SELLER', 'ADMIN']);
  if (!auth.token) {
    return auth.error;
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, and WEBP images are allowed' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image must be 5MB or smaller' }, { status: 400 });
    }

    const extension = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : '';
    const safeExtension = extension && /^[a-z0-9]+$/.test(extension) ? extension : 'jpg';
    const fileName = `${randomUUID()}.${safeExtension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'deals');
    const absolutePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await mkdir(uploadDir, { recursive: true });
    await writeFile(absolutePath, buffer);

    return NextResponse.json({
      imageUrl: `/uploads/deals/${fileName}`,
    });
  } catch (error) {
    console.error('Deal image upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
