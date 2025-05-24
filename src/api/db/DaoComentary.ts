import ConnectionFactory from './ConnectionFactory';
import { Connection } from 'mysql2/promise';
import Comentary from '../model/Comentary';
import User from '../model/User';
import Post from '../model/Post';

export default class DaoComentary {
  private connection!: Connection;

  public async initConnection() {
    this.connection = await ConnectionFactory.createConnection();
  }

  public async getComentary(id: number): Promise<Comentary | null> {
    const [rows] = await this.connection.execute(
      `SELECT id, commented_at, description FROM comments WHERE id = ?`,
      [id]
    );
    const result = (rows as any[])[0];
    if (!result) return null;
    return new Comentary(result.id, new Date(result.commented_at), result.description);
  }

  public async getComentariesFromPost(post: Post): Promise<Comentary[]> {
    const [rows] = await this.connection.execute(
      `SELECT id, commented_at AS date, description FROM comments WHERE post_id = ?`,
      [post.id]
    );
    return (rows as any[]).map(row => new Comentary(row.id, new Date(row.date), row.description));
  }
  
  public async getComentariesFromUser(user: User): Promise<Comentary[]> {
    const [rows] = await this.connection.execute(
      `SELECT id, commented_at AS date, description FROM comments WHERE user_id = ?`,
      [user.id]
    );
    return (rows as any[]).map(row => new Comentary(row.id, new Date(row.date), row.description));
  }
  

  public async listComentaries(): Promise<Comentary[]> {
    const [rows] = await this.connection.execute(
      `SELECT id, commented_at, description FROM comments`
    );
    return (rows as any[]).map(row =>
      new Comentary(row.id, new Date(row.commented_at), row.description)
    );
  }

  public async postComentary(comentary: Comentary): Promise<void> {
    await this.connection.execute(
      `INSERT INTO comments (commented_at, description) VALUES (?, ?)`,
      [comentary.date.toISOString().slice(0, 19).replace('T', ' '), comentary.description]
    );
  }

  public async updateComentary(id: number, newComentary: Comentary): Promise<void> {
    await this.connection.execute(
      `UPDATE comments SET commented_at = ?, description = ? WHERE id = ?`,
      [newComentary.date.toISOString().slice(0, 19).replace('T', ' '), newComentary.description, id]
    );
  }

  public async deleteComentaryById(id: number): Promise<void> {
    await this.connection.execute(
      `DELETE FROM comments WHERE id = ?`,
      [id]
    );
  }
}
