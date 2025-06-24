import { createTheme } from '@mui/material/styles';

export function getTheme(mode = 'light') {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#6A1B9A', // Roxo principal
        light: '#9C4DCC',
        dark: '#38006B',
        contrastText: '#fff',
      },
      secondary: {
        main: '#4A148C', // Roxo escuro
        light: '#7B1FA2',
        dark: '#12005E',
        contrastText: '#fff',
      },
      background: mode === 'dark' ? {
        default: '#181a1b',
        paper: '#23272b',
      } : {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
          outlinedError: ({ theme }) => theme.palette.mode === 'dark' ? {
            color: theme.palette.error.main,
            borderColor: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.main + '22',
              borderColor: theme.palette.error.dark,
            },
          } : {},
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });
} 