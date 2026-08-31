import type { GenereViewModel } from '@biblioteca/common';
import styles from './listaLibriFiltriComponent.module.css';
import { useState } from 'react';

export type FiltroLibri = Readonly<{
  titolo?: string,
  genere?: string
}>

type ListaLibriFiltroProps = Readonly<{
  generi: GenereViewModel[],
  currentFiltro: FiltroLibri,
  onFiltroCambiato: (filtro: FiltroLibri) => void
}>

export const ListaLibriFiltriComponent = (props: ListaLibriFiltroProps) => {
  const [filtro, setFiltro] = useState<FiltroLibri>({})
  
  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.title}>Filtri</h1>
      <input type="text" value={filtro.titolo ?? ""} placeholder='titolo' onChange={(e) => setFiltro({...filtro, titolo: e.target.value})} />
      <select name="" id="" onChange={(e) => setFiltro({...filtro, genere: e.target.value})} value={filtro.genere ?? ""}>
        <option disabled selected value="">Seleziona un genere</option>
        {props.generi.map((g) => (
          <option key={g.nome} value={g.nome} >{g.nome}</option>
        ))}
      </select>
      <button onClick={() => props.onFiltroCambiato(filtro)}>Filtra</button>
      <button onClick={()=>{props.onFiltroCambiato({}); setFiltro({})}}>Pulisci filtri</button>
    </aside>
  );
};