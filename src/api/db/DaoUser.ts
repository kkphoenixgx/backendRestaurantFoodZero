import ConnectionFactory from "./ConnectionFactory";
import { Connection } from "mysql2/promise";

import User from "../model/User";
import { IAuthenticationResponse } from "../../interfaces/IAuthenticationResponse";

export default class DaoUser {

  private connection!: Connection;

  public async initConnection() {
    this.connection = await ConnectionFactory.createConnection();
  }

  public async getUser(id: number): Promise<User | null> {
    const [rows]: any = await this.connection.execute(`
      SELECT * FROM users WHERE id = ?
    `, [id]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return new User(
      row.id,
      row.name,
      row.email,
      row.password,
      row.user_image,
      row.phone,
      row.role,
    );
  }

  public async getUserHashAndId(email: string): Promise<IAuthenticationResponse> {
    const [rows]: any = await this.connection.execute(
      "SELECT password, id FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) throw new Error("Usuário não encontrado");

    return {
      hash: rows[0].password,
      id: rows[0].id
    };
  }

  public async listUsers(): Promise<User[]> {
    const [rows]: any = await this.connection.execute(`
      SELECT * FROM users
    `);

    return rows.map((row: any) =>
      new User(
        row.id,
        row.name,
        row.email,
        row.password,
        row.user_image,
        row.phone,
        row.role,
      ),
    );
  }

  public async postUser(user: User): Promise<void> {
    await this.connection.execute(`
      INSERT INTO users (name, email, password, user_image, phone, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      user.name,
      user.email,
      user.senha,
      user.userImagePath,
      user.phone,
      user.role,
    ]);
  }

  public async updateUser(id: number, newUser: User): Promise<void> {
    await this.connection.execute(`
      UPDATE users
      SET name = ?, email = ?, password = ?, user_image = ?, phone = ?, role = ?
      WHERE id = ?
    `, [
      newUser.name,
      newUser.email,
      newUser.senha,
      newUser.userImagePath,
      newUser.phone,
      newUser.role,
      id,
    ]);
  }

  public async deleteUserById(id: number): Promise<void> {
    await this.connection.execute(`
      DELETE FROM users WHERE id = ?
    `, [id]);
  }
}