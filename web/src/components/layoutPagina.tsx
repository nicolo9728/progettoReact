import { Link, useNavigate } from "react-router-dom"
import style from "./layoutPagina.module.css"
import { useUser } from "../hooks/userHook"
import { useApiEndpoint } from "../hooks/apiHook"
import { AuthComponent } from "./authComponent"

export const LayoutPaginaComponent = (props: { children?: any }) => {
    const api = useApiEndpoint()
    const {user, logout} = useUser()
    const navigation = useNavigate()

    const eseguiLogout = async ()=>{
        await api.post("auth/logout", {})
        await navigation("/")
        logout()
    }

    return (
        <div className={style["page"]}>
            <header className={style["header"]}>
                <h1><Link to="/">Libreria online</Link></h1>
                <AuthComponent ruoli={["Cliente"]}>
                    <nav>
                        <Link to={`/prestiti?idUtente=${user?.userId}`}>Prestiti</Link>
                    </nav>
                </AuthComponent>
                <AuthComponent ruoli={["Admin"]}>
                    <nav>
                        <Link to="/ricercaUtenti">gestisci restituzioni</Link>
                    </nav>
                </AuthComponent>
                <AuthComponent>
                    <div className={style["utente-loggato"]}>
                        <h2>{user?.username}</h2>
                        <button onClick={eseguiLogout}>Logout</button>
                    </div>
                </AuthComponent>
                <AuthComponent anonimo>
                    <nav>
                        <Link to="/Registrazione">Registrazione</Link>
                        <Link to="/login">Login</Link>
                    </nav>
                </AuthComponent>
            </header>
            <main className={style["main"]}>
                {props.children}
            </main>
        </div>
    )
}