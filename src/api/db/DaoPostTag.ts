import { Connection } from 'mysql2/promise';
import ConnectionFactory from './ConnectionFactory';

export default class DaoPostTag {
  private connection!: Connection;

  public async initConnection() {
    this.connection = await ConnectionFactory.createConnection();
  }

  public async linkPostToTag(postId: number, tagId: number): Promise<void> {
    await this.connection.execute(
      `INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)`,
      [postId, tagId]
    );
  }

  public async getTagsForPost(postId: number): Promise<number[]> {
    const [rows] = await this.connection.execute(
      `SELECT tag_id FROM post_tags WHERE post_id = ?`,
      [postId]
    );
    return (rows as any[]).map(row => row.tag_id);
  }

  public async deleteTagsForPost(postId: number): Promise<void> {
    await this.connection.execute(
      `DELETE FROM post_tags WHERE post_id = ?`,
      [postId]
    );
  }
}