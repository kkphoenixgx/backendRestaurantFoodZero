export default class Plate {

  constructor(
    private _id: number,
    private _name: string,
    private _value: number,
    private _description: string,
    private _imagePath: string,
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
  public get value(): number {
    return this._value;
  }
  public set value(value: number) {
    this._value = value;
  }
  public get description(): string {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }
  public get imagePath(): string {
    return this._imagePath;
  }
  public set imagePath(value: string) {
    this._imagePath = value;
  }

}