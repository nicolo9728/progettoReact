import { useEffect, useState } from "react";
import { LayoutPaginaComponent } from "../../components/layoutPagina";
import { ListaLibriFiltriComponent } from "./filtri/listaLibriFiltriComponent"
import { ListaLibriGrigliaComponent } from "./griglia/listaLibriGrigliaComponent"

import styles from "./listaLibriPage.module.css"
import { useApiEndpoint } from "../../hooks/apiHook";
import type { LibroViewModel, RisultatoPaginatoViewModel } from "@biblioteca/common";


export const ListaLibriPage = () => {

    const [libri, setLibri] = useState<LibroViewModel[]>([])
    const api = useApiEndpoint()

    useEffect(()=>{
        api.get<RisultatoPaginatoViewModel<LibroViewModel>>("libri").then((ris)=>setLibri(ris.elementi))
    }, [])


    return (
        <LayoutPaginaComponent>
            <div className={styles["lista-libri-container"]}>
                <ListaLibriFiltriComponent />
                <ListaLibriGrigliaComponent libri={libri} />
            </div>
        </LayoutPaginaComponent>
    )
}