import fs from 'fs';
import path from 'path';

export function saveDataUrlAvatar(userId: string, dataUrl: string) {
  // Expected dataUrl: data:image/png;base64,....
  const match = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error('Invalid image data URL');
  }
  const mime = match[1];
  const base64 = match[2];
  const ext = mime.split('/')[1].toLowerCase();

  const uploadsDir = path.resolve(__dirname, '../uploads');
  const avatarsDir = path.join(uploadsDir, 'avatars');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

  const fileName = `${userId}.${ext}`;
  const filePath = path.join(avatarsDir, fileName);
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(filePath, buffer);

  const version = Date.now();
  const publicUrl = `/uploads/avatars/${fileName}?v=${version}`;
  return publicUrl;
}