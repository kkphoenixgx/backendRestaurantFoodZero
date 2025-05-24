import ConnectionFactory from './ConnectionFactory';
import { Connection } from 'mysql2/promise';
import Tag from '../model/Tag';

export default class DaoTag {
  private connection!: Connection;

  public async initConnection() {
    this.connection = await ConnectionFactory.createConnection();
  }

  public async getTag(id: number): Promise<Tag | null> {
    const [rows] = await this.connection.execute(
      `SELECT id, name FROM tags WHERE id = ?`,
      [id]
    );
    const result = (rows as any[])[0];
    if (!result) return null;
    return new Tag(result.id, result.name);
  }

  public async listTags(): Promise<Tag[]> {
    const [rows] = await this.connection.execute(
      `SELECT id, name FROM tags`
    );
    return (rows as any[]).map(row => new Tag(row.id, row.name));
  }

  public async postTag(tag: Tag): Promise<void> {
    await this.connection.execute(
      `INSERT INTO tags (name) VALUES (?)`,
      [tag.name]
    );
  }

  public async updateTag(id: number, newTag: Tag): Promise<void> {
    await this.connection.execute(
      `UPDATE tags SET name = ? WHERE id = ?`,
      [newTag.name, id]
    );
  }

  public async deleteTagById(id: number): Promise<void> {
    await this.connection.execute(
      `DELETE FROM tags WHERE id = ?`,
      [id]
    );
  }
}
