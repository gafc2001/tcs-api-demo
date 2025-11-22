import bcrypt from "bcrypt";
export class UserEntity {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _email: string,
    private _password: string,
  ) {}


  encryptPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  getId(): string {
    return this._id;
  }

  getName(): string {
    return this._name;
  }

  getEmail(): string {
    return this._email;
  }

  getPassword(): string {
    return this._password;
  }
}
