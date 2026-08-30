import { LibroDettailsViewModel } from "common";
import { QueryHandler } from "./queryHandler";
import { Injectable } from "@nestjs/common";
import { QueryExecutor } from "./queryExecutor";

type Parameters = Readonly<{
    isbn: string
}>

@Injectable()
export class GetLibroByIsbnQuery extends QueryHandler<LibroDettailsViewModel | null, Parameters>{

    constructor(private q: QueryExecutor) { super(q) }

    public query(parametri: Parameters): Promise<LibroDettailsViewModel | null> {
        return this.queryExecutor.queryOne(`
            SELECT 
                isbn, titolo, immagine, trama, quantita_disponibile as "quantitaDisponibile"
            FROM libri
            WHERE isbn=$1`, [parametri.isbn])
    }
    
}