import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import CardPharm from './pharmacyCard';

export default function Grouped() {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');

    axios
      .get('/api/zone/all', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        setZones(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleZoneChange = (event, value) => {
    setSelectedZone(value);
  };

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px', justifyContent: 'center', alignItems: 'center' }}>
        <Autocomplete
          id="zones-autocomplete"
          options={zones}
          sx={{ width: '75%', margin: '15px', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.4)' }}
          getOptionLabel={option => option.nom || ''}
          onChange={handleZoneChange}
          renderInput={params => (
            <TextField {...params} label="Zones" variant="outlined" />
          )}
          renderOption={(props, option) => (
            <li {...props} style={{ color: 'black' }}>
              {option.nom}
            </li>
          )}
        />
      </div>
      <CardPharm selectedZone={selectedZone} />
    </>
  );
}
