import React, { Component, useEffect } from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import MainWindow from './components/MainWindow';
import { myTheme } from './themes';
import { ApiDataRepository } from './api/ApiDataRepository';
import { narrator } from './data/narrator';
import { defaultNodes } from './data/defaultNodes';




const theme = myTheme;

class App extends Component {
  constructor(props: any) {
    super(props);
  }
  
  componentDidMount(): void {
    const repo = ApiDataRepository.getInstance();
    if(localStorage.getItem('storyId') === null){
      console.log('Story ID is not set');
      repo.saveProject('Adicione um título ao projeto', defaultNodes, [], [narrator], []);
    }
    if(!localStorage.getItem('characters')){
      console.log('Characters are not set');
      localStorage.setItem('characters', JSON.stringify([narrator]));
    }
    if(!localStorage.getItem('edges')) localStorage.setItem("edges", JSON.stringify([]));
    if(!localStorage.getItem('nodes')) localStorage.setItem("nodes", JSON.stringify(defaultNodes));

    if(!localStorage.getItem('maps'))  localStorage.setItem("maps", JSON.stringify([]));
    
    if (!localStorage.getItem('projectTitle')) localStorage.setItem("projectTitle", "Adicione um título ao projeto");
    if (!localStorage.getItem('experienceName')) localStorage.setItem("experienceName", "");
    if (!localStorage.getItem('experienceDescription')) localStorage.setItem("experienceDescription", "");
    if (!localStorage.getItem('experienceTags')) localStorage.setItem("experienceTags", JSON.stringify([]));

   
 
  }

  render(){
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
  
}

export default App;
