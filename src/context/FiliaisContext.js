import React, { createContext, useContext, useState } from 'react';

const FiliaisContext = createContext();

const filiaisIniciais = [];

export function FiliaisProvider({ children }) {
  const [filiais, setFiliais] = useState(filiaisIniciais);

  const adicionarFilial = (novaFilial) => {
    if (!filiais.some(f => f.nome === novaFilial.nome)) {
      setFiliais([...filiais, novaFilial]);
    }
  };

  return (
    <FiliaisContext.Provider value={{ filiais, adicionarFilial, setFiliais }}>
      {children}
    </FiliaisContext.Provider>
  );
}

export function useFiliais() {
  return useContext(FiliaisContext);
} 