export class QuantitaDisponibile {
    constructor(public readonly valore: number) {
        if (valore < 0)
            throw new Error("La quantita deve essere sempre positiva")
    }

    public riduciScorta(): QuantitaDisponibile {
        return new QuantitaDisponibile(this.valore - 1)
    }

    public aumentaScora(): QuantitaDisponibile {
        return new QuantitaDisponibile(this.valore + 1)
    }
}

export class Libro {
    constructor(
        public readonly isbn: string,
        public readonly titolo: string,
        public readonly immagine: string,
        public readonly trama: string,
        public readonly genere: string,
        private _quantita: QuantitaDisponibile
    ) { }

    public get quantita(): QuantitaDisponibile { return this._quantita }

    public isDisponibile() { return this.quantita.valore > 0 }

    public prelevaCopia() { this._quantita = this._quantita.riduciScorta() }

    public restituisciCopia() { this._quantita = this._quantita.aumentaScora() }

    public static creaLibro(isbn: string, titolo: string, trama: string, immagine: string, genere: string): Libro{
        return new Libro(isbn, titolo, immagine, trama, genere ,new QuantitaDisponibile(0))
    }
}