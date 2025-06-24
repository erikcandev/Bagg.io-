import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

function Usuarios() {
  const { usuarioLogado, usuarios, cadastrarUsuario, editarUsuario, removerUsuario } = useAuth();
  const isAdmin = usuarioLogado?.cargo === 'admin';
  const isGestor = usuarioLogado?.cargo === 'gestor';

  const [open, setOpen] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [usuarioAtual, setUsuarioAtual] = useState({
    nome: '',
    email: '',
    cargo: 'user',
    senha: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);

  const handleOpen = () => {
    setUsuarioAtual({
      nome: '',
      email: '',
      cargo: 'user',
      senha: ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErro('');
    setSucesso('');
  };

  const handleEdit = (usuario) => {
    setUsuarioAtual({
      ...usuario,
      senha: '' // Não preenchemos a senha ao editar
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    setUsuarioParaExcluir(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    removerUsuario(usuarioParaExcluir);
    setDeleteDialogOpen(false);
    setUsuarioParaExcluir(null);
    setSucesso('Usuário removido com sucesso');
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUsuarioParaExcluir(null);
  };

  const handleSubmit = () => {
    setErro('');
    setSucesso('');

    if (!usuarioAtual.nome || !usuarioAtual.email) {
      setErro('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!usuarioAtual.id && !usuarioAtual.senha) {
      setErro('A senha é obrigatória para novos usuários');
      return;
    }

    try {
      if (usuarioAtual.id) {
        editarUsuario(usuarioAtual);
        setSucesso('Usuário atualizado com sucesso');
      } else {
        cadastrarUsuario(usuarioAtual);
        setSucesso('Usuário cadastrado com sucesso');
      }
      handleClose();
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Usuários</Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
            Novo Usuário
          </Button>
        )}
      </Box>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map(usuario => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.cargo === 'admin' ? 'Administrador' : usuario.cargo === 'gestor' ? 'Gestor' : 'Usuário'}</TableCell>
                <TableCell>
                  {isAdmin && (
                    <>
                      <IconButton onClick={() => handleEdit(usuario)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(usuario.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {usuarioAtual.id ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome"
              value={usuarioAtual.nome}
              onChange={e => setUsuarioAtual({ ...usuarioAtual, nome: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="E-mail"
              type="email"
              value={usuarioAtual.email}
              onChange={e => setUsuarioAtual({ ...usuarioAtual, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Senha"
              type="password"
              value={usuarioAtual.senha}
              onChange={e => setUsuarioAtual({ ...usuarioAtual, senha: e.target.value })}
              fullWidth
              required={!usuarioAtual.id}
              helperText={usuarioAtual.id ? "Deixe em branco para manter a senha atual" : ""}
            />
            <TextField
              select
              label="Cargo"
              value={usuarioAtual.cargo}
              onChange={e => setUsuarioAtual({ ...usuarioAtual, cargo: e.target.value })}
              fullWidth
            >
              <MenuItem value="user">Usuário</MenuItem>
              <MenuItem value="gestor">Gestor</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {usuarioAtual.id ? 'Salvar' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Excluir Usuário</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined" color="error">Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Excluir</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Usuarios; 