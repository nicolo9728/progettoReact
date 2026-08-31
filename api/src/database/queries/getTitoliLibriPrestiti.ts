import { QueryHandler } from "./queryHandler";
import { QueryExecutor } from "./queryExecutor";
import { UnitOfWork } from "../unitOfWork";
import { Injectable } from "@nestjs/common";

type Parameters = Readonly<{ idUtente: number }>

export type RisultatoPrestito = {
  id: number;
  titolo: string;
};

@Injectable()
export class GetTitoliLibriPrestiti extends QueryHandler<RisultatoPrestito[], Parameters> {

    constructor(private q: QueryExecutor) { super(q) }

    public async query(parametri: Parameters): Promise<RisultatoPrestito[]> {
        return await this.q.query<RisultatoPrestito>(`
            SELECT 
                p.id,
                l.titolo
            FROM prestiti p
            JOIN libri l ON p.id_libro = l.isbn
            WHERE p.id_utente = $1
            ORDER BY p.momento_prestito DESC
        `, [parametri.idUtente]);
    }
}