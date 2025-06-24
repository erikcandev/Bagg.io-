import React from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { useConferencias } from '../../context/ConferenciasContext';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../context/AuthContext';

function Conferencias() {
  const { conferencias } = useConferencias();
  const navigate = useNavigate();
  const { temPermissao } = useAuth();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Conferências de Patrimônio</Typography>
        {temPermissao('criar_conferencia') && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/conferencias/nova')}>
            Nova Conferência
          </Button>
        )}
      </Box>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Filial</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conferencias.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">Nenhuma conferência cadastrada</TableCell>
                </TableRow>
              )}
              {conferencias.map(conf => (
                <TableRow key={conf.id}>
                  <TableCell>{conf.filial}</TableCell>
                  <TableCell>{conf.data}</TableCell>
                  <TableCell>{conf.usuario}</TableCell>
                  <TableCell>
                    <Chip
                      label={conf.status}
                      color={conf.status === 'Concluída' ? 'success' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" size="small" onClick={() => navigate(`/conferencias/${conf.id}`)}>
                      Visualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default Conferencias; 