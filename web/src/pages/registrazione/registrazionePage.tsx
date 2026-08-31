import type React from "react"
import { LayoutPaginaComponent } from "../../components/layoutPagina"
import { getFormData } from "../../helpers/getFormData"
import { useState } from "react"
import { useApiEndpoint } from "../../hooks/apiHook"
import { useNavigate } from "react-router-dom"

export const RegistrazionePage = () => {

    const [errore, setErrore] = useState("")
    const api = useApiEndpoint()
    const navigator = useNavigate()

    const registrazione = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const dati = getFormData(e.target)
            await api.post("utenti", dati)
            
            await navigator("/")
        }
        catch(e){
            if(e instanceof Error)
                setErrore(e.message)
            else
                setErrore("Qualcosa è andato storto")
        }
    }

    return (
        <LayoutPaginaComponent>
            <div className="form-container">
                <form action="" onSubmit={registrazione}>
                    <h1>Registrazione</h1>
                    <p className="errore">{errore}</p>
                    <label>Username: <input type="text" placeholder="Inserisci username" name="username" /></label>
                    <label>Password: <input type="password" placeholder="Inserisci password" name="password" /></label>
                    <label>Conferma password: <input type="password" placeholder="Conferma la password" name="confermaPassword"/></label>
                    <button>Registrati</button>
                </form>
            </div>
        </LayoutPaginaComponent>
    )
}