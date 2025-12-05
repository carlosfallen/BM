import type { D1Database } from '@cloudflare/workers-types';
import type { Product, Category, Order, OrderItem, ProductWithCategory } from '../types';

export class Database {
  constructor(private db: D1Database) {}

  // Categories
  async getCategories(activeOnly = true): Promise<Category[]> {
    const query = activeOnly
      ? 'SELECT * FROM categories WHERE active = 1 ORDER BY name'
      : 'SELECT * FROM categories ORDER BY name';

    const { results } = await this.db.prepare(query).all();
    return results as Category[];
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { results } = await this.db
      .prepare('SELECT * FROM categories WHERE slug = ? AND active = 1')
      .bind(slug)
      .all();

    return results[0] as Category || null;
  }

  // Products
  async getProducts(options: {
    categoryId?: number;
    featured?: boolean;
    limit?: number;
    offset?: number;
    activeOnly?: boolean;
  } = {}): Promise<ProductWithCategory[]> {
    const { categoryId, featured, limit = 50, offset = 0, activeOnly = true } = options;

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;

    const bindings: any[] = [];

    if (activeOnly) {
      query += ' AND p.active = 1 AND c.active = 1';
    }

    if (categoryId) {
      query += ' AND p.category_id = ?';
      bindings.push(categoryId);
    }

    if (featured) {
      query += ' AND p.featured = 1';
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    bindings.push(limit, offset);

    const { results } = await this.db.prepare(query).bind(...bindings).all();
    return results as ProductWithCategory[];
  }

  async getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
    const { results } = await this.db
      .prepare(`
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.slug = ? AND p.active = 1
      `)
      .bind(slug)
      .all();

    if (results[0]) {
      // Increment views
      await this.db
        .prepare('UPDATE products SET views = views + 1 WHERE id = ?')
        .bind(results[0].id)
        .run();
    }

    return results[0] as ProductWithCategory || null;
  }

  async getFeaturedProducts(limit = 6): Promise<ProductWithCategory[]> {
    return this.getProducts({ featured: true, limit });
  }

  async searchProducts(query: string): Promise<ProductWithCategory[]> {
    const searchTerm = `%${query}%`;
    const { results } = await this.db
      .prepare(`
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE (p.name LIKE ? OR p.code LIKE ? OR p.description LIKE ?)
          AND p.active = 1 AND c.active = 1
        ORDER BY p.name
        LIMIT 50
      `)
      .bind(searchTerm, searchTerm, searchTerm)
      .all();

    return results as ProductWithCategory[];
  }

  // Orders
  async createOrder(orderData: {
    customer_name: string;
    customer_email?: string;
    customer_phone: string;
    customer_address?: string;
    customer_city?: string;
    customer_state?: string;
    customer_zip?: string;
    items: Array<{ product_id: number; quantity: number; price: number; product_name: string; product_code?: string }>;
    total: number;
    notes?: string;
  }): Promise<string> {
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Insert order
    const orderResult = await this.db
      .prepare(`
        INSERT INTO orders (
          order_number, customer_name, customer_email, customer_phone,
          customer_address, customer_city, customer_state, customer_zip,
          items, total, notes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        orderNumber,
        orderData.customer_name,
        orderData.customer_email || null,
        orderData.customer_phone,
        orderData.customer_address || null,
        orderData.customer_city || null,
        orderData.customer_state || null,
        orderData.customer_zip || null,
        JSON.stringify(orderData.items),
        orderData.total,
        orderData.notes || null,
        'pending'
      )
      .run();

    const orderId = orderResult.meta.last_row_id;

    // Insert order items
    for (const item of orderData.items) {
      await this.db
        .prepare(`
          INSERT INTO order_items (
            order_id, product_id, product_name, product_code,
            quantity, price, subtotal
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          orderId,
          item.product_id,
          item.product_name,
          item.product_code || null,
          item.quantity,
          item.price,
          item.quantity * item.price
        )
        .run();
    }

    return orderNumber;
  }

  async getOrders(limit = 50, offset = 0): Promise<Order[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .bind(limit, offset)
      .all();

    return results as Order[];
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const { results } = await this.db
      .prepare('SELECT * FROM orders WHERE order_number = ?')
      .bind(orderNumber)
      .all();

    return results[0] as Order || null;
  }

  async updateOrderStatus(orderId: number, status: string): Promise<void> {
    await this.db
      .prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(status, orderId)
      .run();
  }

  // Settings
  async getSetting(key: string): Promise<string | null> {
    const { results } = await this.db
      .prepare('SELECT value FROM settings WHERE key = ?')
      .bind(key)
      .all();

    return results[0]?.value || null;
  }
}
