import type { CartItem } from '../types'; // 👈 Добавьте импорт

export const generateOrderId = (): string => {
  const date = new Date();
  const timestamp = date.getTime();
  const random = Math.floor(Math.random() * 10000);
  return `ORDER-${timestamp}-${random}`;
};

export const formatItemsForPayment = (items: CartItem[]) => {
  return items.map(item => ({
    description: item.name,
    quantity: item.quantity.toString(),
    amount: {
      value: (item.price * 100).toString(),
      currency: 'RUB'
    },
    vat_code: 1
  }));
};

// Дополнительные утилиты
export const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('ru-RU')} ₽`;
};