import React, { createContext } from "react";
import App from "./components/App";
import { createRoot } from 'react-dom/client';

/// Imports de style
import "./css/cosmo.min.css"
import "./css/style.css"
import "./css/fontawesome.all.min.css"
import { BrowserRouter } from "react-router-dom";

export const myContext = createContext();

const root = createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>
);