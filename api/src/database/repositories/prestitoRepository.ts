import { Injectable } from '@nestjs/common';
import type { Pool, PoolClient } from 'pg';
import { Prestito, PrestitoStatus } from '../../models/prestito';

@Injectable()
export class PrestitoRepository {
    constructor(private client: PoolClient | Pool) {}

    private buildPrestitoFromRow(row: any): Prestito {
        let status: PrestitoStatus;

        if (row["stato"] === "Restituito") {
            status = {
                tipo: "Restituito",
                momentoRestituzione: new Date(row["momento_restituzione"])
            };
        } else {
            status = { tipo: "Non restituito" };
        }

        return new (Prestito as any)(
            row["id"],
            row["id_utente"],
            row["id_libro"],
            new Date(row["momento_prestito"]),
            new Date(row["momento_limite"]),
            status
        );
    }

    public async getPrestitoById(id: number): Promise<Prestito | null> {
        const res = await this.client.query(
            "SELECT * FROM prestiti WHERE id = $1", 
            [id]
        );

        if (res.rows.length === 0) return null;

        return this.buildPrestitoFromRow(res.rows[0]);
    }

    public async hasActivePrestito(idUtente: number): Promise<boolean>{
        const ris = await this.client.query("SELECT 1 FROM Prestiti WHERE id_utente=$1 and stato='Non restituito'", [idUtente])

        return ris.rowCount! > 0
    }

    public async getPrestitiUtente(idUtente: number): Promise<Prestito[]>{
        return (await this.client.query("SELECT * FROM prestiti WHERE id_utente = $1", [idUtente])).rows.map(this.buildPrestitoFromRow)
    }

    public async save(prestito: Prestito): Promise<void> {
        const momentoRestituzione = prestito.status.tipo === "Restituito" 
            ? prestito.status.momentoRestituzione 
            : null;

        // Nuova inserzione per entità con ID temporaneo (-1)
        if (prestito.id === -1) {
            const queryInsert = `
                INSERT INTO prestiti (id_utente, id_libro, momento_prestito, momento_limite, stato, momento_restituzione)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id;
            `;
            const valuesInsert = [
                prestito.idUtente,
                prestito.idLibro,
                prestito.momentoPrestito,
                prestito.momentoLimite,
                prestito.status.tipo,
                momentoRestituzione
            ];

            const res = await this.client.query(queryInsert, valuesInsert);
            
            Object.assign(prestito, { id: res.rows[0].id });
            return;
        }

        const queryUpsert = `
            INSERT INTO prestiti (id, id_utente, id_libro, momento_prestito, momento_limite, stato, momento_restituzione)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) 
            DO UPDATE SET 
                id_utente = EXCLUDED.id_utente,
                id_libro = EXCLUDED.id_libro,
                momento_prestito = EXCLUDED.momento_prestito,
                momento_limite = EXCLUDED.momento_limite,
                stato = EXCLUDED.stato,
                momento_restituzione = EXCLUDED.momento_restituzione;
        `;

        const valuesUpsert = [
            prestito.id,
            prestito.idUtente,
            prestito.idLibro,
            prestito.momentoPrestito,
            prestito.momentoLimite,
            prestito.status.tipo,
            momentoRestituzione
        ];

        await this.client.query(queryUpsert, valuesUpsert);
    }
}