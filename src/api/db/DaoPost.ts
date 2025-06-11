import { Connection } from 'mysql2/promise';
import ConnectionFactory from './ConnectionFactory';
import Post from '../model/Post';
import User from '../model/User';
import Tag from '../model/Tag';
import DaoTag from './DaoTag';
import DaoPostTag from './DaoPostTag';

export default class DaoPost {
  private connection!: Connection;
  private daoTag = new DaoTag();
  private daoPostTag = new DaoPostTag();

  public async initConnection() {
    this.connection = await ConnectionFactory.createConnection();
    await this.daoTag.initConnection();
    await this.daoPostTag.initConnection();
  }

  public async getPost(id: number): Promise<Post | null> {
    const [rows] = await this.connection.execute(
      `SELECT p.id, p.created_at, p.description, p.tittle,
              u.id as user_id, u.name, u.email, u.password, u.user_image, u.phone, u.role
         FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
        WHERE p.id = ?`,
      [id]
    );

    const result = (rows as any[])[0];
    if (!result) return null;

    const user = new User(
      result.user_id,
      result.name,
      result.email,
      result.password,
      result.user_image,
      result.phone,
      result.role
    );

    const tagIds = await this.daoPostTag.getTagsForPost(id);
    const tags = await Promise.all(
      tagIds.map(tagId => this.daoTag.getTag(tagId))
    ).then(t => t.filter(tag => tag !== null) as Tag[]);

    return new Post(result.id, new Date(result.created_at), result.description, result.tittle, user, tags);
  }

  public async listPosts(): Promise<Post[]> {

    const [rows] = await this.connection.execute(
      `SELECT p.id, p.created_at, p.description, p.tittle,
              u.id as user_id, u.name, u.email, u.password, u.user_image, u.phone, u.role
         FROM posts p
    LEFT JOIN users u ON p.user_id = u.id`
    );

    const results = rows as any[];
    const posts: Post[] = [];

    for (const row of results) {
      const user = new User(
        row.user_id,
        row.name,
        row.email,
        row.password,
        row.user_image,
        row.phone,
        row.role
      );

      const tagIds = await this.daoPostTag.getTagsForPost(row.id);
      const tags = await Promise.all(
        tagIds.map(tagId => this.daoTag.getTag(tagId))
      ).then(t => t.filter(tag => tag !== null) as Tag[]);

      posts.push(
        new Post(row.id, new Date(row.created_at), row.description, row.tittle, user, tags)
      );
    }

    return posts;
  }

  
  public async postPost(post: Post): Promise<number> {
    await this.connection.beginTransaction();

    try {
      const formattedDate = post.date.toISOString().slice(0, 19).replace('T', ' ');

      const [result] = await this.connection.execute(
        `INSERT INTO posts (created_at, description, tittle, user_id) VALUES (?, ?, ?, ?)`,
        [formattedDate, post.description, post.tittle, post.user.id]
      );

      const postId = (result as any).insertId;

      for (let tagData of post.tags) {
        let tag = await this.daoTag.getTagByName(tagData.name);
  
        if (!tag) {
          let tagId = await this.daoTag.postTag(new Tag(tagData.name, 0));
          await this.daoPostTag.linkPostToTag(postId, tagId);
        
        } else {
          await this.daoPostTag.linkPostToTag(postId, tag.id);
        }
      
      }
  
      await this.connection.commit();
      return postId;
  
    } catch (error) {
      await this.connection.rollback();
      throw error;
    }
    
  }
  


  public async updatePost(id: number, newPost: Post): Promise<void> {
    await this.connection.execute(
      `UPDATE posts SET description = ?, tittle = ? WHERE id = ?`,
      [newPost.description, newPost.tittle, id]
    );

    await this.daoPostTag.deleteTagsForPost(id);
    for (const tag of newPost.tags) {
      await this.daoPostTag.linkPostToTag(id, tag.id);
    }
  }

  public async deletePostById(id: number): Promise<void> {
    await this.daoPostTag.deleteTagsForPost(id);
    await this.connection.execute(
      `DELETE FROM posts WHERE id = ?`,
      [id]
    );
  }
}