import React, { Component } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/routes";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      place: null,
    };
  }
 
  render() {
    return (
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    );
  }
}

export default App;

