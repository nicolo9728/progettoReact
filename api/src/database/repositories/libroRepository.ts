import { PoolClient } from "pg";
import { Libro, QuantitaDisponibile } from "../../models/libro";

export class LibroRepository{

    constructor(private client: PoolClient){}

    private buildLibroFromRow(libroRow: any){
        return new Libro(libroRow["isbn"], libroRow["titolo"], libroRow["immagine"], libroRow["trama"], new QuantitaDisponibile(libroRow["quantita_disponbile"]))
    }

    public async getLibroByIsbn(isbn: string): Promise<Libro>{
        const libroRow = (await this.client.query("SELECT * FROM libri WHERE isbn=$1", [isbn])).rows[0]

        return this.buildLibroFromRow(libroRow)
    }

    public async save(libro: Libro){
        await this.client.query("UPDATE libri SET titolo=$1, trama=$2, immagine=$3, quantita_disponibile=$4", [
            libro.titolo, libro.trama, libro.immagine, libro.quantita.valore
        ])
    }
}