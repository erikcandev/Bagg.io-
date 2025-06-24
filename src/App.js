import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Alert, IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Dashboard from './components/Layout/Dashboard';
import Bens from './pages/Bens';
import Movimentacoes from './pages/Movimentacoes';
import Usuarios from './pages/Usuarios';
import Configuracoes from './pages/Configuracoes';
import DashboardPage from './pages/Dashboard';
import Conferencias from './pages/Conferencias';
import NovaConferencia from './pages/Conferencias/NovaConferencia';
import DetalheConferencia from './pages/Conferencias/DetalheConferencia';
import { useAuth } from './context/AuthContext';
import { ThemeModeContext } from './index';
import './App.css';
import logoBaggio from './assets/logo-baggio.png';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const themeMode = useContext(ThemeModeContext);

  const handleLogin = (e) => {
    e.preventDefault();
    setErro('');
    
    if (!email || !password) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    const sucesso = login(email, password);
    if (!sucesso) {
      setErro('E-mail ou senha incorretos');
      return;
    }

    // Redireciona para o dashboard após login bem-sucedido
    navigate('/dashboard');
  };

  return (
    <div
      className="App"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.background.default,
        transition: 'background 0.3s',
      }}
    >
      <Paper elevation={3} style={{ padding: 32, minWidth: 320, position: 'relative' }}>
        <IconButton
          onClick={themeMode.toggleTheme}
          style={{ position: 'absolute', top: 16, right: 16 }}
          color="inherit"
        >
          {themeMode.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24, gap: 16 }}>
          <img src={logoBaggio} alt="Logo Bagg.io" style={{ width: 48, height: 48, background: theme.palette.primary.main, borderRadius: '50%', padding: 4 }} />
          <Typography variant="h5" style={{ fontWeight: 700, letterSpacing: 1 }}>Bagg.io</Typography>
        </div>
        {erro && <Alert severity="error" style={{ marginBottom: 16 }}>{erro}</Alert>}
        <form onSubmit={handleLogin}>
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 16 }}>
            Entrar
          </Button>
        </form>
      </Paper>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { usuarioLogado } = useAuth();
  return usuarioLogado ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard>
                <DashboardPage />
              </Dashboard>
            </PrivateRoute>
          }
        />
        <Route
          path="/bens"
          element={
            <PrivateRoute>
              <Dashboard>
                <Bens />
              </Dashboard>
            </PrivateRoute>
          }
        />
        <Route
          path="/movimentacoes"
          element={
            <PrivateRoute>
              <Dashboard>
                <Movimentacoes />
              </Dashboard>
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <Dashboard>
                <Usuarios />
              </Dashboard>
            </PrivateRoute>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <PrivateRoute>
              <Dashboard>
                <Configuracoes />
              </Dashboard>
            </PrivateRoute>
          }
        />
        {/* Rotas do módulo de conferências */}
        <Route
          path="/conferencias"
          element={
            <PrivateRoute>
              <Dashboard>
                <Conferencias />
              </Dashboard>
            </PrivateRoute>
          }
        />
        <Route
          path="/conferencias/nova"
          element={
            <PrivateRoute>
              <Dashboard>
                <NovaConferencia />
              </Dashboard>
            </PrivateRoute>
          }
        />
        <Route
          path="/conferencias/:id"
          element={
            <PrivateRoute>
              <Dashboard>
                <DetalheConferencia />
              </Dashboard>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
