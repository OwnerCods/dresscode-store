import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import type { PaymentRequest, YooMoneyPayment } from '../types/index.js';

const YOOMONEY_API_URL = 'https://api.yookassa.ru/v3';

export class YooMoneyService {
  private shopId: string;
  private secretKey: string;

  constructor() {
    this.shopId = process.env.YOOMONEY_SHOP_ID || '';
    this.secretKey = process.env.YOOMONEY_SECRET_KEY || '';
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async createPayment(data: PaymentRequest): Promise<any> {
    try {
      const idempotenceKey = uuidv4();

      const paymentData = {
        amount: {
          value: data.amount.toFixed(2),
          currency: 'RUB'
        },
        confirmation: {
          type: 'redirect',
          return_url: `${process.env.FRONTEND_URL || 'https://t.me/your_bot'}`
        },
        capture: true,
        description: data.description || `Заказ #${data.orderId}`,
        metadata: {
          order_id: data.orderId,
          user_id: data.userId?.toString()
        },
        receipt: {
          customer: {
            email: 'customer@example.com'
          },
          items: data.items.map(item => ({
            description: item.name,
            quantity: item.quantity.toString(),
            amount: {
              value: item.price.toFixed(2),
              currency: 'RUB'
            },
            vat_code: 1
          }))
        }
      };

      const response = await axios.post(
        `${YOOMONEY_API_URL}/payments`,
        paymentData,
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Idempotence-Key': idempotenceKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        paymentId: response.data.id,
        confirmationUrl: response.data.confirmation.confirmation_url,
        status: response.data.status
      };
    } catch (error: any) {
      console.error('YooMoney payment creation error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.description || 'Payment creation failed'
      };
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${YOOMONEY_API_URL}/payments/${paymentId}`,
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        paid: response.data.status === 'succeeded',
        status: response.data.status,
        amount: response.data.amount.value,
        metadata: response.data.metadata
      };
    } catch (error: any) {
      console.error('YooMoney status check error:', error.response?.data || error.message);
      return {
        success: false,
        error: 'Status check failed'
      };
    }
  }

  async cancelPayment(paymentId: string): Promise<any> {
    try {
      const idempotenceKey = uuidv4();

      const response = await axios.post(
        `${YOOMONEY_API_URL}/payments/${paymentId}/cancel`,
        {},
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Idempotence-Key': idempotenceKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        status: response.data.status
      };
    } catch (error: any) {
      console.error('YooMoney cancel error:', error.response?.data || error.message);
      return {
        success: false,
        error: 'Cancel failed'
      };
    }
  }
}
