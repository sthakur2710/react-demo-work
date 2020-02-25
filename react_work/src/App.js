import React, { Component } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/routes";
import "bootstrap/dist/css/bootstrap.min.css";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import { GoogleComponent } from 'react-google-location'; 
const API_KEY = 'AIzaSyD82P-EPWUYN1Hsl_uJ8HNxVhc4pre6FlA'  // how to get key - step are below

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      place: null,
    };
  }

  // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
 
// set response language. Defaults to english.
 
// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
 
// Enable or disable logs. Its optional.
 

  render() {
    var points = [
      { lat: 42.02, lng: -77.01 },
      { lat: 42.03, lng: -77.02 },
      { lat: 41.03, lng: -77.04 },
      { lat: 42.05, lng: -77.02 }
    ];


    var bounds = new this.props.google.maps.LatLngBounds();
    for (var i = 0; i < points.length; i++) {
      bounds.extend(points[i]);
    }

    return (
      <BrowserRouter>
        <Router />
        <GoogleComponent
         
         apiKey={API_KEY}
         language={'en'}
         country={'country:in|country:us'}
         coordinates={true}
         locationBoxStyle={'custom-style'}
         locationListStyle={'custom-style-list'}
         onChange={(e) => { this.setState({ place: e }) }} />
        <Map
          google={this.props.google}
          zoom={5}
          initialCenter={{
            lat: 22.7196,
            lng: 75.8577
          }}
        >
          <Marker
            title={"The marker`s title will appear as a tooltip."}
            name={"SOMA"}
            position={{ lat: 23.1815, lng: 79.9864 }}
          />
          <Marker
          title={"The marker`s title will appear as a tooltip."}
            name={"Dolores park"}
            position={{ lat: 23.2599, lng: 77.4126 }}
          />
          <Marker />
          <Marker
          title={"The marker`s title will appear as a tooltip."}
            name={"Your position"}
            position={{ lat: 37.762391, lng: -122.439192 }}
          />
          
         
        </Map>
      </BrowserRouter>
    );
  }
}

// export default App;

export default GoogleApiWrapper({
  apiKey: "AIzaSyBPAu5c1AoGURvC4gY6QTzHx_iV9tIqXRg"
})(App);
