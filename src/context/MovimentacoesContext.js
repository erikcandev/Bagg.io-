import React, { createContext, useContext, useState } from 'react';

const MovimentacoesContext = createContext();

export function MovimentacoesProvider({ children }) {
  const [movimentacoes, setMovimentacoes] = useState([]);

  const registrarMovimentacao = (movimentacao) => {
    setMovimentacoes((prev) => [...prev, movimentacao]);
  };

  return (
    <MovimentacoesContext.Provider value={{ movimentacoes, registrarMovimentacao }}>
      {children}
    </MovimentacoesContext.Provider>
  );
}

export function useMovimentacoes() {
  return useContext(MovimentacoesContext);
} 