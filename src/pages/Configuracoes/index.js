import React, { useState } from 'react';
import { Box, Typography, Paper, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, ListItemSecondaryAction, Alert, Chip, MenuItem } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import { useFiliais } from '../../context/FiliaisContext';
import { useAuth } from '../../context/AuthContext';
import { Box as MuiBox } from '@mui/material';
import { useBens } from '../../context/BensContext';

function Configuracoes() {
  const { filiais, adicionarFilial, setFiliais } = useFiliais();
  const { bens, setBens } = useBens();
  const { usuarioLogado } = useAuth();
  const isAdmin = usuarioLogado && usuarioLogado.cargo === 'admin';

  const [open, setOpen] = useState(false);
  const [novaFilial, setNovaFilial] = useState({ nome: '', endereco: '', contato: '', cidade: '', cep: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState({ nome: '', endereco: '', contato: '', cidade: '', cep: '' });
  const [erro, setErro] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filialParaExcluir, setFilialParaExcluir] = useState(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [bensParaTransferir, setBensParaTransferir] = useState([]);
  const [destinos, setDestinos] = useState({});
  const [destinoGlobal, setDestinoGlobal] = useState('');

  // Adicionar filial
  const handleAdd = () => {
    setErro('');
    if (!novaFilial.nome.trim()) {
      setErro('Digite o nome da filial');
      return;
    }
    if (filiais.some(f => f.nome === novaFilial.nome.trim())) {
      setErro('Filial já cadastrada');
      return;
    }
    adicionarFilial({ ...novaFilial, nome: novaFilial.nome.trim() });
    setNovaFilial({ nome: '', endereco: '', contato: '', cidade: '', cep: '' });
    setOpen(false);
  };

  // Editar filial (apenas nome, não remove bens já vinculados)
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(filiais[index]);
  };
  const handleSaveEdit = () => {
    if (!editValue.nome.trim()) return;
    if (filiais.some((f, idx) => f.nome === editValue.nome.trim() && idx !== editIndex)) {
      setErro('Filial já cadastrada');
      return;
    }
    const novasFiliais = [...filiais];
    novasFiliais[editIndex] = { ...editValue, nome: editValue.nome.trim() };
    setFiliais(novasFiliais);
    setEditIndex(null);
    setEditValue({ nome: '', endereco: '', contato: '', cidade: '', cep: '' });
  };
  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditValue({ nome: '', endereco: '', contato: '', cidade: '', cep: '' });
  };

  // Remover filial (apenas se não houver bens vinculados)
  const handleRemove = (index) => {
    setFilialParaExcluir(index);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = () => {
    const filial = filiais[filialParaExcluir];
    const bensVinculados = bens.filter(bem => bem.agencia === filial.nome);
    if (bensVinculados.length > 0) {
      setBensParaTransferir(bensVinculados);
      setDestinos(Object.fromEntries(bensVinculados.map(b => [b.id, ''])));
      setDestinoGlobal('');
      setDeleteDialogOpen(false);
      setTransferModalOpen(true);
      return;
    }
    setFiliais(filiais.filter((_, idx) => idx !== filialParaExcluir));
    setDeleteDialogOpen(false);
    setFilialParaExcluir(null);
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setFilialParaExcluir(null);
  };

  const handleTransferirTodos = () => {
    if (!destinoGlobal) return;
    const novosDestinos = { ...destinos };
    bensParaTransferir.forEach(bem => {
      novosDestinos[bem.id] = destinoGlobal;
    });
    setDestinos(novosDestinos);
  };
  const handleTransferirConfirm = () => {
    if (Object.values(destinos).some(dest => !dest)) return;
    setBens(bens.map(bem => {
      if (bensParaTransferir.some(b => b.id === bem.id)) {
        return { ...bem, agencia: destinos[bem.id] };
      }
      return bem;
    }));
    setFiliais(filiais.filter((_, idx) => idx !== filialParaExcluir));
    setTransferModalOpen(false);
    setFilialParaExcluir(null);
    setBensParaTransferir([]);
    setDestinos({});
    setDestinoGlobal('');
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Configurações</Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Gestão de Filiais</Typography>
          {isAdmin && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
              Nova Filial
            </Button>
          )}
        </Box>
        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        <List>
          {filiais.map((filial, idx) => (
            <ListItem key={filial.nome || idx} divider>
              {editIndex === idx ? (
                <>
                  <TextField value={editValue.nome} onChange={e => setEditValue({ ...editValue, nome: e.target.value })} size="small" sx={{ mr: 1 }} label="Nome" />
                  <TextField value={editValue.endereco} onChange={e => setEditValue({ ...editValue, endereco: e.target.value })} size="small" sx={{ mr: 1 }} label="Endereço" />
                  <TextField value={editValue.contato} onChange={e => setEditValue({ ...editValue, contato: e.target.value })} size="small" sx={{ mr: 1 }} label="Contato" />
                  <TextField value={editValue.cidade} onChange={e => setEditValue({ ...editValue, cidade: e.target.value })} size="small" sx={{ mr: 1 }} label="Cidade" />
                  <TextField value={editValue.cep} onChange={e => setEditValue({ ...editValue, cep: e.target.value })} size="small" sx={{ mr: 1 }} label="CEP" />
                  <IconButton onClick={handleSaveEdit} color="primary"><SaveIcon /></IconButton>
                  <IconButton onClick={handleCancelEdit}><CloseIcon /></IconButton>
                </>
              ) : (
                <>
                  <ListItemText
                    primary={
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {filial.nome}
                        {idx === 0 && (
                          <Chip label="Sede" color="primary" size="small" sx={{ ml: 1 }} />
                        )}
                      </MuiBox>
                    }
                    secondary={
                      <>
                        {filial.endereco && <span>Endereço: {filial.endereco} | </span>}
                        {filial.contato && <span>Contato: {filial.contato} | </span>}
                        {filial.cidade && <span>Cidade: {filial.cidade} | </span>}
                        {filial.cep && <span>CEP: {filial.cep}</span>}
                      </>
                    }
                  />
                  {isAdmin && (
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleEdit(idx)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleRemove(idx)}><DeleteIcon /></IconButton>
                    </ListItemSecondaryAction>
                  )}
                </>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Nova Filial</DialogTitle>
        <DialogContent>
          <TextField label="Nome da Filial" value={novaFilial.nome} onChange={e => setNovaFilial({ ...novaFilial, nome: e.target.value })} fullWidth margin="normal" />
          <TextField label="Endereço" value={novaFilial.endereco} onChange={e => setNovaFilial({ ...novaFilial, endereco: e.target.value })} fullWidth margin="normal" />
          <TextField label="Contato" value={novaFilial.contato} onChange={e => setNovaFilial({ ...novaFilial, contato: e.target.value })} fullWidth margin="normal" />
          <TextField label="Cidade" value={novaFilial.cidade} onChange={e => setNovaFilial({ ...novaFilial, cidade: e.target.value })} fullWidth margin="normal" />
          <TextField label="CEP" value={novaFilial.cep} onChange={e => setNovaFilial({ ...novaFilial, cep: e.target.value })} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined" color="error">Cancelar</Button>
          <Button onClick={handleAdd} variant="contained">Adicionar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Excluir Filial</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir esta filial? Esta ação não pode ser desfeita.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined" color="error">Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Excluir</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={transferModalOpen} onClose={() => setTransferModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Transferir bens da filial</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>Esta filial possui bens vinculados. Transfira todos para outras filiais antes de excluir.</Typography>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              label="Transferir todos para"
              value={destinoGlobal}
              onChange={e => setDestinoGlobal(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Selecione</MenuItem>
              {filiais.filter((_, idx) => idx !== filialParaExcluir).map(filial => (
                <MenuItem key={filial.nome} value={filial.nome}>{filial.nome}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" color="primary" onClick={handleTransferirTodos} disabled={!destinoGlobal}>
              Transferir todos
            </Button>
          </Box>
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {bensParaTransferir.map(bem => (
              <Paper key={bem.id} sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }} variant="outlined">
                <Box sx={{ flex: 1 }}>
                  <Typography><b>{bem.nome}</b> (Patrimônio: {bem.numeroPatrimonio})</Typography>
                </Box>
                <TextField
                  select
                  label="Filial de destino"
                  value={destinos[bem.id] || ''}
                  onChange={e => setDestinos({ ...destinos, [bem.id]: e.target.value })}
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value="">Selecione</MenuItem>
                  {filiais.filter((_, idx) => idx !== filialParaExcluir).map(filial => (
                    <MenuItem key={filial.nome} value={filial.nome}>{filial.nome}</MenuItem>
                  ))}
                </TextField>
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferModalOpen(false)} variant="outlined" color="error">Cancelar</Button>
          <Button onClick={handleTransferirConfirm} variant="contained" disabled={Object.values(destinos).some(dest => !destinos || !dest)}>
            Transferir e Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Configuracoes; 