import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1db954', // Sporty green
    },
    secondary: {
      main: '#ffd600', // Bold yellow
    },
    background: {
      default: '#181818', // Deep dark
      paper: '#232323',   // Card background
    },
    text: {
      primary: '#e0e0e0', // Light gray
      secondary: '#1db954',
    },
  },
  typography: {
    fontFamily: "'Montserrat', 'Oswald', Arial, sans-serif",
    h1: { fontFamily: "'Bebas Neue', 'Oswald', Arial, sans-serif" },
    h2: { fontFamily: "'Bebas Neue', 'Oswald', Arial, sans-serif" },
    h3: { fontFamily: "'Bebas Neue', 'Oswald', Arial, sans-serif" },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#181818',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#232323',
          borderRadius: 14,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#1db954',
          color: '#181818',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#17a44b',
          },
        },
        containedSecondary: {
          backgroundColor: '#ffd600',
          color: '#181818',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#ffe066',
          },
        },
      },
    },
  },
});

export default theme; 