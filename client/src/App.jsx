
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux//store';
import Login from './components/user/Login';
import Register from './components/user//Register';
import Profile from './components/user/Profile';
import ProtectedRoute from './components/user/ProtectedRoute';
import AdminPannel from './components/admin/AdminPannel';
import AdminLogin from './components/admin/AdminLogin';


const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* admin */}

          <Route path='/admin' element={<AdminLogin/>}/>
          <Route path='/admin-pannel' element={<AdminPannel/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;