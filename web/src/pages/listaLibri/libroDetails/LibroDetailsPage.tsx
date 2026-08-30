import { useParams } from "react-router-dom"
import { LayoutPaginaComponent } from "../../../components/layoutPagina"
import { useEffect, useState } from "react"
import type { LibroDettailsViewModel } from "@biblioteca/common"
import { useApiEndpoint } from "../../../hooks/apiHook"
import { LoadingComponent } from "../../../components/loadingComponent"

import styles from "./libroDetailsPage.module.css"
import { AuthComponent } from "../../../components/authComponent"

export const LibroDetailsPage = ()=>{
    const {isbn} = useParams()
    const [libro, setLibro] = useState<LibroDettailsViewModel>()
    const api = useApiEndpoint()

    useEffect(()=>{
        api.get<LibroDettailsViewModel>(`libri/${isbn}`).then(setLibro)
    }, [])

    return (
        <LayoutPaginaComponent>
            <LoadingComponent value={libro}>
                <div className={styles["libro-details"]}>
                    <img src={libro?.immagine} alt="" />
                    <h1>{libro?.titolo}</h1>
                    <p>{libro?.trama}</p>
                    <AuthComponent>
                        <button>Prenota</button>
                    </AuthComponent>
                </div>
            </LoadingComponent>
        </LayoutPaginaComponent>
    )
}