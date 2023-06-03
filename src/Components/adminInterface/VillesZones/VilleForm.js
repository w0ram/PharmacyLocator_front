
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
export default function VilleForm() {
  const [villeNom, setVilleNom] = useState('');

  const handleVilleNomChange = (event) => {
    setVilleNom(event.target.value);
  };

  const handleAddVille = () => {

    axios
      .post('https://pharmacylocator-production.up.railway.app/api/ville/save', { nom: villeNom })
      .then((response) => {
      
        NotificationManager.success('Ajoutee');
       
        setVilleNom('');

      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error('Erreur', error);
      });
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > :not(style)': { m: 1, width: '100%' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField  label="Nom" variant="outlined" value={villeNom} onChange={handleVilleNomChange} />
      <Button variant="contained" onClick={handleAddVille}>Add</Button>
      <NotificationContainer />
    </Box>

  );
}