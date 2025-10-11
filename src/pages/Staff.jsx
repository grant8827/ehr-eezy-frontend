import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffList from '../components/StaffList';
import StaffProfile from '../components/StaffProfile';

const Staff = () => {
  return (
    <Routes>
      <Route index element={<StaffList />} />
      <Route path=":id" element={<StaffProfile />} />
    </Routes>
  );
};

export default Staff;