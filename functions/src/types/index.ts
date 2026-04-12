export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

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

export interface PaymentRequest {
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

export interface YooMoneyPayment {
  id: string;
  status: string;
  amount: {
    value: string;
    currency: string;
  };
  confirmation: {
    type: string;
    confirmation_url: string;
  };
  created_at: string;
  paid: boolean;
}
