import { useEffect, useState } from "react";
import { LayoutPaginaComponent } from "../../components/layoutPagina";
import { ListaLibriFiltriComponent, type FiltroLibri } from "./filtri/listaLibriFiltriComponent"
import { ListaLibriGrigliaComponent } from "./griglia/listaLibriGrigliaComponent"

import styles from "./listaLibriPage.module.css"
import { useApiEndpoint } from "../../hooks/apiHook";
import type { GenereViewModel, LibroViewModel, RisultatoPaginatoViewModel } from "@biblioteca/common";


export const ListaLibriPage = () => {

    const [libri, setLibri] = useState<RisultatoPaginatoViewModel<LibroViewModel> | undefined>(undefined)
    const [generi, setGeneri] = useState<GenereViewModel[]>([])
    const [filtroLibri, setFiltroLibri] = useState<FiltroLibri>({})

    const api = useApiEndpoint()
    const [pagina, setPagina] = useState<number>(1)


    useEffect(() => {
        api.get<RisultatoPaginatoViewModel<LibroViewModel>>(
            `libri?pagina=${pagina}&titolo=${filtroLibri.titolo ? `${filtroLibri.titolo}%` : ""}${filtroLibri.genere ? `&genere=${filtroLibri.genere}` : ""}`)
            .then((ris) => setLibri(ris))
            
        api.get<GenereViewModel[]>("generi").then(setGeneri)
    }, [pagina, filtroLibri])


    return (
        <LayoutPaginaComponent>
            <div className={styles["lista-libri-container"]}>
                {
                    libri != undefined
                        ? <>
                            <ListaLibriFiltriComponent currentFiltro={filtroLibri} generi={generi} onFiltroCambiato={setFiltroLibri}/>
                            <ListaLibriGrigliaComponent libri={libri?.elementi ?? []} />
                            <div>
                                <button disabled={pagina <= 1} onClick={()=>setPagina(pagina - 1)}>Indietro</button>
                                <p>{pagina}</p>
                                <button disabled={pagina >= libri.totalePagine} onClick={()=>setPagina(pagina + 1)}>Avanti</button>
                            </div>
                        </>
                        : <></>

                }
            </div>
        </LayoutPaginaComponent>
    )
}