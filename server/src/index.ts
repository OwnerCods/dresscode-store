import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Database } from './services/database.js';
import ordersRouter from './routes/orders.js';
import paymentRouter from './routes/payment.js';
import userRouter from './routes/user.js';

// Загружаем переменные окружения
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Инициализация базы данных
const db = Database.getInstance();
await db.init();

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Dress Code Store API',
    version: '1.0.0',
    endpoints: {
      orders: '/api/orders',
      payment: '/api/payment',
      user: '/api/user'
    }
  });
});

// API Routes
app.use('/api/orders', ordersRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/user', userRouter);

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

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`👤 Admin IDs configured: ${process.env.ADMIN_TELEGRAM_IDS || 'NOT SET'}`);
});

export default app;
