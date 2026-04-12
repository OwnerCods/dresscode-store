import express, { Request, Response } from 'express';

const router = express.Router();

// Проверка, является ли пользователь админом
router.get('/check-admin/:userId', (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    // Получаем список админов из переменных окружения
    const adminIds = (process.env.ADMIN_TELEGRAM_IDS || '')
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id));

    const isAdmin = adminIds.includes(userId);

    console.log(`Admin check for user ${userId}: ${isAdmin}`);
    console.log(`Admin IDs: ${adminIds.join(', ')}`);

    res.json({
      success: true,
      isAdmin
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
