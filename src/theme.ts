import { ChakraTheme, extendTheme } from '@chakra-ui/react';

export const breakPoints = {
  sm: '30em', // 480px
  md: '48em', // 768px
  lg: '62em', // 992px
  xl: '90em', // 1440px
  '2xl': '96em' // 1536px
};

export const px = [4, 6, 12, 24, null, 32];

export const py = [6, 8, 10, 12];

const Container: ChakraTheme['components']['Container'] = {
  baseStyle: {
    maxW: '8xl',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    px,
    py
  }
};

export const theme = () =>
  extendTheme({
    breakPoints,
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
    },
    components: {
      Container
    }
  });
