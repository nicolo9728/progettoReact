import { Injectable } from "@nestjs/common";
import { QueryHandler } from "./queryHandler";
import { UtenteLoggatoViewModel, UtenteTrovatoViewModel } from "@biblioteca/common";
import { QueryExecutor } from "./queryExecutor";

type Parameter = {
    username: string
}

@Injectable()
export class GetUtentiByUsername extends QueryHandler<UtenteTrovatoViewModel[], Parameter>{

    constructor(q: QueryExecutor){super(q)}

    public query(parametri: Parameter): Promise<UtenteTrovatoViewModel[]> {
        return this.queryExecutor
            .query<UtenteTrovatoViewModel>("SELECT id, username FROM utenti WHERE username ILIKE $1 and ruolo='Cliente'", [parametri.username + "%"])
    }
}