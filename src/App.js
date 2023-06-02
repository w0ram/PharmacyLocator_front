import React from 'react';
import StickyFooter from './Components/Footer';
import ResponsiveAppBar from './Components/Header';
import Grouped from './Components/UserInterface/main';
import { Route, Routes } from 'react-router-dom';
import Crud from './Components/adminInterface/VillesZones/CrudVille';
import CrudPharmacy from './Components/adminInterface/Pharmacies/CrudPharmacies';
import SignIn from './Components/adminInterface/Users/loginForm';
import CrudZ from './Components/adminInterface/VillesZones/CrudZones';



function App() {


  return (
    <div>
<ResponsiveAppBar/>
    <Routes>
      <Route path="/" element={<SignIn />} />
    </Routes>
  
    <Routes>
      <Route path="/Acceuil" element={<Grouped />} />
      <Route path="/Villes" element={<Crud />} />
      <Route path="/Zones" element={<CrudZ />} />
      <Route path="/Pharmacies" element={<CrudPharmacy />} />
    
    </Routes>
  
    <StickyFooter />
  </div>
  
  );
}


export default App;
