import React, { createContext, useContext, useState } from 'react';

const ConferenciasContext = createContext();

export function ConferenciasProvider({ children }) {
  const [conferencias, setConferencias] = useState([]);

  // Cria uma nova conferência
  const criarConferencia = ({ agencia, usuario }) => {
    const nova = {
      id: Date.now().toString(),
      agencia,
      usuario,
      data: new Date().toLocaleDateString(),
      status: 'Em conferência',
      bens: [], // será preenchido ao iniciar
    };
    setConferencias(prev => [nova, ...prev]);
    return nova.id;
  };

  // Adiciona bens à conferência
  const adicionarBensNaConferencia = (conferenciaId, bens) => {
    setConferencias(prev => prev.map(conf =>
      conf.id === conferenciaId ? { ...conf, bens } : conf
    ));
  };

  // Atualiza status de um bem na conferência
  const atualizarBemConferencia = (conferenciaId, plaqueta, update) => {
    setConferencias(prev => prev.map(conf => {
      if (conf.id !== conferenciaId) return conf;
      return {
        ...conf,
        bens: conf.bens.map(bem =>
          bem.plaqueta === plaqueta ? { ...bem, ...update } : bem
        )
      };
    }));
  };

  // Atualiza status da conferência
  const atualizarStatusConferencia = (conferenciaId, status) => {
    setConferencias(prev => prev.map(conf =>
      conf.id === conferenciaId ? { ...conf, status } : conf
    ));
  };

  // Exclui conferência
  const excluirConferencia = (conferenciaId) => {
    setConferencias(prev => prev.filter(conf => conf.id !== conferenciaId));
  };

  // Busca conferência por id
  const getConferencia = (id) => conferencias.find(c => c.id === id);

  return (
    <ConferenciasContext.Provider value={{
      conferencias,
      criarConferencia,
      adicionarBensNaConferencia,
      atualizarBemConferencia,
      atualizarStatusConferencia,
      excluirConferencia,
      getConferencia
    }}>
      {children}
    </ConferenciasContext.Provider>
  );
}

export function useConferencias() {
  const context = useContext(ConferenciasContext);
  if (!context) throw new Error('useConferencias deve ser usado dentro de um ConferenciasProvider');
  return context;
} 