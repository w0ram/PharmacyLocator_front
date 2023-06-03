import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Container, Box, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import VilleForm from './VilleForm';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Crud() {
  const [villes, setVilles] = useState([]);
  const [zones, setZones] = useState([]);
  const [refreshTables, setRefreshTables] = useState(false);
  const [selectedVille, setSelectedVille] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedVille, setEditedVille] = useState('');

  useEffect(() => {
    fetchData();
  }, [refreshTables]);

  const fetchData = async () => {
    try {
      const [villesResponse, zonesResponse] = await axios.all([
        axios.get('https://pharmacylocator-production.up.railway.app/api/ville/all'),
        axios.get('https://pharmacylocator-production.up.railway.app/api/zone/all'),
      ]);
      setVilles(villesResponse.data);
      setZones(zonesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleDeleteVille = (villeId) => {
    axios
      .delete(`https://pharmacylocator-production.up.railway.app/api/ville/delete/${villeId}`)
      .then(() => {
        setRefreshTables(true);
        NotificationManager.success('Supprimee');
      })
      .catch(() => {
        NotificationManager.error(
          'cette pharmacie existe deja'
        );
      });
  };
  const handleOpenEditModal = (ville) => {
    setSelectedVille(ville);
   setEditedVille(ville.nom);
    setEditModalOpen(true);
  };
  const handleEditVilleName = () => {
    axios
      .put(`https://pharmacylocator-production.up.railway.app/api/ville/update/${selectedVille.id}`, { nom: editedVille })
      .then(() => {
        setRefreshTables(true);
        setEditModalOpen(false);
        NotificationManager.success('Mise A jour avec succes', 'Success');
      })
      .catch((error) => {
        console.error('Echec:', error);
        NotificationManager.error('Echoue', 'Error');
      });
  };


  return (
    <Container sx={{ marginTop: '20px' }}>
      <NotificationContainer />
      <Box sx={{ width: '100%' }}>
        <Grid item xs={6}>
          <Item sx={{ alignItems: 'center', backgroundColor: 'lightgrey' }}>
            <VilleForm onSuccess={() => setRefreshTables(true)} />
          </Item>
          <Box sx={{ margin: '16px 0' }}>
            <Typography sx={{ marginRight: 'auto', color: 'black' }}>Liste des villes</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400 }} aria-label="simple table">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'lightgrey' }}>
                    <TableCell sx={{ py: 0, lineHeight: '30px' }}>ID</TableCell>
                    <TableCell sx={{ py: 0, lineHeight: '30px' }}>Nom</TableCell>
                    <TableCell sx={{ py: 0, lineHeight: '30px' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {villes.map((ville) => (
                    <TableRow key={ville.id}>
                      <TableCell>{ville.id}</TableCell>
                      <TableCell>{ville.nom}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenEditModal(ville)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteVille(ville.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Box>
      <Dialog open={editModalOpen} onClose={() =>setEditModalOpen(false)}>
        <DialogTitle>Edit Ville</DialogTitle>
        <DialogContent>
          <TextField
            label="Ville Name"
            value={editedVille}
            onChange={(e) => setEditedVille(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleEditVilleName}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
