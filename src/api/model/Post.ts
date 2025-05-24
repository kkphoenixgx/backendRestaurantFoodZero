export default class Post {
 
  constructor(
    private _id: number,
    private _date: Date,
    private _description: string,
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

}