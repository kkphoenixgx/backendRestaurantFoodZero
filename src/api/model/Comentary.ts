export default class Comentary {
 

  constructor(
    private _id: number,
    private _date: Date,
    private _description: string,
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

}