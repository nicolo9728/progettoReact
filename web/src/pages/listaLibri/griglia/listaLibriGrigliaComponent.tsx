import type { LibroViewModel, RisultatoPaginatoViewModel } from "@biblioteca/common"

import styles from "./listaLibriGrigliaComponent.module.css"
import { Link } from "react-router-dom"

export type ListaLibriGrigliaComponentProps = Readonly<{
    libri: RisultatoPaginatoViewModel<LibroViewModel>,
    setPagina: (pagina: number) => void
}>


export const ListaLibriGrigliaComponent = (props: ListaLibriGrigliaComponentProps) => {
    const {totalePagine, paginaCorrente, elementi} = props.libri;

    return (
        <main className={styles.contentArea}>
            <div className={styles.libriGrid}>
                {elementi.map((item) => (
                    <Link to={`/libri/${item.isbn}`} key={item.isbn}>
                        <div className={styles.libro} key={item.isbn}>
                            <div className={styles.coverWrapper}>
                                <img src={item.immagine} alt={item.titolo} className={styles.cover} />
                            </div>
                            <h3 className={styles.title}>{item.titolo}</h3>
                        </div>
                    </Link>
                ))}
            </div>
            <div className={styles["selettore-pagine"]}>
                <button disabled={paginaCorrente <= 1} onClick={() => props.setPagina(paginaCorrente - 1)}>&lt;</button>
                <p>{paginaCorrente}</p>
                <button disabled={paginaCorrente >= totalePagine} onClick={() => props.setPagina(paginaCorrente + 1)}>&gt;</button>
            </div>
        </main>
    )
}