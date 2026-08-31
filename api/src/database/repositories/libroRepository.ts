import { Pool, PoolClient } from "pg";
import { Libro, QuantitaDisponibile } from "../../models/libro";

export class LibroRepository {
    constructor(private client: PoolClient | Pool) { }

    private buildLibroFromRow(libroRow: any) {
        return new Libro(
            libroRow["isbn"],
            libroRow["titolo"],
            libroRow["immagine"],
            libroRow["trama"],
            new QuantitaDisponibile(libroRow["quantita_disponibile"])
        );
    }

    public async getLibroByIsbn(isbn: string): Promise<Libro | null> {
        const res = await this.client.query("SELECT * FROM libri WHERE isbn=$1", [isbn]);
        if (res.rows.length === 0) return null;

        return this.buildLibroFromRow(res.rows[0]);
    }

    public async save(libro: Libro): Promise<void> {
        const queryText = `
            INSERT INTO libri (isbn, titolo, immagine, trama, quantita_disponibile)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (isbn) 
            DO UPDATE SET 
                titolo = EXCLUDED.titolo,
                immagine = EXCLUDED.immagine,
                trama = EXCLUDED.trama,
                quantita_disponibile = EXCLUDED.quantita_disponibile;
        `;

        const values = [
            libro.isbn,
            libro.titolo,
            libro.immagine,
            libro.trama,
            libro.quantita.valore
        ];

        await this.client.query(queryText, values);
    }
}