import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AppLayout from './pages/AppLayout';
import routes from './router';
import { setExportType, setImportType, setInvSource, setPaymentMethods, setUnits } from './utils/local';

function App() {
  useEffect(() => {
    setImportType();
    setExportType();
    setPaymentMethods();
    setInvSource();
    setUnits();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
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

