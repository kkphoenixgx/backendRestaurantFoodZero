import ConnectionFactory from './ConnectionFactory';
import { Connection } from 'mysql2/promise';
import Plate from '../model/Plate';

export default class DaoPlate {
  private connection!: Connection;

  public async initConnection() {
    this.connection = await ConnectionFactory.createConnection();
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

  public async postPlate(plate: Plate): Promise<void> {
    await this.connection.execute(
      'INSERT INTO plates (name, price, description, image_path) VALUES (?, ?, ?, ?)',
      [plate.name, plate.value, plate.description, plate.imagePath]
    );
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