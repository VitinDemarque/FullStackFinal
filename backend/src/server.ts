import 'dotenv/config';
import http from 'http';
import app from './app';
import { connectMongo, disconnectMongo } from './config/mongo';

const PORT = Number(process.env.PORT || 3000);

async function bootstrap() {
  // 1) Conecta ao MongoDB (Atlas/local)
  await connectMongo();

  // 2) Sobe o servidor HTTP do Express
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`[http] Listening on port ${PORT}`);
  });

  // 3) Encerramento gracioso
  const shutdown = async (signal: string) => {
    try {
      console.log(`[http] Received ${signal}. Closing server...`);
      await new Promise<void>((resolve) => server.close(() => resolve()));
      await disconnectMongo();
      console.log('[http] Shutdown complete');
      process.exit(0);
    } catch (err) {
      console.error('[http] Error during shutdown', err);
      process.exit(1);
    }
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));

  // 4) Erros não tratados
  process.on('unhandledRejection', (reason) => {
    console.error('[unhandledRejection]', reason);
  });
  process.on('uncaughtException', (err) => {
    console.error('[uncaughtException]', err);
    shutdown('uncaughtException');
  });
}

bootstrap().catch((err) => {
  console.error('[bootstrap] fatal', err);
  process.exit(1);
});
