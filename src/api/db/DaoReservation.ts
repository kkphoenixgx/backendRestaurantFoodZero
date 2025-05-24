/* eslint-disable @typescript-eslint/comma-dangle */
import { Connection } from "mysql2/promise";
import ConnectionFactory from "./ConnectionFactory";

import Reservation from "../model/Reservation";
import User from "../model/User";

export default class DaoReservation {

  private connection!: Connection;

  public async initConnection() {
    this.connection = await ConnectionFactory.createConnection();
  }

  private buildReservation(row: any): Reservation {
    const user = new User(
      row.user_id,
      row.user_name,
      row.user_email,
      row.user_password,
      row.user_image,
      row.user_phone,
      row.user_role
    );

    return new Reservation(
      row.id,
      new Date(row.reservation_datetime),
      row.persons,
      user
    );
  }

  public async getReservation(id: number): Promise<Reservation | null> {
    const [rows] = await this.connection.execute(
      `SELECT r.*, 
              u.name AS user_name, u.email AS user_email, u.password AS user_password, 
              u.user_image AS user_image, u.phone AS user_phone, u.role AS user_role 
       FROM reservations r
       JOIN users u ON u.id = r.user_id
       WHERE r.id = ?`,
      [id]
    );
    const result = (rows as any[])[0];
    return result ? this.buildReservation(result) : null;
  }

  public async listReservations(): Promise<Reservation[]> {
    const [rows] = await this.connection.execute(
      `SELECT r.*, 
              u.name AS user_name, u.email AS user_email, u.password AS user_password, 
              u.user_image AS user_image, u.phone AS user_phone, u.role AS user_role 
       FROM reservations r
       JOIN users u ON u.id = r.user_id`
    );
    return (rows as any[]).map(row => this.buildReservation(row));
  }

  public async postReservation(reservation: Reservation): Promise<void> {
    await this.connection.execute(
      `INSERT INTO reservations (reservation_datetime, persons, user_id)
       VALUES (?, ?, ?)`,
      [
        reservation.reservationTime.toISOString().slice(0, 19).replace('T', ' '),
        reservation.personsQuantity,
        reservation.user.id
      ]
    );
  }

  public async updateReservation(id: number, reservation: Reservation): Promise<void> {
    await this.connection.execute(
      `UPDATE reservations 
       SET reservation_datetime = ?, persons = ?, user_id = ? 
       WHERE id = ?`,
      [
        reservation.reservationTime.toISOString().slice(0, 19).replace('T', ' '),
        reservation.personsQuantity,
        reservation.user.id,
        id
      ]
    );
  }

  public async deleteReservationById(id: number): Promise<void> {
    await this.connection.execute(`DELETE FROM reservations WHERE id = ?`, [id]);
  }

  public async deleteReservation(reservation: Reservation): Promise<void> {
    await this.deleteReservationById(reservation.id);
  }
}