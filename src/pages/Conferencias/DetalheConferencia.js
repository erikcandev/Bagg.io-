import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useConferencias } from '../../context/ConferenciasContext';
import { ArrowBack } from '@mui/icons-material';
import { useBens } from '../../context/BensContext';

const STATUS_CORES = {
  'Conferido': 'success',
  'Não conferido': 'warning',
  'Com observação': 'error',
  'Não localizado': 'secondary',
};

const OBSERVACOES_OPCOES = [
  { value: '', label: 'Nenhuma' },
  { value: 'Conferido', label: 'Conferido' },
  { value: 'Baixado', label: 'Baixado' },
  { value: 'Não localizado', label: 'Não localizado' },
  { value: 'Cadastrado em outra filial', label: 'Cadastrado em outra filial' },
];

function DetalheConferencia() {
  const { id } = useParams();
  const { getConferencia, atualizarBemConferencia, atualizarStatusConferencia, excluirConferencia } = useConferencias();
  const conferencia = getConferencia(id);
  const [plaqueta, setPlaqueta] = useState('');
  const [openExcluir, setOpenExcluir] = useState(false);
  const navigate = useNavigate();
  const { bens: bensSistema } = useBens();

  if (!conferencia) {
    return <Typography>Conferência não encontrada.</Typography>;
  }

  // Contadores de status
  const totalConferidos = conferencia.bens.filter(b => b.status === 'Conferido').length;
  const totalNaoConferidos = conferencia.bens.filter(b => b.status === 'Não conferido').length;
  const totalNaoLocalizado = conferencia.bens.filter(b => b.observacao === 'Não localizado').length;
  const totalTransferidos = conferencia.bens.filter(b => b.status === 'Transferido').length;
  const totalBaixados = conferencia.bens.filter(b => b.status === 'Baixado').length;

  // Leitura de plaqueta
  const handlePlaqueta = (e) => {
    e.preventDefault();
    const bem = conferencia.bens.find(b => b.plaqueta === plaqueta);
    // Buscar o bem original no sistema para garantir status atualizado
    const bemOriginal = bensSistema.find(b => b.numeroPatrimonio === plaqueta);
    if (bem) {
      // Se o bem está baixado, marcar como Baixado
      if (bemOriginal && bemOriginal.status === 'Baixado') {
        atualizarBemConferencia(conferencia.id, plaqueta, {
          status: 'Baixado',
          observacao: 'Baixado',
          nome: bem.nome || 'Bem não encontrado',
          filialAtual: bem.agencia || bem.filialAtual
        });
      } else if (bem.filialAtual && bem.filialAtual !== conferencia.filial) {
        atualizarBemConferencia(conferencia.id, plaqueta, {
          status: 'Conferido',
          observacao: '',
          nome: bem.nome || 'Bem não encontrado',
          filialAtual: bem.filialAtual
        });
      } else {
        atualizarBemConferencia(conferencia.id, plaqueta, {
          status: 'Conferido',
          observacao: '',
          nome: bem.nome || 'Bem não encontrado',
          filialAtual: bem.filialAtual
        });
      }
    } else {
      // Plaqueta não localizada: buscar no sistema de bens
      if (bemOriginal) {
        if (bemOriginal.status === 'Baixado') {
          atualizarBemConferencia(conferencia.id, plaqueta, {
            status: 'Baixado',
            observacao: 'Baixado',
            nome: bemOriginal.nome || 'Bem não encontrado',
            plaqueta,
            filialAtual: bemOriginal.filial
          });
        } else {
          atualizarBemConferencia(conferencia.id, plaqueta, {
            status: 'Conferido',
            observacao: '',
            nome: bemOriginal.nome || 'Bem não encontrado',
            plaqueta,
            filialAtual: bemOriginal.filial
          });
        }
      } else {
        atualizarBemConferencia(conferencia.id, plaqueta, {
          status: 'Não localizado',
          observacao: 'Não localizado',
          nome: 'Bem não cadastrado',
          plaqueta,
        });
      }
    }
    setPlaqueta('');
  };

  // Atualiza observação manualmente
  const handleObsChange = (plaqueta, value) => {
    let status;
    if (value === 'Conferido') status = 'Conferido';
    else if (value === '') status = 'Não conferido';
    else if (value === 'Não localizado') status = 'Não localizado';
    else if (value === 'Baixado') status = 'Baixado';
    else if (value === 'Cadastrado em outra filial') status = 'Transferido';
    else status = '';
    atualizarBemConferencia(conferencia.id, plaqueta, {
      observacao: value,
      status,
    });
  };

  // Finalizar conferência
  const handleFinalizar = () => {
    atualizarStatusConferencia(conferencia.id, 'Concluída');
  };

  // Excluir conferência
  const handleExcluir = () => {
    excluirConferencia(conferencia.id);
    setOpenExcluir(false);
    navigate('/conferencias');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/conferencias')}
          >
            Voltar
          </Button>
          <Typography variant="h5">Conferência dos Bens</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          {conferencia.status !== 'Concluída' && (
            <Button variant="contained" color="primary" onClick={handleFinalizar}>
              Finalizar Conferência
            </Button>
          )}
          <Button variant="outlined" color="error" onClick={() => setOpenExcluir(true)}>
            Excluir Conferência
          </Button>
        </Stack>
      </Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Filial:</Typography>
            <Typography>{conferencia.filial}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Data:</Typography>
            <Typography>{conferencia.data}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Usuário:</Typography>
            <Typography>{conferencia.usuario}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2">Status:</Typography>
            <Chip label={conferencia.status} color={conferencia.status === 'Concluída' ? 'success' : 'primary'} size="small" clickable={false} />
          </Grid>
        </Grid>
      </Paper>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Chip label={`Conferidos: ${totalConferidos}`} color="success" clickable={false} sx={{ fontWeight: 600, fontSize: 16, px: 2, py: 1 }} />
        </Grid>
        <Grid item>
          <Chip label={`Não conferidos: ${totalNaoConferidos}`} color="warning" clickable={false} sx={{ fontWeight: 600, fontSize: 16, px: 2, py: 1 }} />
        </Grid>
        <Grid item>
          <Chip label={`Não localizado: ${totalNaoLocalizado}`} color="secondary" clickable={false} sx={{ fontWeight: 600, fontSize: 16, px: 2, py: 1 }} />
        </Grid>
        <Grid item>
          <Chip label={`Transferidos: ${totalTransferidos}`} sx={{ fontWeight: 600, fontSize: 16, px: 2, py: 1, background: '#1976d2', color: '#fff' }} clickable={false} />
        </Grid>
        <Grid item>
          <Chip label={`Baixados: ${totalBaixados}`} sx={{ fontWeight: 600, fontSize: 16, px: 2, py: 1, background: '#757575', color: '#fff' }} clickable={false} />
        </Grid>
      </Grid>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handlePlaqueta} style={{ display: 'flex', gap: 16 }}>
          <TextField
            label="Digite ou leia o número da plaqueta"
            value={plaqueta}
            onChange={e => setPlaqueta(e.target.value)}
            size="small"
            sx={{ minWidth: 280 }}
            disabled={conferencia.status === 'Concluída'}
          />
          <Button type="submit" variant="contained" disabled={conferencia.status === 'Concluída'}>Conferir</Button>
        </form>
      </Paper>
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Plaqueta</TableCell>
                <TableCell>Bem</TableCell>
                <TableCell>Situação</TableCell>
                <TableCell>Observações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conferencia.bens.map(bem => (
                <TableRow key={bem.plaqueta}>
                  <TableCell>{bem.codigo || '-'}</TableCell>
                  <TableCell>{bem.plaqueta}</TableCell>
                  <TableCell>{bem.nome}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {bem.status !== 'Transferido' && (
                        <Chip label={bem.status} color={STATUS_CORES[bem.status] || 'default'} size="small" clickable={false} />
                      )}
                      {bem.status === 'Transferido' && (
                        <Chip label="Transferido" size="small" sx={{ background: '#1976d2', color: '#fff' }} />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={bem.observacao || ''}
                      onChange={e => handleObsChange(bem.plaqueta, e.target.value)}
                      size="small"
                      disabled={conferencia.status === 'Concluída'}
                    >
                      {OBSERVACOES_OPCOES.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {conferencia.bens.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">Nenhum bem cadastrado nesta conferência</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Dialog de confirmação de exclusão */}
      <Dialog open={openExcluir} onClose={() => setOpenExcluir(false)}>
        <DialogTitle>Excluir Conferência</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir esta conferência? Esta ação não pode ser desfeita.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExcluir(false)} variant="outlined" color="error">Cancelar</Button>
          <Button onClick={handleExcluir} color="error" variant="contained">Excluir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DetalheConferencia; 