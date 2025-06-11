import Comentary from "./Comentary";
import Tag from "./Tag";
import User from "./User";

export default class Post {

  constructor(
    private _id: number,
    private _date: Date,
    private _description: string,
    private _tittle: string,
    private _user: User,
    private _tags: Tag[],
    private _comentaries: Comentary[] = [],
  ) {}

  // ----------- Getters and Setters -----------

  public get description(): string {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }
  public get date(): Date {
    return this._date;
  }
  public set date(value: Date) {
    this._date = value;
  }
  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }

  public get comentaries(): Comentary[] {
    return this._comentaries;
  }
  public set comentaries(value: Comentary[]) {
    this._comentaries = value;
  }

  public get tags(): Tag[] {
    return this._tags;
  }
  public set tags(value: Tag[]) {
    this._tags = value;
  }
  
  public get user(): User {
    return this._user;
  }
  public set user(value: User) {
    this._user = value;
  }
  public get tittle(): string {
    return this._tittle;
  }
  public set tittle(value: string) {
    this._tittle = value;
  }
  

}