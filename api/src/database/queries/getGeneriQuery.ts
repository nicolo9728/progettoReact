import { GenereViewModel } from "@biblioteca/common";
import { QueryHandler } from "./queryHandler";
import { QueryExecutor } from "./queryExecutor";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetGeneriQuery extends QueryHandler<GenereViewModel[]> {

    constructor(q: QueryExecutor) { super(q) }

    public query(parametri: void): Promise<GenereViewModel[]> {
        return this.queryExecutor.query<GenereViewModel>("SELECT DISTINCT genere as nome FROM libri", [])
    }

}