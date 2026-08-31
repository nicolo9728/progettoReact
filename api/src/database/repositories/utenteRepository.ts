import { Injectable } from "@nestjs/common";
import type { Pool, PoolClient } from "pg";
import { Admin, Cliente, Utente } from "../../models/utente";

@Injectable()
export class UtenteRepository {
    constructor(private client: PoolClient | Pool) { }

    public async getUtenteByUsername(username: string): Promise<Utente | null> {
        const query = `
            SELECT id, username, password, ruolo 
            FROM utenti 
            WHERE username = $1
        `;

        const result = await this.client.query(query, [username]);

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];

        if (row.ruolo === 'Admin') {
            return new Admin(row.id, row.username, row.password);
        } else {
            return new Cliente(row.id, row.username, row.password);
        }
    }

    public async checkUsernameUnique(username: string){
        const ris = await this.client.query("SELECT 1 FROM utenti WHERE username=$1", [username])

        return ris.rowCount! == 0
    }

    public async save(utente: Utente) {
        const ruolo = utente instanceof Admin ? 'Admin' : 'Cliente';

        if (utente.id === -1) {
            const insertQuery = `
                INSERT INTO utenti (username, password, ruolo)
                VALUES ($1, $2, $3)
                RETURNING id
            `;

            const result = await this.client.query(insertQuery, [
                utente.username,
                utente.password,
                ruolo
            ]);

            Object.assign(utente, { id: result.rows[0].id });
        } else {
            const updateQuery = `
                UPDATE utenti 
                SET username = $1, password = $2
                WHERE id = $3
            `;

            await this.client.query(updateQuery, [
                utente.username,
                utente.password,
                utente.id
            ]);
        }
    }
}