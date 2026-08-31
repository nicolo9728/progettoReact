import React, { useDebugValue, useEffect, useState } from "react"
import { LayoutPaginaComponent } from "../../components/layoutPagina"
import { useApiEndpoint } from "../../hooks/apiHook"
import type { UtenteTrovatoViewModel } from "@biblioteca/common"
import { getFormData } from "../../helpers/getFormData"
import { Link } from "react-router-dom"

export const RicercaUtentiPage = () => {
    const [utentiTrovati, setUtentiTrovati] = useState<UtenteTrovatoViewModel[] | undefined>()
    const [usernameDaCercare, setUsernameDaCercare] = useState<string | undefined>()

    const api = useApiEndpoint()

    useEffect(() => {
        if (usernameDaCercare)
            api.get<UtenteTrovatoViewModel[]>(`utenti?username=${usernameDaCercare}`).then(setUtentiTrovati)
    }, [usernameDaCercare])

    const cercaUtenti = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = getFormData(e.target)

        setUsernameDaCercare(form.username)
    }

    return (
        <LayoutPaginaComponent>
            <h1>Ricerca utenti</h1>
            <form action="" onSubmit={cercaUtenti}>
                <input type="text" placeholder="Username da cercare" minLength={3} required name="username" />
                <button>ricerca</button>
            </form>
            {
                utentiTrovati != undefined && utentiTrovati.length > 0
                    ?
                    <div>
                        {utentiTrovati.map((u) => (
                            <Link to={`/prestiti?idUtente=${u.id}`} key={u.id}>
                                <div>
                                    <h2>{u.username}</h2>
                                </div>
                            </Link>
                        ))}
                    </div>
                    : <></>
            }
            {
                utentiTrovati != undefined && utentiTrovati.length == 0 
                    ? <div><h2>Nessun utente trovato</h2></div>
                    : <></>
            }
        </LayoutPaginaComponent>
    )
}