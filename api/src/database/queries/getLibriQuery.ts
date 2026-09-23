import { QueryHandler } from "./queryHandler";
import { QueryExecutor } from "./queryExecutor";
import { Injectable } from "@nestjs/common";
import { LibroViewModel, RisultatoPaginatoViewModel } from "@biblioteca/common";
import { ConfigService } from "@nestjs/config";
import { LibroFiltroResult } from "../../filtri/LibroFiltriSpecification";

type QueryParameter = { filtro: LibroFiltroResult }

@Injectable()
export class GetLibriQuery extends QueryHandler<RisultatoPaginatoViewModel<LibroViewModel>, QueryParameter> {

    constructor(private config: ConfigService, private q: QueryExecutor) { super(q) }

    public query(parametri: QueryParameter): Promise<RisultatoPaginatoViewModel<LibroViewModel>> {
        return this.queryExecutor
            .queryPaginated(`SELECT isbn, titolo, immagine FROM libri ${parametri.filtro.query} ORDER BY titolo`,
                parametri.filtro.parametri,
                parametri.filtro.pagina,
                this.config.get<number>("PAGE_SIZE")
            )
    }
}