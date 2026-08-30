import { Injectable } from "@nestjs/common";
import type { PoolClient } from "pg";
import { Admin, Cliente, Utente } from "../../models/utente";

@Injectable()
export class UtenteRepository {
    constructor(private client: PoolClient) { }

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
}