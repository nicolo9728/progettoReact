export type LibroFiltroResult = Readonly<{
    query: string,
    parametri: any[],
    pagina: number
}>

export class LibroFiltriSpecification{

    private filtriInseriti: Map<LibroFiltro, any>[] = []
    private pagina = 1

    private constructor(){}

    public addFilterIfDefined(filtro: LibroFiltro, valore?: any){
        if(valore)
            this.filtriInseriti.push(new Map([[filtro, valore]]))

        return this
    }

    public addPagina(pagina: number){
        this.pagina = pagina
    }

    public buildWhere(): LibroFiltroResult{
        if (this.filtriInseriti.length === 0) {
            return { query: "", parametri: [] , pagina: this.pagina};
        }

        const condizioni: string[] = [];
        const parametri: any[] = [];
        let numeroParametro = 1;

        for (const filtroMap of this.filtriInseriti) {
            for (const [filtro, valore] of filtroMap.entries()) {
                condizioni.push(`${filtro.nome} ${filtro.operatore} $${numeroParametro}`);
                parametri.push(valore);
                numeroParametro++;
            }
        }

        console.log({
            query: `WHERE ${condizioni.join(" AND ")}`,
            parametri,
            pagina: this.pagina
        })

        return {
            query: `WHERE ${condizioni.join(" AND ")}`,
            parametri,
            pagina: this.pagina
        };
        
    }

    public static instance(){ return new LibroFiltriSpecification() }
}


export class LibroFiltro{

    private constructor(public readonly nome: string, public readonly operatore: string){}

    public static get titolo() {return new LibroFiltro("titolo", "ILIKE")}
    public static get genere() {return new LibroFiltro("genere", "=")}
}