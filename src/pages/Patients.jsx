import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientList from '../components/PatientList';
import PatientProfile from '../components/PatientProfile';

const Patients = () => {
  return (
    <Routes>
      <Route index element={<PatientList />} />
      <Route path=":id" element={<PatientProfile />} />
    </Routes>
  );
};

export default Patients;