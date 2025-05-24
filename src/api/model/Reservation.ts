import User from "./User";

export default class Reservation {
  
  constructor(
    private _id: number,
    private _reservationTime: Date,
    private _personsQuantity: number,
    private _user: User,
  ) {}

  // ----------- Getters and Setters -----------

  public get user(): User {
    return this._user;
  }
  public set user(value: User) {
    this._user = value;
  }

  public get personsQuantity(): number {
    return this._personsQuantity;
  }
  public set personsQuantity(value: number) {
    this._personsQuantity = value;
  }

  public get reservationTime(): Date {
    return this._reservationTime;
  }
  public set reservationTime(value: Date) {
    this._reservationTime = value;
  }

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  

}