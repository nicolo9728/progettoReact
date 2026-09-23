import { Pool } from 'pg';
import { Inject, Injectable } from '@nestjs/common';
import { RisultatoPaginatoViewModel } from '@biblioteca/common';



@Injectable()
export class QueryExecutor {
    constructor(@Inject("DATABASE_POOL") private pool: Pool) { }

    async query<T>(sql: string, params: any[] = []): Promise<T[]> {
        const result = await this.pool.query<any>(sql, params);
        return result.rows as T[];
    }

    async queryOne<T>(sql: string, params: any[] = []): Promise<T | null> {
        const rows = await this.query<T>(sql, params);
        return rows[0] || null;
    }

    async queryPaginated<T>(
        baseSql: string,
        params: any[] = [],
        paginaCorrente: number = 1,
        pageSize: number = 10
    ): Promise<RisultatoPaginatoViewModel<T>> {
        const page = Math.max(1, paginaCorrente);
        const limit = Math.max(1, pageSize);
        const offset = (page - 1) * limit;

        // 1. Query per contare i record totali
        const countSql = `SELECT COUNT(*)::int AS total FROM (${baseSql}) AS count_query`;

        // 2. Query con LIMIT e OFFSET
        const limitParamIndex = params.length + 1;
        const offsetParamIndex = params.length + 2;
        const paginatedSql = `${baseSql} LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`;

        // 3. Esecuzione in parallelo
        const [countResult, dataResult] = await Promise.all([
            this.pool.query<{ total: number }>(countSql, params),
            this.pool.query<any>(paginatedSql, [...params, limit, offset])
        ]);

        const totaleElementi = countResult.rows[0]?.total || 0;
        const totalePagine = Math.ceil(totaleElementi / limit);

        return {
            elementi: dataResult.rows as T[],
            paginaCorrente: page,
            totalePagine,
        };
    }
}