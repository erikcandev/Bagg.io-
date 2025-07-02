import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Stack,
  MenuItem,
  useTheme
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, UploadFile, Download } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { useBens } from '../../context/BensContext';
import { useFiliais } from '../../context/FiliaisContext';
import TransferirBemModal from './TransferirBemModal';
import { useMovimentacoes } from '../../context/MovimentacoesContext';
import { useAuth } from '../../context/AuthContext';

function Bens() {
  const { bens, setBens } = useBens();
  const { filiais, adicionarFilial } = useFiliais();
  const { registrarMovimentacao } = useMovimentacoes();
  const [agenciaFiltro, setAgenciaFiltro] = useState('');
  const [open, setOpen] = useState(false);
  const [currentBem, setCurrentBem] = useState({
    id: '',
    nome: '',
    descricao: '',
    numeroPatrimonio: '',
    valor: '',
    dataAquisicao: '',
    inicioUso: '',
    status: 'Ativo',
    agencia: '',
    numeroNota: '',
    fornecedor: '',
  });
  const [transferirOpen, setTransferirOpen] = useState(false);
  const [bemParaTransferir, setBemParaTransferir] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bemParaExcluir, setBemParaExcluir] = useState(null);
  const [baixaDialogOpen, setBaixaDialogOpen] = useState(false);
  const [bemParaBaixa, setBemParaBaixa] = useState(null);
  const [justificativaBaixa, setJustificativaBaixa] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [dataAquisicaoFiltro, setDataAquisicaoFiltro] = useState('');
  const [inicioUsoFiltro, setInicioUsoFiltro] = useState('');
  const [dataBaixaFiltro, setDataBaixaFiltro] = useState('');
  const theme = useTheme();
  const { temPermissao } = useAuth();

  const handleClickOpen = () => {
    setCurrentBem({
      id: '',
      nome: '',
      descricao: '',
      numeroPatrimonio: '',
      valor: '',
      dataAquisicao: '',
      inicioUso: new Date().toLocaleDateString('pt-BR'),
      status: 'Ativo',
      agencia: '',
      numeroNota: '',
      fornecedor: '',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentBem({
      id: '',
      nome: '',
      descricao: '',
      numeroPatrimonio: '',
      valor: '',
      dataAquisicao: '',
      inicioUso: '',
      status: 'Ativo',
      agencia: '',
      numeroNota: '',
      fornecedor: '',
    });
  };

  const handleSave = () => {
    if (currentBem.id) {
      setBens(bens.map(bem => bem.id === currentBem.id ? currentBem : bem));
    } else {
      const newBem = { ...currentBem, id: Date.now().toString() };
      setBens([...bens, newBem]);
    }
    handleClose();
  };

  const handleEdit = (bem) => {
    setCurrentBem(bem);
    setOpen(true);
  };

  const handleDeleteClick = (bem) => {
    setBemParaExcluir(bem);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (bemParaExcluir) {
      setBens(bens.filter(bem => bem.id !== bemParaExcluir.id));
    }
    setDeleteDialogOpen(false);
    setBemParaExcluir(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBemParaExcluir(null);
  };

  // Exportação no formato solicitado
  const handleExport = () => {
    const exportData = bens.map(bem => ({
      'Filial': bem.agencia || '',
      'Nome': bem.nome || '',
      'Número Patrimonial': bem.numeroPatrimonio || '',
      'Início de uso': bem.inicioUso || '',
      'Data de Aquisição': bem.dataAquisicao || '',
      'Valor': bem.valor || '',
      'Status': bem.status || '',
      'Fornecedor': bem.fornecedor || '',
      'Nº da Nota': bem.numeroNota || '',
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bens');
    XLSX.writeFile(wb, 'bens.xlsx');
  };

  // Importação no formato solicitado
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const importedRows = XLSX.utils.sheet_to_json(worksheet);
      const importedBens = importedRows.map(row => ({
        agencia: row['Filial'] || '',
        nome: row['Nome'] || '',
        numeroPatrimonio: row['Número Patrimonial'] ? String(row['Número Patrimonial']) : '',
        inicioUso: row['Início de uso'] || '',
        dataAquisicao: row['Data de Aquisição'] || '',
        valor: row['Valor'] || '',
        status: row['Status'] || 'Ativo',
        fornecedor: row['Fornecedor'] || '',
        numeroNota: row['Nº da Nota'] || '',
        descricao: '',
        id: Date.now().toString() + Math.random(),
      }));
      setBens([...bens, ...importedBens]);
    };
    reader.readAsArrayBuffer(file);
  };

  // Filtro de bens por agência, status e datas
  let bensFiltrados = agenciaFiltro ? bens.filter(bem => bem.agencia === agenciaFiltro) : bens;
  if (statusFiltro) {
    bensFiltrados = bensFiltrados.filter(bem => bem.status === statusFiltro);
  }
  if (dataAquisicaoFiltro) {
    bensFiltrados = bensFiltrados.filter(bem => (bem.dataAquisicao || '').includes(dataAquisicaoFiltro));
  }
  if (inicioUsoFiltro) {
    bensFiltrados = bensFiltrados.filter(bem => (bem.inicioUso || '').includes(inicioUsoFiltro));
  }
  if (dataBaixaFiltro) {
    bensFiltrados = bensFiltrados.filter(bem => bem.status === 'Baixado' && (bem.dataBaixa || '').includes(dataBaixaFiltro));
  }

  const handleTransferirBem = (bem) => {
    setBemParaTransferir(bem);
    setTransferirOpen(true);
  };

  const realizarTransferencia = ({ agenciaDestino, responsavel, observacao, isBaixa, motivoBaixa, dataBaixa }) => {
    if (!bemParaTransferir) return;

    setBens(bens.map(bem => {
      if (bem.id === bemParaTransferir.id) {
        return {
          ...bem,
          agencia: isBaixa ? 'BAIXA' : agenciaDestino,
          status: isBaixa ? 'Baixado' : bem.status,
          motivoBaixa: isBaixa ? motivoBaixa : undefined,
          dataBaixa: isBaixa ? dataBaixa : undefined
        };
      }
      return bem;
    }));

    registrarMovimentacao({
      id: Date.now().toString(),
      tipo: isBaixa ? 'Baixa' : 'Transferência',
      bemId: bemParaTransferir.id,
      nomeBem: bemParaTransferir.nome,
      numeroPatrimonio: bemParaTransferir.numeroPatrimonio,
      origem: bemParaTransferir.agencia,
      destino: agenciaDestino,
      responsavel,
      observacao,
      dataMovimentacao: new Date().toLocaleString()
    });

    setTransferirOpen(false);
    setBemParaTransferir(null);
  };

  // Função para aplicar máscara de data dd/mm/aaaa
  function maskDate(value) {
    // Remove tudo que não for número
    value = value.replace(/\D/g, '');
    // Adiciona a barra após o dia
    if (value.length > 2) value = value.slice(0,2) + '/' + value.slice(2);
    // Adiciona a barra após o mês
    if (value.length > 5) value = value.slice(0,5) + '/' + value.slice(5,9);
    // Limita a 10 caracteres
    return value.slice(0, 10);
  }

  // Função para checar se todos os campos obrigatórios estão preenchidos
  function isBemValido(bem) {
    return (
      bem.nome.trim() !== '' &&
      bem.numeroNota && bem.numeroNota.trim() !== '' &&
      bem.numeroPatrimonio && bem.numeroPatrimonio.trim() !== '' &&
      bem.valor && bem.valor.toString().trim() !== '' &&
      bem.dataAquisicao && bem.dataAquisicao.trim().length === 10 &&
      bem.inicioUso && bem.inicioUso.trim().length === 10 &&
      bem.status && bem.status.trim() !== '' &&
      bem.agencia && bem.agencia.trim() !== ''
    );
  }

  const handleBaixaClick = (bem) => {
    setBemParaBaixa(bem);
    setJustificativaBaixa('');
    setBaixaDialogOpen(true);
  };

  const handleConfirmarBaixa = () => {
    if (!bemParaBaixa || !justificativaBaixa.trim()) return;
    setBens(bens.map(bem => {
      if (bem.id === bemParaBaixa.id) {
        return {
          ...bem,
          status: 'Baixado',
          motivoBaixa: justificativaBaixa,
          dataBaixa: new Date().toLocaleString(),
        };
      }
      return bem;
    }));
    setBaixaDialogOpen(false);
    setBemParaBaixa(null);
    setJustificativaBaixa('');
  };

  const handleCancelarBaixa = () => {
    setBaixaDialogOpen(false);
    setBemParaBaixa(null);
    setJustificativaBaixa('');
  };

  // Função utilitária para extrair apenas a data (dd/mm/aaaa) de uma string de data completa
  function formatarDataApenasDia(dataString) {
    if (!dataString) return '';
    // Tenta extrair dd/mm/aaaa de data/hora local ou ISO
    const match = dataString.match(/\d{2}\/\d{2}\/\d{4}/);
    if (match) return match[0];
    // Se vier em outro formato, tenta converter
    const d = new Date(dataString);
    if (!isNaN(d)) {
      return d.toLocaleDateString('pt-BR');
    }
    return dataString;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5">Gestão de Bens</Typography>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Total de bens: {bensFiltrados.length}
            </Typography>
          </Box>
        </Box>
        {/* Filtros alinhados */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            select
            label="Status"
            value={statusFiltro}
            onChange={e => setStatusFiltro(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Ativo">Ativo</MenuItem>
            <MenuItem value="Em Manutenção">Em Manutenção</MenuItem>
            <MenuItem value="Baixado">Baixado</MenuItem>
          </TextField>
          <TextField
            label="Data de Aquisição"
            type="text"
            placeholder="dd/mm/aaaa"
            value={dataAquisicaoFiltro}
            onChange={e => setDataAquisicaoFiltro(e.target.value)}
            sx={{ minWidth: 160 }}
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            label="Início de Uso"
            type="text"
            placeholder="dd/mm/aaaa"
            value={inicioUsoFiltro}
            onChange={e => setInicioUsoFiltro(e.target.value)}
            sx={{ minWidth: 160 }}
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            label="Data de Baixa"
            type="text"
            placeholder="dd/mm/aaaa"
            value={dataBaixaFiltro}
            onChange={e => setDataBaixaFiltro(e.target.value)}
            sx={{ minWidth: 160 }}
            inputProps={{ maxLength: 10 }}
            disabled={statusFiltro !== 'Baixado'}
          />
          <TextField
            select
            label="Filtrar por Filial"
            value={agenciaFiltro}
            onChange={e => setAgenciaFiltro(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Todas</MenuItem>
            {filiais.map(filial => (
              <MenuItem key={filial.nome} value={filial.nome}>{filial.nome}</MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mt: 1 }}>
          <Stack direction="row" spacing={1}>
            {temPermissao('criar_bem') && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExport}
                >
                  Exportar
                </Button>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFile />}
                >
                  Importar
                  <input type="file" accept=".xlsx, .xls" hidden onChange={handleImport} />
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleClickOpen}
                >
                  Novo Bem
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Filial</TableCell>
              <TableCell>Número Patrimonial</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Início de uso</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Data da Baixa</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bensFiltrados.map((bem) => (
              <TableRow
                key={bem.id}
                style={bem.status === 'Baixado'
                  ? theme.palette.mode === 'dark'
                    ? { backgroundColor: '#3a2323', color: '#fff' }
                    : { backgroundColor: '#ffebee' }
                  : {}}
              >
                <TableCell style={bem.status === 'Baixado' && theme.palette.mode === 'dark' ? { color: '#fff' } : {}}>{bem.agencia}</TableCell>
                <TableCell style={bem.status === 'Baixado' && theme.palette.mode === 'dark' ? { color: '#fff' } : {}}>{bem.numeroPatrimonio}</TableCell>
                <TableCell style={bem.status === 'Baixado' && theme.palette.mode === 'dark' ? { color: '#fff' } : {}}>{bem.nome}</TableCell>
                <TableCell style={bem.status === 'Baixado' && theme.palette.mode === 'dark' ? { color: '#fff' } : {}}>{bem.status}</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} style={bem.status === 'Baixado' && theme.palette.mode === 'dark' ? { color: '#fff' } : {}}>{bem.inicioUso}</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} style={bem.status === 'Baixado' && theme.palette.mode === 'dark' ? { color: '#fff' } : {}}>
                  {bem.status === 'Baixado' && bem.dataBaixa ? formatarDataApenasDia(bem.dataBaixa) : ''}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(bem)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(bem)}>
                    <DeleteIcon />
                  </IconButton>
                  <Button size="small" onClick={() => handleTransferirBem(bem)} style={{ marginLeft: 8 }}>
                    Transferir
                  </Button>
                  {bem.status !== 'Baixado' && (
                    <Button size="small" color="error" variant="outlined" onClick={() => handleBaixaClick(bem)} style={{ marginLeft: 8 }}>
                      Baixa
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {bensFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">Nenhum bem cadastrado</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentBem.id ? 'Editar Bem' : 'Novo Bem'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nome"
                value={currentBem.nome}
                onChange={e => setCurrentBem({ ...currentBem, nome: e.target.value })}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Descrição"
                value={currentBem.descricao}
                onChange={e => setCurrentBem({ ...currentBem, descricao: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nº da nota"
                value={currentBem.numeroNota}
                onChange={e => setCurrentBem({ ...currentBem, numeroNota: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fornecedor"
                value={currentBem.fornecedor}
                onChange={e => setCurrentBem({ ...currentBem, fornecedor: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Número Patrimonial"
                value={currentBem.numeroPatrimonio}
                onChange={e => setCurrentBem({ ...currentBem, numeroPatrimonio: e.target.value })}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor"
                value={currentBem.valor}
                onChange={e => setCurrentBem({ ...currentBem, valor: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Início de uso"
                placeholder="dd/mm/aaaa"
                value={currentBem.inicioUso}
                onChange={e => setCurrentBem({ ...currentBem, inicioUso: maskDate(e.target.value) })}
                fullWidth
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data de Aquisição"
                placeholder="dd/mm/aaaa"
                value={currentBem.dataAquisicao}
                onChange={e => setCurrentBem({ ...currentBem, dataAquisicao: maskDate(e.target.value) })}
                fullWidth
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                value={currentBem.status}
                onChange={e => setCurrentBem({ ...currentBem, status: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="Ativo">Ativo</MenuItem>
                <MenuItem value="Baixado">Baixado</MenuItem>
                <MenuItem value="Em Manutenção">Em Manutenção</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Filial"
                value={currentBem.agencia}
                onChange={e => setCurrentBem({ ...currentBem, agencia: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              >
                {filiais.map(filial => (
                  <MenuItem key={filial.nome} value={filial.nome}>{filial.nome}</MenuItem>
                ))}
              </TextField>
            </Grid>
            {currentBem.status === 'Baixado' && currentBem.motivoBaixa && (
              <Grid item xs={12}>
                <Box
                  sx={theme.palette.mode === 'dark'
                    ? { mb: 2, p: 2, background: '#3a2323', borderRadius: 1, color: '#fff' }
                    : { mb: 2, p: 2, background: '#ffebee', borderRadius: 1 }}
                >
                  <Typography variant="subtitle2" color="error">Motivo da baixa:</Typography>
                  <Typography variant="body2" sx={theme.palette.mode === 'dark' ? { color: '#fff' } : {}}>{currentBem.motivoBaixa}</Typography>
                  {currentBem.dataBaixa && (
                    <Typography variant="caption" color="error">Data da baixa: {currentBem.dataBaixa}</Typography>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={!isBemValido(currentBem)}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      <TransferirBemModal
        open={transferirOpen}
        onClose={() => setTransferirOpen(false)}
        bem={bemParaTransferir || {agencia: ''}}
        onTransferir={realizarTransferencia}
      />
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Excluir Bem</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir este bem? Esta ação não pode ser desfeita.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined" color="error">Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Excluir</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={baixaDialogOpen} onClose={handleCancelarBaixa}>
        <DialogTitle>Dar baixa no bem</DialogTitle>
        <DialogContent>
          <TextField
            label="Justificativa de baixa"
            value={justificativaBaixa}
            onChange={e => setJustificativaBaixa(e.target.value)}
            fullWidth
            required
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelarBaixa} variant="outlined" color="error">Cancelar</Button>
          <Button onClick={handleConfirmarBaixa} variant="contained" color="error" disabled={!justificativaBaixa.trim()}>
            Confirmar baixa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Bens; 