import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Container, Box, Grid, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications-component/dist/theme.css';
import ZoneForm from './ZoneForm';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function CrudZ() {
  const [villes, setVilles] = useState([]);
  const [zones, setZones] = useState([]);
  const [refreshTables, setRefreshTables] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [editedZoneName, setEditedZoneName] = useState('');

  useEffect(() => {
    fetchData();
  }, [refreshTables]);

  const fetchData = async () => {
    try {
      const [villesResponse, zonesResponse] = await axios.all([
        axios.get('/api/ville/all'),
        axios.get('/api/zone/all'),
      ]);
      setVilles(villesResponse.data);
      setZones(zonesResponse.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteZone = (zoneId) => {
    axios
      .delete(`/api/zone/delete/${zoneId}`)
      .then(() => {
        setRefreshTables(true);
        NotificationManager.success('Done', 'Title', 3000);
      })
      .catch(() => {
        NotificationManager.error('cette pharmacie existe deja');
      });
  };

  const handleOpenEditModal = (zone) => {
    setSelectedZone(zone);
    setEditedZoneName(zone.nom);
    setEditModalOpen(true);
  };

  const handleEditZoneName = () => {
    axios
      .put(`/api/zone/update/${selectedZone.id}`, { nom: editedZoneName })
      .then(() => {
        setRefreshTables(true);
        setEditModalOpen(false);
        NotificationManager.success('Termine', 'Success');
      })
      .catch((error) => {
        console.error('Echec', error);
        NotificationManager.error('Echoue', 'Error');
      });
  };

  return (
    <Container sx={{ marginTop: '20px' }}>
      <NotificationContainer />
      <Box sx={{ width: '100%' }}>
        <Grid item xs={6}>
          <Item sx={{ alignItems: 'center', backgroundColor: 'lightgrey' }}>
            <ZoneForm onSuccess={() => setRefreshTables(true)} />
          </Item>
          <Box sx={{ margin: '16px 0' }}>
            <TableContainer component={Paper}>
              <Typography sx={{ marginRight: 'auto', color: 'black' }}>Liste des zones</Typography>
              <Table sx={{ minWidth: 400 }} aria-label="simple table">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'lightgrey' }}>
                    <TableCell sx={{ py: 0, lineHeight: '30px' }}>ID</TableCell>
                    <TableCell sx={{ py: 0, lineHeight: '30px' }}>Nom</TableCell>
                    <TableCell sx={{ py: 0, lineHeight: '30px' }}>Ville</TableCell>
                    <TableCell sx={{ py: 0, lineHeight: '30px' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell>{zone.id}</TableCell>
                      <TableCell>{zone.nom}</TableCell>
                      <TableCell>{zone.ville ? zone.ville.nom : ''}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenEditModal(zone)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteZone(zone.id)}
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

      {/* Edit zone modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Zone</DialogTitle>
        <DialogContent>
          <TextField
            id="edit-zone-name"
            label="Zone Name"
            variant="outlined"
            fullWidth
            value={editedZoneName}
            onChange={(e) => setEditedZoneName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleEditZoneName} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
