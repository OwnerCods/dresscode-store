import { Router, Request, Response } from 'express';
import { Database } from '../services/database';
import { v4 as uuidv4 } from 'uuid';
import type { Order, CartItem } from '../types/index';

const router = Router();
const db = Database.getInstance();

// Создать новый заказ
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { userId, userName, items, total, deliveryPrice, phone, email, notes } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order data'
      });
    }

    const order: Order = {
      id: uuidv4(),
      userId,
      userName,
      items,
      total,
      deliveryPrice: deliveryPrice || 0,
      finalTotal: total + (deliveryPrice || 0),
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phone,
      email,
      notes
    };

    const createdOrder = await db.createOrder(order);

    res.json({
      success: true,
      order: createdOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

// Получить заказ по ID
router.get('/:orderId', async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId as string;
    const order = await db.getOrder(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get order'
    });
  }
});

// Получить заказы пользователя
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId as string);
    const orders = await db.getOrdersByUser(userId);

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get orders'
    });
  }
});

// Обновить статус заказа
router.patch('/:orderId/status', async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId as string;
    const { status, paymentId, paymentStatus } = req.body;

    const updates: Partial<Order> = {};
    if (status) updates.status = status;
    if (paymentId) updates.paymentId = paymentId;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const updatedOrder = await db.updateOrder(orderId, updates);

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order'
    });
  }
});

// Получить все заказы (для админа)
router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await db.getAllOrders();

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get orders'
    });
  }
});

// Получить статистику заказов
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const stats = await db.getOrderStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get stats'
    });
  }
});

// Удалить заказ (только для неоплаченных и отмененных)
router.delete('/:orderId', async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId as string;
    const order = await db.getOrder(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Разрешаем удалять только неоплаченные или отмененные заказы
    if (order.status !== 'pending' && order.status !== 'cancelled') {
      return res.status(403).json({
        success: false,
        error: 'Can only delete pending or cancelled orders'
      });
    }

    const deleted = await db.deleteOrder(orderId);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete order'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete order'
    });
  }
});

export default router;
