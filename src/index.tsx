import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import App from './App';
import { theme } from './theme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const appTheme = theme();

root.render(
  <React.StrictMode>
    <ChakraProvider resetCSS theme={appTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
