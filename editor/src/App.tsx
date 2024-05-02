import React, { useEffect } from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import MainWindow from './components/MainWindow';
import { myTheme } from './themes';



const theme = myTheme;

function App() {
  

  return (
    <div className="App">

    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
      <MainWindow></MainWindow>
      </StyledEngineProvider>
    </ThemeProvider>
    
     
      
    </div>
  );
}

export default App;
