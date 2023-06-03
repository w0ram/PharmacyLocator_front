import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Upload } from 'antd';

import Autocomplete from '@mui/material/Autocomplete';

import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications-component/dist/theme.css';

import { Container, Typography } from '@mui/material';
export default function PharmacyForm() {


  const [file, setFile] = useState(null);

  const [pharmacyInfo, setPharmacyInfo] = useState({
    nom: '',
    latitude: '',
    longitude: '',
    adress: '',
    image: null,
    zone: null, // Add the zone property
  });
  const [zones, setZones] = useState([]);
  useEffect(() => {
    // Fetch all zones from the API using Axios
    axios
      .get('https://pharmacylocator-production.up.railway.app/api/zone/all')
      .then(response => {
        setZones(response.data);
      })
      .catch(error => {

      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPharmacyInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };
  const handleZoneChange = (event, newValue) => {
    setPharmacyInfo((prevInfo) => ({
      ...prevInfo,
      zone: newValue,
    }));
  };
  const handleAddPharmacy = () => {
    if (
      !pharmacyInfo.nom ||
      !pharmacyInfo.latitude ||
      !pharmacyInfo.longitude ||
      !pharmacyInfo.adress ||
      !pharmacyInfo.zone
    ) {
  
      NotificationManager.warning('Tous les champs sont obligatoires');
      return;
    }

    const updatedPharmacyInfo = {
      ...pharmacyInfo,
      image: file,
    };


    console.log(updatedPharmacyInfo);
    console.log(file);
    axios
      .post('https://pharmacylocator-production.up.railway.app/api/pharmacie/save', updatedPharmacyInfo)
      .then((response) => {

        NotificationManager.success('bien ajoutée', 3000);
        setPharmacyInfo({
          nom: '',
          latitude: '',
          longitude: '',
          adress: '',
          image: '',
          zone: '',
        });
      })
      .catch((error) => {
        NotificationManager.error('Echec!', 'Echec', 3000);

      });
  };

  const handleAddPharmacyClick = () => {
    handleAddPharmacy(pharmacyInfo);
  };


  return (
    <Container sx={{ marginTop: '20px' }}>
      <Box
        component="form"
        sx={{

          alignItems: 'center',
          '& > :not(style)': { m: 1, width: '100%' },
          border: '10px',
          borderColor: 'black',
          borderStyle: ''

        }}
        noValidate
        autoComplete="off"
      >


        <TextField
          id="outlined-nom"
          name="nom"
          label="Nom"
          variant="outlined"
          value={pharmacyInfo.nom}
          onChange={handleInputChange}
          required
        />
        <TextField
          id="outlined-latitude"
          name="latitude"
          label="Latitude"
          variant="outlined"
          value={pharmacyInfo.latitude}
          onChange={handleInputChange}
          required
        />
        <TextField
          id="outlined-longitude"
          name="longitude"
          label="Longitude"
          variant="outlined"
          value={pharmacyInfo.longitude}
          onChange={handleInputChange}
          required
        />
        <TextField
          id="outlined-address"
          name="adress"
          label="Address"
          variant="outlined"
          value={pharmacyInfo.adress}
          onChange={handleInputChange}
          required
        />
        <Upload name="image"
          id="image"
          maxCount={1}
          listType="picture"
          action="http://localhost:3000/Pharmacie"
          accept=".png,.PNG,.JPEG,.jpeg,.jpg"

          beforeUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target.result;
              console.log(dataUrl);
              setFile(dataUrl);
            };
            reader.readAsDataURL(file);
            return false;
          }}>
          <Typography>Telecharger Image : </Typography>
          <Button variant="contained" sx={{ width: '100%' }} >Upload</Button>
        </Upload>

        <Autocomplete
          id="zone-autocomplete"
          options={zones}
          getOptionLabel={(option) => option.nom} // Use the "nom" property as the label value
          value={pharmacyInfo.zone}
          onChange={handleZoneChange}
          renderInput={(params) => <TextField {...params} label="Zone" />}
          required
        />


        <Button variant="contained" onClick={handleAddPharmacyClick}>
          Ajouter
        </Button>
        <NotificationContainer />
      </Box>

    </Container>
  );
}
