import React, { createContext, useContext, useState } from 'react';

const BensContext = createContext();

export function BensProvider({ children }) {
  const [bens, setBens] = useState([]);
  return (
    <BensContext.Provider value={{ bens, setBens }}>
      {children}
    </BensContext.Provider>
  );
}

export function useBens() {
  return useContext(BensContext);
} 