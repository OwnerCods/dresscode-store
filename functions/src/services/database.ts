import * as admin from 'firebase-admin';
import { Order } from '../types/index';

// Инициализация Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const ordersCollection = db.collection('orders');

export class Database {
  private static instance: Database;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async init(): Promise<void> {
    console.log('Database initialized with Firestore');
  }

  async createOrder(order: Order): Promise<Order> {
    await ordersCollection.doc(order.id).set(order);
    return order;
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    const doc = await ordersCollection.doc(orderId).get();
    return doc.exists ? (doc.data() as Order) : undefined;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    const snapshot = await ordersCollection.where('userId', '==', userId).get();
    return snapshot.docs.map(doc => doc.data() as Order);
  }

  async getAllOrders(): Promise<Order[]> {
    const snapshot = await ordersCollection.get();
    return snapshot.docs.map(doc => doc.data() as Order);
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
    const docRef = ordersCollection.doc(orderId);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    const updatedOrder = {
      ...doc.data() as Order,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await docRef.update(updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      await ordersCollection.doc(orderId).delete();
      return true;
    } catch (error) {
      console.error('Delete order error:', error);
      return false;
    }
  }

  async getOrderStats() {
    const orders = await this.getAllOrders();
    const total = orders.length;
    const paid = orders.filter(o => o.status === 'paid').length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const totalRevenue = orders
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + o.finalTotal, 0);

    return { total, paid, pending, totalRevenue };
  }
}
