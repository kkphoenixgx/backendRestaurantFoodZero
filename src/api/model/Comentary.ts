export default class Comentary {

  constructor(
    private _id: number,
    private _date: Date,
    private _description: string,
    private _post_id: number,
    private _user_id: number
  ) {}

  // ----------- Getters and Setters -----------

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  public get date(): Date {
    return this._date;
  }
  public set date(value: Date) {
    this._date = value;
  }
  public get description(): string {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }
  public get user_id(): number {
    return this._user_id;
  }
  public set user_id(value: number) {
    this._user_id = value;
  }
  public get post_id(): number {
    return this._post_id;
  }
  public set post_id(value: number) {
    this._post_id = value;
  }

}