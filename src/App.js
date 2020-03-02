import React, { Component } from 'react';
import { BrowserRouter} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Router from './routes' 
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className='App'>
          <Router/>
        </div>
     </BrowserRouter>
    );
  }
}

export default App;
