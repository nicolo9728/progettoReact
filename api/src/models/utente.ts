import bcrypt from "bcrypt"

export abstract class Utente {

    constructor(
        public readonly id: number,
        public readonly username: string,
        public readonly password: string) { }
    
    
    public comparePassword(password: string): boolean{
        return bcrypt.compareSync(password, this.password)
    }
}


export class Admin extends Utente{}

export class Cliente extends Utente{
    public static creaCliente(username: string, password: string){
        return new Cliente(-1, username, bcrypt.hashSync(password, bcrypt.genSaltSync()))
    }
}