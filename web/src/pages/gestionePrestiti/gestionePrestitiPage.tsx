import { useEffect, useState } from "react"
import { LayoutPaginaComponent } from "../../components/layoutPagina"
import type { PrestitoViewModel } from "@biblioteca/common"
import { useApiEndpoint } from "../../hooks/apiHook"
import { useParams, useSearchParams } from "react-router-dom"
import { useUser } from "../../hooks/userHook"

export const ListaPrestitiPage = () => {

    const [searchParams]= useSearchParams()
    const [prestiti, setPrestiti] = useState<PrestitoViewModel[]>([])
    const api = useApiEndpoint()

    const idUtente = searchParams.get("idUtente")

    useEffect(() => {
        if(idUtente)
            api.get<PrestitoViewModel[]>(`prestiti?idUtente=${idUtente}`).then(setPrestiti)
    }, [idUtente])

    return (
        <LayoutPaginaComponent>
            <div>
                <h1>Lista prestiti</h1>
                <table>
                    <thead>
                        <tr>
                            <th>titolo</th>
                            <th>momento prestito</th>
                            <th>stato</th>
                            <th>momento restituzione</th>
                            <th>Scaduto</th>
                            <th>Operazioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prestiti.map((p) => (
                            <tr key={p.id}>
                                <td>{p.libro.titolo}</td>
                                <td>{p.momentoPrestito}</td>
                                <td>{p.stato.stato}</td>
                                <td>{p.stato.stato == "Restituito" ? p.stato.momentoRestituzione : "Non definita"}</td>
                                <td>{p.isScaduto ? "Scaduto" : "Non scaduto"}</td>
                                <td>{p.stato.stato == "Non restituito" ? <button>Restituisci</button> : <></>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </LayoutPaginaComponent>
    )
}