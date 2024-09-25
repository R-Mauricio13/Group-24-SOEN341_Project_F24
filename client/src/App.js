import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/home_page'
import Introduction from './Pages/Introduction'
import Login from './Pages/Login'

import "bootstrap/dist/css/bootstrap.min.css";
// import Resources from './Resources';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/introduction" element={<Introduction />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/resources" element={<Resources />} /> */}
    </Routes>
  );
}

export default App;