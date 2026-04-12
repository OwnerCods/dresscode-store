import fs from 'fs/promises';
import path from 'path';
import { Order } from '../types/index.js';

const DATA_DIR = process.env.DATA_DIR || './data';
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

export class Database {
  private static instance: Database;
  private orders: Order[] = [];

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async init(): Promise<void> {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await this.loadOrders();
    } catch (error) {
      console.error('Database init error:', error);
    }
  }

  private async loadOrders(): Promise<void> {
    try {
      const data = await fs.readFile(ORDERS_FILE, 'utf-8');
      this.orders = JSON.parse(data);
    } catch (error) {
      this.orders = [];
      await this.saveOrders();
    }
  }

  private async saveOrders(): Promise<void> {
    await fs.writeFile(ORDERS_FILE, JSON.stringify(this.orders, null, 2));
  }

  async createOrder(order: Order): Promise<Order> {
    this.orders.push(order);
    await this.saveOrders();
    return order;
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    return this.orders.find(o => o.id === orderId);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return this.orders.filter(o => o.userId === userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return [...this.orders];
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    this.orders[index] = {
      ...this.orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.saveOrders();
    return this.orders[index];
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    const initialLength = this.orders.length;
    this.orders = this.orders.filter(o => o.id !== orderId);

    if (this.orders.length < initialLength) {
      await this.saveOrders();
      return true;
    }
    return false;
  }

  async getOrderStats() {
    const total = this.orders.length;
    const paid = this.orders.filter(o => o.status === 'paid').length;
    const pending = this.orders.filter(o => o.status === 'pending').length;
    const totalRevenue = this.orders
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + o.finalTotal, 0);

    return { total, paid, pending, totalRevenue };
  }
}
