import React from 'react';
import { AppRoutes } from './routes';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

const theme = createTheme({
  colorSchemes: {
    dark: true,
    light: true
  },
});

export function App() {
  return <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AppRoutes />
      </SnackbarProvider>
    </ThemeProvider>
  </BrowserRouter>
}

export default App;
