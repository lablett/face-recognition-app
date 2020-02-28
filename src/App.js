import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
// import {} from 'dotenv/config';

import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/SignIn/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';


import variables from './variables'
import './App.css';

const app = new Clarifai.App({
  apiKey: variables.API_KEY
});

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable:true,
        value_area: 800
      }
    },
    move: {
      enable: true,
      speed: 6
    }
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      inputURL: '',
      box: {},
      route: 'signIn',
      isSignedIn: false
    }
  }

    onInputChange = (event) => {
    // this.setState({inputURL: event.target.value});
    this.setState({input: event.target.value})
  }

  onInputSubmit = () => {
    this.setState({inputURL: this.state.input})
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceLocation(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route ==='signOut'){
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(clarifaiFace)
    // Calculate location of bounding box corners - response data is relative percentage of image
    return {
      leftCol: clarifaiFace.left_col*width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height -(clarifaiFace.bottom_row*height)
    }
  }

  displayFaceLocation = (box) => {
    this.setState({box: box})
    // console.log(box)
  }

  render() {
    const { isSignedIn, inputURL, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onInputSubmit={this.onInputSubmit} />
            <FaceRecognition box={box} inputURL={inputURL} />
            </div>
          : (
            route === 'signIn'
              ? <SignIn onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />
          )
          
        }
      </div>
    );
  }
}

export default App;
