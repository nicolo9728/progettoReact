export type PrestitoStatus = Readonly<{
    tipo: "Non restituito"
}> | Readonly<{
    tipo: "Restituito",
    momentoRestituzione: Date
}>


export class Prestito {
    private constructor(
        public readonly id: number,
        public readonly idUtente: number,
        public readonly idLibro: string,
        public readonly momentoPrestito: Date,
        public readonly momentoLimite: Date,
        private _status: PrestitoStatus
    ) { }

    public get status(): PrestitoStatus { return this._status }

    public isScaduto(now: Date): boolean { return this._status.tipo == "Non restituito" && now > this.momentoLimite }

    public restituisci(now: Date) { this._status = { tipo: "Restituito", momentoRestituzione: now } }

    public static creaPrestito(now: Date, idUtente: number, idLibro: string): Prestito {
        const dataFinale = new Date(now)
        dataFinale.setDate(dataFinale.getDate() + 7)
        return new Prestito(-1, idUtente, idLibro, now, dataFinale, { tipo: "Non restituito" })
    }
}