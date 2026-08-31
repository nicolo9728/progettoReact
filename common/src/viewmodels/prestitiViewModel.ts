export type StatusPrestito = {
    stato: "Non restituito",
} | {
    stato: "Restituito",
    momentoRestituzione: string
}

export type PrestitoViewModel = Readonly<{
    id: number,
    libro: Readonly<{
        titolo: string
    }>,
    momentoPrestito: string,
    isScaduto: boolean,
    stato: StatusPrestito
}>