import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
    createBrowserRouter,
    RouterProvider,
    redirect
} from "react-router-dom";
import Login, { authLoader as loginAuthLoader } from './pages/Login'
import loginRedirectLoader from './pages/LoginRedirectLoader'
import Landing from './pages/Landing'
import Foods from './pages/food/Foods'
import Food from './pages/food/Food'
import EditFood from './pages/food/EditFood'
import CreateFood from './pages/food/CreateFood'
import Recipes from './pages/recipe/Recipes'
import Recipe from './pages/recipe/Recipe'
import EditRecipe from './pages/recipe/EditRecipe'
import CreateRecipe from './pages/recipe/CreateRecipe'
import RecipeQueue from './pages/RecipeQueue';

async function authLoader() {
    const res = await fetch("/.auth/me")
    const resJ = await res.json()
    const client = resJ.clientPrincipal
    if (client) {
        return client
    }
    return redirect('/login')
}

const router = createBrowserRouter([
{
    path: "/",
    element: <App/>,
    children: [
    {
        path: "login",
        element: <Login/>,
        loader: loginAuthLoader
    }, {
        path: "login/redirect",
        element: <></>,
        loader: loginRedirectLoader
    }, {
        index: true,
        path: "",
        element: <Landing/>,
        loader: authLoader
    }, {
        path: "foods",
        element: <Foods/>,
        loader: authLoader
    }, {
        path: "food/:id",
        element: <Food/>,
        loader: authLoader
    }, {
        path: "food/edit/:id",
        element: <EditFood/>,
        loader: authLoader
    }, {
        path: "food/create",
        element: <CreateFood/>,
        loader: authLoader
    }, {
        path: "recipes",
        element: <Recipes />,
        loader: authLoader
    }, {
        path: "recipe/:id",
        element: <Recipe/>,
        loader: authLoader
    }, {
        path: "recipe/edit/:id",
        element: <EditRecipe/>,
        loader: authLoader
    }, {
        path: "recipe/create",
        element: <CreateRecipe/>,
        loader: authLoader
    }, {
        path: "queue",
        element: <RecipeQueue/>,
        loader: authLoader
    }]
}])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
    <RouterProvider router={router} />
</React.StrictMode>
);
