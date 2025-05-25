export default class User {

  // ----------- Constructor -----------
  
  constructor(
    private _id: number,
    private _name: string,
    private _email: string,
    private _senha: string,
    private _userImagePath: string | null,
    private _phone: string,
    private _role: string,    
  ) { }

  // ----------- Getters and Setters -----------

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }

  public get role(): string {
    return this._role;
  }
  public set role(value: string) {
    this._role = value;
  }

  public get phone(): string {
    return this._phone;
  }
  public set phone(value: string) {
    this._phone = value;
  }

  public get userImagePath(): string | null {
    return this._userImagePath;
  }
  public set userImagePath(value: string) {
    this._userImagePath = value;
  }

  public get senha(): string {
    return this._senha;
  }
  public set senha(value: string) {
    this._senha = value;
  }

  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
}