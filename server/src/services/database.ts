import { MongoClient, Db, Collection } from 'mongodb';
import { Order } from '../types/index.js';

export class Database {
  private static instance: Database;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private ordersCollection: Collection<Order> | null = null;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async init(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI;

      if (!mongoUri) {
        console.error('MONGODB_URI not set, using in-memory storage (data will be lost on restart)');
        return;
      }

      this.client = new MongoClient(mongoUri);
      await this.client.connect();

      this.db = this.client.db('dresscode');
      this.ordersCollection = this.db.collection<Order>('orders');

      // Создаем индексы для быстрого поиска
      await this.ordersCollection.createIndex({ userId: 1 });
      await this.ordersCollection.createIndex({ status: 1 });
      await this.ordersCollection.createIndex({ createdAt: -1 });

      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async createOrder(order: Order): Promise<Order> {
    if (!this.ordersCollection) {
      throw new Error('Database not initialized');
    }

    await this.ordersCollection.insertOne(order as any);
    return order;
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    if (!this.ordersCollection) {
      throw new Error('Database not initialized');
    }

    const order = await this.ordersCollection.findOne({ id: orderId } as any);
    return order || undefined;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    if (!this.ordersCollection) {
      throw new Error('Database not initialized');
    }

    return await this.ordersCollection
      .find({ userId } as any)
      .sort({ createdAt: -1 })
      .toArray();
  }

  async getAllOrders(): Promise<Order[]> {
    if (!this.ordersCollection) {
      throw new Error('Database not initialized');
    }

    return await this.ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
    if (!this.ordersCollection) {
      throw new Error('Database not initialized');
    }

    const result = await this.ordersCollection.findOneAndUpdate(
      { id: orderId } as any,
      {
        $set: {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    if (!this.ordersCollection) {
      throw new Error('Database not initialized');
    }

    const result = await this.ordersCollection.deleteOne({ id: orderId } as any);
    return result.deletedCount > 0;
  }

  async getOrderStats() {
    if (!this.ordersCollection) {
      throw new Error('Database not initialized');
    }

    const total = await this.ordersCollection.countDocuments();
    const paid = await this.ordersCollection.countDocuments({ status: 'paid' } as any);
    const pending = await this.ordersCollection.countDocuments({ status: 'pending' } as any);

    const revenueResult = await this.ordersCollection.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$finalTotal' } } }
    ]).toArray();

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    return { total, paid, pending, totalRevenue };
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('MongoDB connection closed');
    }
  }
}
