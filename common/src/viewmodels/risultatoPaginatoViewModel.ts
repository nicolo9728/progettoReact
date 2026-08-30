export type RisultatoPaginatoViewModel<T> = Readonly<{
    elementi: T[];
    paginaCorrente: number;
    totalePagine: number;
}>;