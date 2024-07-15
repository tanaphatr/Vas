import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App from './App.jsx'; 
import Frominv from './componant/Frominv.jsx';
import Invoicetable from './componant/Invoicetable.jsx'; 
import Login from './componant/login.jsx';
import Register from './componant/register.jsx';
import Quatationtable from './componant/quatationtable.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>  
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/InvoiceFrom" element={<Frominv />} />
        <Route path="/Invoicetable" element={<Invoicetable />} />
        <Route path="/Quatationtable" element={<Quatationtable />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
