import React from 'react';
import ReactDOM from 'react-dom/client';
import { mainRoutes,adminRoutes } from './routes';
import {BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import App from './App';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router >
    <Routes>
      <Route  path="/admin" element={ < App /> } >
        {
          adminRoutes.map( (route,index) => {
            if(index === 0 ){
              return <Route key={route.path} path={route.path} index element={route.element} />
            }else{
              return <Route key={route.path} path={route.path} element={route.element} />
            }
          })
        }
      </Route>
      {
        mainRoutes.map(route => {
          return <Route key={route.id} id={route.id} path={route.path} element={route.element} />
        })
      }  
      <Route path="*" element={<Navigate to="/404" />} /> 
    </Routes>
  </Router >
);


