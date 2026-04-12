import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface CreatePaymentParams {
  amount: number;
  orderId: string;
  userId?: number;
  description?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export const paymentService = {
  // 3.1 Создание платежа
  async createPayment(data: CreatePaymentParams) {
    const response = await axios.post(`${API_URL}/payment/create`, data);
    return response.data;
  },
  
  // 3.2 Проверка статуса
  async checkPaymentStatus(paymentId: string) {
    const response = await axios.get(`${API_URL}/payment/status/${paymentId}`);
    return response.data;
  },
  
  // 3.3 Открыть платежную форму
  openPaymentForm(url: string) {
    // В Telegram WebApp можно открыть в браузере
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  }
};