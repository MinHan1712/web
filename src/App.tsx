import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import AppLayout from './pages/AppLayout';
import routes from './router';
import { setAuth, setDrgGroup, setDrgKind, setDrugDescription, setExportType, setImportType, setInvSource, setPaymentMethods, setRoles, setUnits } from './utils/local';
import './App.css';
import './assets/css/nav.css';
import './assets/css/style.css';
import Login from './pages/Login';
import Register from './pages/register';
import { KEY_LOCAL_STORAGE } from './constants/general.constant';

function App() {
  useEffect(() => {
    setImportType();
    setExportType();
    setPaymentMethods();
    setInvSource();
    setUnits();
    setRoles();
    setDrgGroup();
    setDrgKind();
    setDrugDescription();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/dangnhap' element={<Login />} />
        <Route path='/dangky' element={<Register />} />
        <Route path="/" element={<AppLayout />}>

          {routes.map((route, index) =>
            route.index ? (
              <Route index key={index} element={route.element} path={route.path} />
            ) : (
              <Route
                index={route.index}
                path={route.path}
                key={index}
                element={route.element}
              />
            )
          )}
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;

