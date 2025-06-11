import ConnectionFactory from './ConnectionFactory';
import { Connection } from 'mysql2/promise';

export default class DaoPlateCategory {
  private connection!: Connection;

  public async initConnection() {
    this.connection = await ConnectionFactory.createConnection();
  }
  public async initConnectionWithConnection(connection: Connection) {
    this.connection = connection;
  }

  public async associate(plateId: number, categoryId: number): Promise<void> {
    await this.connection.execute(
      'INSERT INTO plate_category (plate_id, category_id) VALUES (?, ?)',
      [plateId, categoryId]
    );
  }

  public async removeAssociation(plateId: number, categoryId: number): Promise<void> {
    await this.connection.execute(
      'DELETE FROM plate_category WHERE plate_id = ? AND category_id = ?',
      [plateId, categoryId]
    );
  }

  public async getCategoriesByPlate(plateId: number): Promise<number[]> {
    const [rows] = await this.connection.execute(
      'SELECT category_id FROM plate_category WHERE plate_id = ?',
      [plateId]
    );
    return (rows as any[]).map(row => row.category_id);
  }

  public async getPlatesByCategory(categoryId: number): Promise<number[]> {
    const [rows] = await this.connection.execute(
      'SELECT plate_id FROM plate_category WHERE category_id = ?',
      [categoryId]
    );
    return (rows as any[]).map(row => row.plate_id);
  }
}