import type { UtenteLoggatoViewModel } from "@biblioteca/common";
import { createContext, useContext, useEffect, useState } from "react";
import { useApiEndpoint } from "./apiHook";

type UtenteLoggatoPros = {
    user?: UtenteLoggatoViewModel,
    loginEffettuato: () => void,
    logout: () => void
}

const UtenteLoggatoContext = createContext<UtenteLoggatoPros | null>(null)

export function UserProvider({ children } : {children: any}) {
  const [user, setUser] = useState<UtenteLoggatoViewModel | undefined>(); // null = non loggato
  const api = useApiEndpoint()

  const loginEffettuato = () => {
    api.get<UtenteLoggatoViewModel>("auth").then(setUser)
  };

  const logout = () => {
    setUser(undefined);
  };

  useEffect(()=>{
      api.get<UtenteLoggatoViewModel>("auth").then(setUser)
  }, [])

  return (
    <UtenteLoggatoContext.Provider value={{ user, loginEffettuato, logout }}>
      {children}
    </UtenteLoggatoContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UtenteLoggatoContext);
  if (!context) {
    throw new Error('useUser deve essere usato all\'interno di un UserProvider');
  }
  return context;
}