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
      `SELECT id, commented_at, description, post_id, user_id  FROM comments WHERE id = ?`,
      [id]
    );
    const result = (rows as any[])[0];

    if (!result) return null;
    return new Comentary(
      result.id, 
      new Date(result.commented_at), 
      result.description, 
      result.post_id, 
      result.user_id
    );
  }

  public async getComentariesFromPost(post: Post): Promise<Comentary[]> {
    const [rows] = await this.connection.execute(
      `SELECT id, commented_at AS date, description, user_id FROM comments WHERE post_id = ?`,
      [post.id]
    );
    return (rows as any[]).map(row => 
      new Comentary(row.id, new Date(row.date), row.description, post.id, row.user_id)
    );
  }
  
  public async getComentariesFromUser(user: User): Promise<Comentary[]> {
    const [rows] = await this.connection.execute(
      `SELECT id, commented_at AS date, description, post_id FROM comments WHERE user_id = ?`,
      [user.id]
    );
    return (rows as any[]).map(row => new Comentary(row.id, new Date(row.date), row.description, row.post_id, user.id));
  }

  public async listComentaries(): Promise<Comentary[]> {
    const [rows] = await this.connection.execute(
      `SELECT id, commented_at, description, post_id, user_id FROM comments`
    );
    return (rows as any[]).map(row =>
      new Comentary(row.id, new Date(row.commented_at), row.description, row.post_id, row.user_id)
    );
  }

  
  public async postComentary(comentary: Comentary): Promise<void> {
    await this.connection.execute(
      `INSERT INTO comments (commented_at, description, post_id, user_id) VALUES (?, ?, ?, ?)`,
      [
        comentary.date.toISOString().slice(0, 19).replace('T', ' '),
        comentary.description,
        comentary.post_id,
        comentary.user_id
      ]
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
