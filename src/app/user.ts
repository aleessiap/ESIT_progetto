export class User {

  constructor(
    public id: number,
    public numcell : number,
    public admin: boolean,
    public password: string,
    public name: string,
    public surname: string,
    public email: string,
    public birthdate: string
  ) {  }

}
