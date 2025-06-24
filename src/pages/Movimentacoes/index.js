import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useMovimentacoes } from '../../context/MovimentacoesContext';
import { useBens } from '../../context/BensContext';

function Movimentacoes() {
  const { movimentacoes } = useMovimentacoes();
  const { bens } = useBens();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Histórico de Transferências</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Bem</TableCell>
              <TableCell>Número Patrimonial</TableCell>
              <TableCell>Origem</TableCell>
              <TableCell>Destino</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Observação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movimentacoes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">Nenhuma transferência registrada</TableCell>
              </TableRow>
            )}
            {movimentacoes.map((mov) => (
              <TableRow key={mov.id}>
                <TableCell>{mov.dataMovimentacao}</TableCell>
                <TableCell>{mov.nomeBem}</TableCell>
                <TableCell>{mov.numeroPatrimonio}</TableCell>
                <TableCell>{mov.origem}</TableCell>
                <TableCell>{mov.destino}</TableCell>
                <TableCell>{mov.responsavel}</TableCell>
                <TableCell>{mov.observacao}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Movimentacoes; 