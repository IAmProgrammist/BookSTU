import React from 'react';
import { AppRoutes } from './routes';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

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
      <AppRoutes />
    </ThemeProvider>
  </BrowserRouter>
}

export default App;
