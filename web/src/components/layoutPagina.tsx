import { Link } from "react-router-dom"
import style from "./layoutPagina.module.css"
import { useUser } from "../hooks/userHook"
import { useApiEndpoint } from "../hooks/apiHook"

export const LayoutPaginaComponent = (props: { children?: any }) => {
    const { user, logout } = useUser()
    const api = useApiEndpoint()

    const eseguiLogout = async ()=>{
        await api.post("auth/logout", {})
        logout()
    }

    return (
        <div className={style["page"]}>
            <header className={style["header"]}>
                <h1><Link to="/">Libreria online</Link></h1>
                {user != undefined
                    ? 
                    <div className={style["utente-loggato"]}>
                        <h2>{user.username}</h2>
                        <button onClick={eseguiLogout}>Logout</button>
                    </div>
                    :
                    <nav>
                        <Link to="/Registrazione">Registrazione</Link>
                        <Link to="/login">Login</Link>
                    </nav>
                }
            </header>
            <main className={style["main"]}>
                {props.children}
            </main>
        </div>
    )
}