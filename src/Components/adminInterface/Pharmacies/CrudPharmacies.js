import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Container, Box, Grid, Typography, Button, IconButton } from '@mui/material';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PharmacyForm from './PharmacieForm';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function CrudPharmacy() {
  // MODAL CONSTS
  const [open1, setOpen1] = React.useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openD, setOpenD] = React.useState(false);
  const handleClickOpenDelete = () => {
    setOpenD(true);
  };

  const handleCloseDelete = () => {
    setOpenD(false);
  };
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  // FETCHING DATA IN TABLES FUNCTION
  const [pharmacies, setPharmacies] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [allZones, setAllZones] = useState([]);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for pharmacies from Spring API using Axios
        const pharmaciesResponse = await axios.get('https://pharmacylocator-production.up.railway.app/api/pharmacie/all');
        setPharmacies(pharmaciesResponse.data);

        // Fetch data for zones from Spring API using Axios
        const zonesResponse = await axios.get('https://pharmacylocator-production.up.railway.app/api/zone/all');
        setZones(zonesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const pharmaciesResponse = await axios.get('https://pharmacylocator-production.up.railway.app/api/pharmacie/all');
      setPharmacies(pharmaciesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handlePharmacyAdded = () => {
    fetchPharmacies();
  };
  const getZoneName = (zoneId) => {
    const zone = zones.find((zone) => zone.id === zoneId);
    return zone ? zone.nom : '';
  };

  const deletePharmacy = async (pharmacyId) => {
    try {
      await axios.delete(`/api/pharmacie/delete/${pharmacyId}`);
      // Fetch updated data for pharmacies after deletion
      const pharmaciesResponse = await axios.get('https://pharmacylocator-production.up.railway.app/api/pharmacie/all');
      setPharmacies(pharmaciesResponse.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };



  return (
    <Container sx={{ marginTop: '20px' }}>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item lg={12} xs={10}>
            <PharmacyForm />
          </Grid>
          <Grid item lg={12} xs={10}>
            <Typography sx={{ marginRight: 'auto', color: 'black' }}>Liste des Pharmacies</Typography>
            <Box sx={{ margin: '16px 0' }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 400 }} aria-label="simple table">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'lightgrey' }}>
                      <TableCell sx={{ py: 0, lineHeight: '30px' }}>ID</TableCell>
                      <TableCell sx={{ py: 0, lineHeight: '30px' }}>Nom</TableCell>
                      <TableCell sx={{ py: 0, lineHeight: '30px' }}>Adresse</TableCell>
                      <TableCell sx={{ py: 0, lineHeight: '30px' }}>Latitude</TableCell>
                      <TableCell sx={{ py: 0, lineHeight: '30px' }}>Longitude</TableCell>
                      <TableCell sx={{ py: 0, lineHeight: '30px' }}>Zone</TableCell>
                      <TableCell sx={{ py: 0, lineHeight: '30px' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pharmacies.map((pharmacy) => (
                      <TableRow key={pharmacy.id}>
                        <TableCell>{pharmacy.id}</TableCell>
                        <TableCell>{pharmacy.nom}</TableCell>
                        <TableCell>{pharmacy.adress}</TableCell>
                        <TableCell>{pharmacy.latitude}</TableCell>
                        <TableCell>{pharmacy.longitude}</TableCell>
                        <TableCell>{getZoneName(pharmacy.zone.id)}</TableCell>
                        <TableCell>
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => deletePharmacy(pharmacy.id)}>
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
        </Grid>
      </Box>
    </Container>
  );
}
