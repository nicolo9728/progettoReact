import { useParams } from "react-router-dom"
import { LayoutPaginaComponent } from "../../../components/layoutPagina"
import { useEffect, useState } from "react"
import type { LibroDettailsViewModel } from "@biblioteca/common"
import { useApiEndpoint } from "../../../hooks/apiHook"
import { LoadingComponent } from "../../../components/loadingComponent"

import styles from "./libroDetailsPage.module.css"
import { AuthComponent } from "../../../components/authComponent"

export const LibroDetailsPage = () => {
    const { isbn } = useParams()
    const [libro, setLibro] = useState<LibroDettailsViewModel>()
    const [messaggio, setMessaggio] = useState("")
    const api = useApiEndpoint()

    useEffect(() => {
        api.get<LibroDettailsViewModel>(`libri/${isbn}`).then(setLibro)
    }, [])

    const onPrenota = async () => {
        try{
            await api.post("prestiti", { isbn })
        }
        catch(e){
            if(e instanceof Error)
                setMessaggio(e.message)
            else
                setMessaggio("Si è verificato un problema")
        }
    }

    return (
        <LayoutPaginaComponent>
            <LoadingComponent value={libro}>
                <div className={styles["libro-details"]}>
                    <img src={libro?.immagine} alt="" />
                    <h1>{libro?.titolo}</h1>
                    <p>{libro?.trama}</p>
                    <AuthComponent ruoli={["Cliente"]}>
                        <p>{messaggio}</p>
                        <button onClick={onPrenota}>Prenota</button>
                    </AuthComponent>
                </div>
            </LoadingComponent>
        </LayoutPaginaComponent>
    )
}