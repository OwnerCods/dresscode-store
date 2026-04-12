import { Router, Request, Response } from 'express';
import { YooMoneyService } from '../services/yoomoney';
import { Database } from '../services/database';

const router = Router();
const yooMoney = new YooMoneyService();
const db = Database.getInstance();

// Создать платеж
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { amount, orderId, userId, description, items } = req.body;

    if (!amount || !orderId || !items) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Создаем платеж в YooMoney
    const paymentResult = await yooMoney.createPayment({
      amount,
      orderId,
      userId,
      description,
      items
    });

    if (!paymentResult.success) {
      return res.status(500).json(paymentResult);
    }

    // Обновляем заказ с ID платежа
    await db.updateOrder(orderId, {
      paymentId: paymentResult.paymentId,
      paymentStatus: 'pending'
    });

    res.json({
      success: true,
      paymentId: paymentResult.paymentId,
      confirmationUrl: paymentResult.confirmationUrl
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment'
    });
  }
});

// Проверить статус платежа
router.get('/status/:paymentId', async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.paymentId as string;

    const statusResult = await yooMoney.checkPaymentStatus(paymentId);

    if (!statusResult.success) {
      return res.status(500).json(statusResult);
    }

    // Если платеж успешен, обновляем заказ
    if (statusResult.paid) {
      const orders = await db.getAllOrders();
      const order = orders.find(o => o.paymentId === paymentId);

      if (order) {
        await db.updateOrder(order.id, {
          status: 'paid',
          paymentStatus: 'succeeded'
        });
      }
    }

    res.json(statusResult);
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check payment status'
    });
  }
});

// Webhook для уведомлений от YooMoney
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { object } = req.body;

    if (!object || !object.id) {
      return res.status(400).json({ error: 'Invalid webhook data' });
    }

    const paymentId = object.id;
    const status = object.status;
    const metadata = object.metadata;

    console.log('Webhook received:', { paymentId, status, metadata });

    // Обновляем статус заказа
    if (metadata?.order_id) {
      const updates: any = {
        paymentStatus: status === 'succeeded' ? 'succeeded' : status === 'canceled' ? 'failed' : 'pending'
      };

      if (status === 'succeeded') {
        updates.status = 'paid';
      }

      await db.updateOrder(metadata.order_id, updates);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Отменить платеж
router.post('/cancel/:paymentId', async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.paymentId as string;

    const cancelResult = await yooMoney.cancelPayment(paymentId);

    if (!cancelResult.success) {
      return res.status(500).json(cancelResult);
    }

    // Обновляем заказ
    const orders = await db.getAllOrders();
    const order = orders.find(o => o.paymentId === paymentId);

    if (order) {
      await db.updateOrder(order.id, {
        status: 'cancelled',
        paymentStatus: 'failed'
      });
    }

    res.json(cancelResult);
  } catch (error) {
    console.error('Payment cancel error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel payment'
    });
  }
});

export default router;
