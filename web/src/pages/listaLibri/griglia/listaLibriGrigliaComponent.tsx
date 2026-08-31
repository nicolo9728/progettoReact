import type { LibroViewModel } from "@biblioteca/common"

import styles from "./listaLibriGrigliaComponent.module.css"
import { Link } from "react-router-dom"

export type ListaLibriGrigliaComponentProps = Readonly<{
    libri: LibroViewModel[]
}>


export const ListaLibriGrigliaComponent = (props: ListaLibriGrigliaComponentProps) => {
    return (
        <main className={styles.contentArea}>
            <div className={styles.libriGrid}>
                {props.libri.map((item) => (
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
        </main>
    )
}