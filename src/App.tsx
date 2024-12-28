import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './pages/AppLayout';
import routes from './router';
import { setExportType, setImportType, setInvSource, setPaymentMethods, setRoles, setUnits } from './utils/local';
import './App.css';
import './assets/css/nav.css';
import './assets/css/page.css';
import './assets/css/style.css';
import Login from './pages/Login';
import Register from './pages/register';

function App() {
  useEffect(() => {
    setImportType();
    setExportType();
    setPaymentMethods();
    setInvSource();
    setUnits();
    setRoles();
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

