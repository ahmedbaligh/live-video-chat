import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { theme } from './theme';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const appTheme = theme();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider resetCSS theme={appTheme}>
        <App />

        <ToastContainer
          theme="dark"
          position="bottom-right"
          closeButton={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
