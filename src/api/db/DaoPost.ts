import ConnectionFactory from './ConnectionFactory';
import { Connection } from 'mysql2/promise';
import Post from '../model/Post';

export default class DaoPost {
  private connection!: Connection;

  public async initConnection() {
    this.connection = await ConnectionFactory.createConnection();
  }

  public async getPost(id: number): Promise<Post | null> {
    const [rows] = await this.connection.execute(
      'SELECT id, created_at, description FROM posts WHERE id = ?',
      [id]
    );
    const result = (rows as any[])[0];
    if (!result) return null;
    return new Post(result.id, new Date(result.created_at), result.description);
  }

  public async listPosts(): Promise<Post[]> {
    const [rows] = await this.connection.execute(
      'SELECT id, created_at, description FROM posts'
    );
    return (rows as any[]).map(
      row => new Post(row.id, new Date(row.created_at), row.description)
    );
  }

  public async postPost(post: Post): Promise<void> {
    await this.connection.execute(
      'INSERT INTO posts (created_at, description, user_id) VALUES (?, ?, ?)',
      [post.date.toISOString().slice(0, 19).replace('T', ' '), post.description, 1] // assumindo user_id fixo por enquanto
    );
  }

  public async updatePost(id: number, newPost: Post): Promise<void> {
    await this.connection.execute(
      'UPDATE posts SET created_at = ?, description = ? WHERE id = ?',
      [newPost.date.toISOString().slice(0, 19).replace('T', ' '), newPost.description, id]
    );
  }

  public async deletePostById(id: number): Promise<void> {
    await this.connection.execute(
      'DELETE FROM posts WHERE id = ?',
      [id]
    );
  }
}