import { GetLibriQuery } from "./getLibriQuery.js";
import { QueryExecutor } from "./queryExecutor.js";

export abstract class QueryHandler<TReturn, TParameters = void>{

    constructor(protected queryExecutor: QueryExecutor){}

    public abstract query(parametri: TParameters) : Promise<TReturn>
}