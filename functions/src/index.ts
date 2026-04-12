import * as functions from 'firebase-functions';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { Database } from './services/database';
import ordersRouter from './routes/orders';
import paymentRouter from './routes/payment';

const app: Express = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Инициализация базы данных
let dbInitialized = false;
const initDb = async () => {
  if (!dbInitialized) {
    const db = Database.getInstance();
    await db.init();
    dbInitialized = true;
  }
};

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Dress Code Store API',
    version: '1.0.0',
    endpoints: {
      orders: '/api/orders',
      payment: '/api/payment'
    }
  });
});

// API Routes
app.use('/api/orders', async (req, res, next) => {
  await initDb();
  next();
}, ordersRouter);

app.use('/api/payment', async (req, res, next) => {
  await initDb();
  next();
}, paymentRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Export Express app as Firebase Function
export const api = functions.https.onRequest(app);
