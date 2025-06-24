import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid, FormControlLabel,
  Checkbox, Typography
} from '@mui/material';
import { useFiliais } from '../../context/FiliaisContext';

function TransferirBemModal({ open, onClose, bem, onTransferir }) {
  const { filiais, adicionarFilial } = useFiliais();
  const [agenciaDestino, setAgenciaDestino] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [observacao, setObservacao] = useState('');
  const [isBaixa, setIsBaixa] = useState(false);
  const [motivoBaixa, setMotivoBaixa] = useState('');
  const [motivoDialogOpen, setMotivoDialogOpen] = useState(false);
  const [novaFilialOpen, setNovaFilialOpen] = useState(false);
  const [novaFilial, setNovaFilial] = useState({ nome: '', endereco: '', contato: '', cidade: '', cep: '' });
  const [erroFilial, setErroFilial] = useState('');

  const handleTransferir = () => {
    if (isBaixa) {
      setMotivoDialogOpen(true);
      return;
    }
    if (agenciaDestino === "__nova__") {
      setNovaFilialOpen(true);
      return;
    }
    onTransferir({
      agenciaDestino,
      responsavel,
      observacao,
      isBaixa: false
    });
    setAgenciaDestino('');
    setResponsavel('');
    setObservacao('');
    setIsBaixa(false);
  };

  const handleConfirmMotivo = () => {
    if (!motivoBaixa.trim()) return;
    onTransferir({
      agenciaDestino: 'BAIXA',
      responsavel,
      observacao,
      isBaixa: true,
      motivoBaixa,
      dataBaixa: new Date().toLocaleString()
    });
    setMotivoDialogOpen(false);
    setMotivoBaixa('');
    setAgenciaDestino('');
    setResponsavel('');
    setObservacao('');
    setIsBaixa(false);
  };

  const handleCancelMotivo = () => {
    setMotivoDialogOpen(false);
    setMotivoBaixa('');
  };

  const handleSalvarNovaFilial = () => {
    setErroFilial('');
    if (!novaFilial.nome.trim()) {
      setErroFilial('Digite o nome da filial');
      return;
    }
    if (filiais.some(f => f.nome === novaFilial.nome.trim())) {
      setErroFilial('Filial já cadastrada');
      return;
    }
    const nova = { ...novaFilial, nome: novaFilial.nome.trim() };
    adicionarFilial(nova);
    setAgenciaDestino(nova.nome);
    setNovaFilial({ nome: '', endereco: '', contato: '', cidade: '', cep: '' });
    setNovaFilialOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Transferir Bem</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isBaixa}
                  onChange={(e) => setIsBaixa(e.target.checked)}
                />
              }
              label="Dar baixa no bem"
            />
          </Grid>
          {!isBaixa && (
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Filial de Destino"
                value={agenciaDestino}
                onChange={e => setAgenciaDestino(e.target.value)}
              >
                {filiais.filter(ag => ag.nome !== bem.agencia).map(ag => (
                  <MenuItem key={ag.nome} value={ag.nome}>{ag.nome}</MenuItem>
                ))}
                <MenuItem value="__nova__">Cadastrar nova filial...</MenuItem>
              </TextField>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Responsável"
              value={responsavel}
              onChange={e => setResponsavel(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Observação"
              multiline
              rows={3}
              value={observacao}
              onChange={e => setObservacao(e.target.value)}
              required
            />
          </Grid>
          {isBaixa && (
            <Grid item xs={12}>
              <Typography variant="body2" color="error">
                Atenção: Ao dar baixa no bem, ele será removido do valor total do patrimônio.
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="error">Cancelar</Button>
        <Button 
          onClick={handleTransferir} 
          variant="contained" 
          disabled={!responsavel || !observacao || (!isBaixa && !agenciaDestino)}
        >
          {isBaixa ? 'Confirmar Baixa' : 'Transferir'}
        </Button>
      </DialogActions>
      <Dialog open={motivoDialogOpen} onClose={handleCancelMotivo}>
        <DialogTitle>Motivo da Baixa</DialogTitle>
        <DialogContent>
          <TextField
            label="Motivo da baixa"
            value={motivoBaixa}
            onChange={e => setMotivoBaixa(e.target.value)}
            fullWidth
            required
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelMotivo} variant="outlined" color="error">Cancelar</Button>
          <Button onClick={handleConfirmMotivo} variant="contained" disabled={!motivoBaixa.trim()}>Confirmar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={novaFilialOpen} onClose={() => setNovaFilialOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Nova Filial</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Nome da Filial"
                value={novaFilial.nome}
                onChange={e => setNovaFilial({ ...novaFilial, nome: e.target.value })}
                fullWidth
                required
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Endereço"
                value={novaFilial.endereco}
                onChange={e => setNovaFilial({ ...novaFilial, endereco: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contato"
                value={novaFilial.contato}
                onChange={e => setNovaFilial({ ...novaFilial, contato: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cidade"
                value={novaFilial.cidade}
                onChange={e => setNovaFilial({ ...novaFilial, cidade: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="CEP"
                value={novaFilial.cep}
                onChange={e => setNovaFilial({ ...novaFilial, cep: e.target.value })}
                fullWidth
              />
            </Grid>
            {erroFilial && (
              <Grid item xs={12}>
                <Typography color="error">{erroFilial}</Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNovaFilialOpen(false)} variant="outlined" color="error">Cancelar</Button>
          <Button onClick={handleSalvarNovaFilial} variant="contained">Adicionar</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

export default TransferirBemModal; 