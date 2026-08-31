import type React from "react"
import { LayoutPaginaComponent } from "../../components/layoutPagina"
import { useApiEndpoint } from "../../hooks/apiHook"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const CreaLibroPage = () => {

    const api = useApiEndpoint()
    const navigation = useNavigate()

    const [errore, setErrore] = useState("")

    const creaLibro = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const form = new FormData(e.target)

            await api.postMultipart("libri", form)
            await navigation("/")
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
                <form onSubmit={creaLibro}>
                    <h1>Crea libro</h1>
                    <p>{errore}</p>
                    <input type="text" placeholder="isbn" name="isbn" maxLength={13} minLength={13} required />
                    <input type="text" placeholder="titolo" name="titolo" required />
                    <textarea name="trama" placeholder="trama" required></textarea>
                    <input type="file" name="immagine" />
                    <button>Crea</button>
                </form>
            </div>
        </LayoutPaginaComponent>
    )
}