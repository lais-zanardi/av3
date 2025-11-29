import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { measureProcessingTime } from './middlewares/performance';
import { errorHandler } from './middlewares/errorHandler';
import Logger from './utils/Logger';
import { router } from './routes'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(measureProcessingTime);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date() });
});

app.use(router);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  Logger.info(`🚀 Servidor Aerocode rodando na porta ${PORT}`);
  Logger.info(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => {
  Logger.info('SIGTERM recebido. Encerrando servidor graciosamente...');
  server.close(() => {
    Logger.info('Servidor encerrado.');
    process.exit(0);
  });
});