import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import { AuthContextProvider } from './context/AuthContext.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

const element = document.getElementById('root');
const root = createRoot(element);


root.render(
    <React.StrictMode >
        <AuthContextProvider>
            <App/>
        </AuthContextProvider>
    </React.StrictMode>
);