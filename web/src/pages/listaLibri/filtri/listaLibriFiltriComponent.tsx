import type { GenereViewModel } from '@biblioteca/common';
import styles from './listaLibriFiltriComponent.module.css';

type ListaLibriFiltroProps = Readonly<{
  generi: GenereViewModel[]
}>

export const ListaLibriFiltriComponent = (props: ListaLibriFiltroProps) => {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Filtri</h2>
      <input type="text" placeholder='titolo'/>
      <select name="" id="">
        <option disabled selected>Seleziona un genere</option>
        {props.generi.map((g)=>(
          <option key={g.nome} value={g.nome} >{g.nome}</option>
        ))}
      </select>
      <button>Filtra</button>
    </aside>
  );
};