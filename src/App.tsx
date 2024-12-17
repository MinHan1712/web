import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routes from './router';
import AppLayout from './pages/AppLayout';
import { useEffect } from 'react';
import commonApi from './apis/common.api';

function App() {
  // useEffect(() => {
  //   let properties = JSON.parse(localStorage.getItem("properties") || "[]")
  //   if(properties === null || properties.length === 0){
  //     commonApi.getProperties();
  //   }
  // }, []);

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
