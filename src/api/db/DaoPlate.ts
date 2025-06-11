import ConnectionFactory from './ConnectionFactory';
import { Connection } from 'mysql2/promise';
import Plate from '../model/Plate';

import DaoCategory from './DaoCategory';
import DaoPlateCategory from './DaoPlateCategory';

export default class DaoPlate {
  private connection!: Connection;
  private daoCategory = new DaoCategory();
  private daoPlateCategory = new DaoPlateCategory();

  public async initConnection() {
    this.connection = await ConnectionFactory.createConnection();
    await this.daoCategory.initConnectionWithConnection(this.connection);
    await this.daoPlateCategory.initConnectionWithConnection(this.connection);

  }
  public async initConnectionWithConnection(connection: Connection) {
    this.connection = connection;
  }

  public async getPlate(id: number): Promise<Plate | null> {
    const [rows] = await this.connection.execute(
      'SELECT id, name, price, description, image_path FROM plates WHERE id = ?',
      [id]
    );
    const result = (rows as any[])[0];
    if (!result) return null;
    return new Plate(result.id, result.name, result.price, result.description, result.image_path);
  }

  public async listPlates(): Promise<Plate[]> {
    const [rows] = await this.connection.execute(
      'SELECT id, name, price, description, image_path FROM plates'
    );
    return (rows as any[]).map(row => 
      new Plate(row.id, row.name, row.price, row.description, row.image_path)
    );
  }

  public async postPlate(plate: Plate, categoryIds: number[]): Promise<number> {
    await this.connection.beginTransaction();

    try {
      const [result] = await this.connection.execute(
        'INSERT INTO plates (name, price, description, image_path) VALUES (?, ?, ?, ?)',
        [plate.name, plate.value, plate.description, plate.imagePath]
      );
      const plateId = (result as any).insertId;

      for (const categoryId of categoryIds) {

        const [catRows] = await this.connection.execute(
          'SELECT id FROM categories WHERE id = ?',
          [categoryId]
        );
        if ((catRows as any[]).length === 0) {
          throw new Error(`Categoria com id ${categoryId} não existe`);
        }
        await this.daoPlateCategory.associate(plateId, categoryId);
      }

      await this.connection.commit();
      return plateId;

    } catch (error) {

      await this.connection.rollback();
      throw error;
    }
  }

  public async updatePlate(id: number, newPlate: Plate): Promise<void> {
    await this.connection.execute(
      'UPDATE plates SET name = ?, price = ?, description = ?, image_path = ? WHERE id = ?',
      [newPlate.name, newPlate.value, newPlate.description, newPlate.imagePath, id]
    );
  }

  public async deletePlateById(id: number): Promise<void> {
    await this.connection.execute(
      'DELETE FROM plates WHERE id = ?',
      [id]
    );
  }
}