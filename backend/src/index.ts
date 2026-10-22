import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import categoryRoutes from './routes/categoryRoutes.js';
import questionSetRoutes from './routes/questionSetRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import importRoutes from './routes/importRoutes.js';
import soloRoutes from './routes/soloRoutes.js';
import multiplayerRoutes from './routes/multiplayerRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { setupRoomSocketHandler } from './sockets/roomSocketHandler.js';
import db from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); 
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await db.raw('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});


app.use('/api/categories', categoryRoutes);
app.use('/api/question-sets', questionSetRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/import', importRoutes);
app.use('/api/solo', soloRoutes);
app.use('/api/multiplayer', multiplayerRoutes);
app.use('/api/ai', aiRoutes);


app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[SERVER ERROR]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server.',
  });
});


const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupRoomSocketHandler(io);

const PORT = Number(process.env.PORT) || 5000;

server.listen(PORT, () => {
  console.log(`[SERVER] UKOM Quiz backend running on http://localhost:${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { app, server, io };
