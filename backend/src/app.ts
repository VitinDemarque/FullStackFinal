import express from 'express';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middlewares/error';
import routes from './routes';

const app = express();
app.use(helmet());
app.use(cors());
// Increase JSON and URL-encoded body limits to support avatar uploads via data URL
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ limit: '8mb', extended: true }));

// Static serving for uploaded files (e.g., avatars)
const uploadsDir = path.resolve(__dirname, '../uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');
try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Failed initializing uploads directory:', err);
}
// Serve from backend/uploads (primary) and also fallback to backend/src/uploads (legacy)
app.use('/uploads', express.static(uploadsDir, { fallthrough: true }));
app.use('/uploads', express.static(path.resolve(__dirname, './uploads'), { fallthrough: true }));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
