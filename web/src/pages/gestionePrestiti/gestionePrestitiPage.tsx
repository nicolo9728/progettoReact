import { useEffect, useState } from "react"
import { LayoutPaginaComponent } from "../../components/layoutPagina"
import type { PrestitoViewModel } from "@biblioteca/common"
import { useApiEndpoint } from "../../hooks/apiHook"

export const ListaPrestitiPage = () => {

    const [prestiti, setPrestiti] = useState<PrestitoViewModel[]>([])
    const api = useApiEndpoint()

    useEffect(() => {
        api.get<PrestitoViewModel[]>("prestiti").then(setPrestiti)
    }, [])

    return (
        <LayoutPaginaComponent>
            <div>
                <h1>Lista presitti</h1>
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