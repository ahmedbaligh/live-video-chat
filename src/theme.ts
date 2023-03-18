import { extendTheme } from '@chakra-ui/react';

export const theme = () =>
  extendTheme({
    styles: {
      global: {
        html: {
          scrollBehavior: 'smooth'
        },
        body: {
          bg: '#1A202C',
          color: 'white'
        },
        '#root': {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }
      }
    },
    fonts: {
      body: 'Poppins',
      heading: 'Poppins'
    }
  });
