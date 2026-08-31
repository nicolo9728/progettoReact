import { useEffect, useState } from "react"
import { LayoutPaginaComponent } from "../../components/layoutPagina"
import type { PrestitoViewModel } from "@biblioteca/common"
import { useApiEndpoint } from "../../hooks/apiHook"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AuthComponent } from "../../components/authComponent"

export const ListaPrestitiPage = () => {

    const [searchParams]= useSearchParams()
    const [prestiti, setPrestiti] = useState<PrestitoViewModel[]>([])
    const api = useApiEndpoint()

    const idUtente = searchParams.get("idUtente")

    const loadLista = async ()=>{
        if(idUtente)
            await api.get<PrestitoViewModel[]>(`prestiti?idUtente=${idUtente}`).then(setPrestiti)
    }

    useEffect(() => {
        loadLista()
    }, [])

    const restituisci = async (idPrestito: number)=>{
        await api.post(`prestiti/${idPrestito}/restituzione`, {})
        await loadLista()
    }

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
                            <AuthComponent ruoli={["Admin"]}>
                                <th>Operazioni</th>
                            </AuthComponent>
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
                                <AuthComponent ruoli={["Admin"]}>
                                    <td>{p.stato.stato == "Non restituito" ? <button onClick={()=>restituisci(p.id)}>Restituisci</button> : <></>}</td>
                                </AuthComponent>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </LayoutPaginaComponent>
    )
}