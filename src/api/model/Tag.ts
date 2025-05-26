export default class Tag {

  constructor(
    private _name: string,
    private _id: number = 0,
  ) {}

  // ----------- Getters and Setters -----------

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

}