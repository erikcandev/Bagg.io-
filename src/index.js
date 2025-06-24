import React, { useMemo, useState, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './theme';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BensProvider } from './context/BensContext';
import { FiliaisProvider } from './context/FiliaisContext';
import { MovimentacoesProvider } from './context/MovimentacoesContext';
import { AuthProvider } from './context/AuthContext';
import { ConferenciasProvider } from './context/ConferenciasContext';

export const ThemeModeContext = createContext({ toggleTheme: () => {}, mode: 'light' });

function Providers({ children }) {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => getTheme(mode), [mode]);
  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeModeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <FiliaisProvider>
            <BensProvider>
              <MovimentacoesProvider>
                <ConferenciasProvider>
                  {children}
                </ConferenciasProvider>
              </MovimentacoesProvider>
            </BensProvider>
          </FiliaisProvider>
        </AuthProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
