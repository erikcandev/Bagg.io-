import React, { useState } from 'react';
import { Box, Typography, Paper, Button, TextField, MenuItem, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useConferencias } from '../../context/ConferenciasContext';
import { useFiliais } from '../../context/FiliaisContext';
import { useAuth } from '../../context/AuthContext';
import { useBens } from '../../context/BensContext';

function NovaConferencia() {
  const { criarConferencia, adicionarBensNaConferencia } = useConferencias();
  const { filiais } = useFiliais();
  const { usuarioLogado } = useAuth();
  const { bens } = useBens();
  const [filial, setFilial] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleCriar = (e) => {
    e.preventDefault();
    setErro('');
    if (!filial) {
      setErro('Selecione uma filial');
      return;
    }
    // Filtra bens da filial selecionada
    const bensFilial = bens
      .filter(bem => bem.agencia === filial)
      .map(bem => ({
        codigo: bem.id,
        plaqueta: bem.numeroPatrimonio,
        nome: bem.nome,
        status: 'Não conferido',
        observacao: '',
        filialAtual: bem.agencia
      }));
    const id = criarConferencia({ filial, usuario: usuarioLogado?.nome || '' });
    adicionarBensNaConferencia(id, bensFilial);
    navigate(`/conferencias/${id}`);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Nova Conferência</Typography>
      <Paper sx={{ p: 3, maxWidth: 400 }}>
        <form onSubmit={handleCriar}>
          <TextField
            select
            label="Filial"
            value={filial}
            onChange={e => setFilial(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Selecione</MenuItem>
            {filiais.map(fil => (
              <MenuItem key={fil.nome} value={fil.nome}>{fil.nome}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Usuário"
            value={usuarioLogado?.nome || ''}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
          <Button type="submit" variant="contained" fullWidth>
            Iniciar Conferência
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default NovaConferencia; 