import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function CardPharm({ selectedZone }) {
  const [pharmacies, setPharmacies] = useState([]);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    fetch("https://pharmacylocator-production.up.railway.app/api/pharmacie/all")
      .then((response) => response.json())
      .then((data) => setPharmacies(data));

    fetch("/api/zone/all")
      .then((response) => response.json())
      .then((data) => setZones(data));
  }, []);

  const getZoneName = (zoneId) => {
    const zone = zones.find((zone) => zone.id === zoneId);
    return zone ? zone.nom : "";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {pharmacies
        .filter((pharmacy) => {
          if (selectedZone && selectedZone.nom !== "") {
            return getZoneName(pharmacy.zone.id) === selectedZone.nom;
          }
          return true;
        })
        .map((pharmacy) => (
          <Card
            key={pharmacy.id}
            sx={{
              width: '75%',
              maxWidth: 'none',
              marginBottom: '20px',
              border: 1,
              padding: 2,
              display: 'flex',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.4)'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, marginRight:'15px' }}>
              <CardHeader title={pharmacy.nom} />
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '10px' }}>
                  Address: {pharmacy.adress}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '10px' }}>
                  Located in: {getZoneName(pharmacy.zone.id)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pharmacy['Textes complets']}
                </Typography>
              </CardContent>
              <Box sx={{ flex: 1 }}>
              <CardMedia component="img" height="300" image={pharmacy.image} />
            </Box>
            </Box>
           
            <Box sx={{ flex: 1 }}>
              <CardMedia
                component="iframe"
                title="Google Maps"
                height="500"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${pharmacy.latitude},${pharmacy.longitude}&hl=es;&output=embed`}
                allowFullScreen
              />
            </Box>
          </Card>
        ))}
    </div>
  );
}
