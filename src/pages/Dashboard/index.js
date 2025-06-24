import React, { useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useBens } from '../../context/BensContext';
import { useFiliais } from '../../context/FiliaisContext';
import { MonetizationOn, CheckCircle, RemoveCircle, Build, LocationOn } from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function CustomTooltip({ active, payload, label, mousePos }) {
  if (!active || !payload || !payload.length || !mousePos) return null;
  const style = {
    position: 'fixed',
    left: mousePos.x + 12,
    top: mousePos.y + 12,
    pointerEvents: 'none',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: 4,
    padding: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 9999,
    color: '#222',
    fontSize: 14
  };
  return (
    <div style={style}>
      <div><b>{label}</b></div>
      {payload.map((entry, idx) => (
        <div key={idx} style={{ color: entry.color }}>{entry.name}: {entry.value}</div>
      ))}
    </div>
  );
}

function Dashboard() {
  const { bens } = useBens();
  const { filiais } = useFiliais();
  const [mousePos, setMousePos] = useState(null);

  // Estatísticas básicas
  const ativos = bens.filter(bem => bem.status === 'Ativo');
  const baixados = bens.filter(bem => bem.status === 'Baixado');
  const emManutencao = bens.filter(bem => bem.status === 'Em Manutenção');
  const valorTotal = bens
    .filter(bem => bem.status !== 'Baixado')
    .reduce((acc, bem) => acc + (parseFloat(bem.valor) || 0), 0);

  // Dados para o gráfico de distribuição por filial
  const dadosPorFilial = filiais.map(filial => ({
    filial: filial.nome,
    quantidade: bens.filter(bem => bem.agencia === filial.nome).length
  }));

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Dashboard</Typography>
      
      {/* Cards de estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }} elevation={3}>
            <CheckCircle color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">Bens Ativos</Typography>
              <Typography variant="h4">{ativos.length}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }} elevation={3}>
            <RemoveCircle color="secondary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">Bens Baixados</Typography>
              <Typography variant="h4">{baixados.length}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }} elevation={3}>
            <Build color="warning" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">Em Manutenção</Typography>
              <Typography variant="h4">{emManutencao.length}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }} elevation={3}>
            <MonetizationOn color="success" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">Valor Total</Typography>
              <Typography variant="h4">
                R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráfico de distribuição por filial */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 3 }}>Distribuição de Bens por Filial</Typography>
        <Box sx={{ height: 400 }}
          onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
          onMouseLeave={() => setMousePos(null)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosPorFilial}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="filial" />
              <YAxis />
              <Tooltip content={props => <CustomTooltip {...props} mousePos={mousePos} />} isAnimationActive={false} cursor={{ fill: '#eee', opacity: 0.2 }} wrapperStyle={{ pointerEvents: 'none' }} />
              <Legend />
              <Bar dataKey="quantidade" name="Quantidade de Bens" fill="#00995D" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Resumo por filial */}
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 3 }}>Resumo por Filial</Typography>
        <Grid container spacing={2}>
          {filiais.map(filial => {
            const bensFilial = bens.filter(bem => bem.agencia === filial.nome);
            const valorFilial = bensFilial.reduce((acc, bem) => acc + (parseFloat(bem.valor) || 0), 0);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={filial.nome}>
                <Paper sx={{ p: 2 }} variant="outlined">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn color="primary" />
                    <Typography variant="subtitle1">{filial.nome}</Typography>
                  </Box>
                  <Typography variant="body2">Total de Bens: {bensFilial.length}</Typography>
                  <Typography variant="body2">
                    Valor Total: R$ {valorFilial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
}

export default Dashboard; 