import { useState } from "react"
import { LayoutPaginaComponent } from "../../components/layoutPagina"
import { useApiEndpoint } from "../../hooks/apiHook"
import { getFormData } from "../../helpers/getFormData"
import { useNavigate } from "react-router-dom"
import { useUser } from "../../hooks/userHook"

export const LoginPage = () => {
    const api = useApiEndpoint()
    const navigation = useNavigate()
    const [errore, setErrore] = useState("")

    const { loginEffettuato } = useUser()

    const onLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await api.post("auth", getFormData(e.target))
            loginEffettuato()
            navigation("/")
        }
        catch (_) {
            setErrore("Credenziali non valide")
        }
    }

    return (
        <LayoutPaginaComponent>
            <div className="form-container">
                <form onSubmit={onLogin}>
                    <h1>Login</h1>
                    <p className="errore">{errore}</p>
                    <label>Username: <input type="text" placeholder="Username" required name="username" /></label>
                    <label>Password: <input type="password" placeholder="Password" required name="password" /></label>
                    <button>Login</button>
                </form>
            </div>
        </LayoutPaginaComponent>
    )
}