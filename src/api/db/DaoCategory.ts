import ConnectionFactory from './ConnectionFactory';
import { Connection } from 'mysql2/promise';
import Category from '../model/Category';

export default class DaoCategory {
  private connection!: Connection;

  public async initConnection() {
    this.connection = await ConnectionFactory.createConnection();
  }
  public async initConnectionWithConnection(connection: Connection) {
    this.connection = connection;
  }

  public async getCategory(id: number): Promise<Category | null> {
    const [rows] = await this.connection.execute(
      `SELECT id, name FROM categories WHERE id = ?`,
      [id]
    );
    const result = (rows as any[])[0];
    if (!result) return null;
    return new Category(result.id, result.name);
  }

  public async listCategories(): Promise<Category[]> {
    const [rows] = await this.connection.execute(
      `SELECT id, name FROM categories`
    );
    return (rows as any[]).map(row => new Category(row.id, row.name));
  }

  public async postCategory(category: Category): Promise<void> {
    await this.connection.execute(
      `INSERT INTO categories (name) VALUES (?)`,
      [category.name]
    );
  }

  public async updateCategory(id: number, newCategory: Category): Promise<void> {
    await this.connection.execute(
      `UPDATE categories SET name = ? WHERE id = ?`,
      [newCategory.name, id]
    );
  }

  public async deleteCategoryById(id: number): Promise<void> {
    await this.connection.execute(
      `DELETE FROM categories WHERE id = ?`,
      [id]
    );
  }
}
