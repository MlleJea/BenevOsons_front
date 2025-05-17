import React, { createContext } from "react";
import App from "./App";
import { createRoot } from 'react-dom/client';

/// Imports de style
import "@styles/cosmo.min.css"
import "@styles/style.css"
import "@styles/fontawesome.all.min.css"
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