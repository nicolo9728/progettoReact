export class QuantitaDisponibile {
    constructor(public readonly valore: number) {
        if (valore < 0)
            throw new Error("La quantita deve essere sempre positiva")
    }

    public riduciScorta(): QuantitaDisponibile {
        return new QuantitaDisponibile(this.valore - 1)
    }
}

export class Libro {
    constructor(
        public readonly isbn: string,
        public readonly titolo: string,
        public readonly immagine: string,
        public readonly trama: string,
        private _quantita: QuantitaDisponibile
    ) { }

    public get quantita(): QuantitaDisponibile { return this._quantita }

    public isDisponibile() { return this.quantita.valore > 0 }

    public prendiPrestito() { this._quantita = this._quantita.riduciScorta() }
}