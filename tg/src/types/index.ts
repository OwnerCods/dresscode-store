// src/types/index.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  // Можно добавить дополнительные поля
  inStock?: boolean;
  discount?: number; // скидка в процентах
}

// Лучше использовать extends для избежания дублирования
export interface CartItem extends Product {
  quantity: number;
  // Можно добавить специфичные для корзины поля
  selectedSize?: string;
  selectedColor?: string;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

// Хелперы для проверки типов
export const isProduct = (item: any): item is Product => {
  return item && 
         typeof item === 'object' && 
         'id' in item && 
         'name' in item &&
         'price' in item;
};

export const isCartItem = (item: any): item is CartItem => {
  return isProduct(item) && 'quantity' in item;
};

// Тип для заказа
export interface Order {
  id: string;
  userId: number;
  userName?: string;
  items: CartItem[];
  total: number;
  deliveryPrice: number;
  finalTotal: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentId?: string;
  paymentStatus?: 'pending' | 'succeeded' | 'failed';
  createdAt: string;
  updatedAt: string;
  deliveryAddress?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

// Тип для ответа API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}