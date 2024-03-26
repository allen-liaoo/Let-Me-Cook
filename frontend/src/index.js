import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Landing from './pages/Landing'
import Ingredients from './pages/Ingredients'
import Food from './pages/Food'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        index: true,
        path: "",
        element: <Landing/>
      }, {
        path: "/ingredients",
        element: <Ingredients/>
      }, {
        path: "/food",
        element: <Food/>
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
