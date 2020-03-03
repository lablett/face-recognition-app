import React, { Component } from 'react';
import Particles from 'react-particles-js';
// import {} from 'dotenv/config';

import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/SignIn/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import './App.css';

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

const initialState = {
  input: '',
  inputURL: '',
  box: {},
  route: 'signIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      inputURL: '',
      box: {},
      route: 'signIn',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  onInputChange = (event) => {
    // this.setState({inputURL: event.target.value});
    this.setState({input: event.target.value})
  }

  onInputSubmit = () => {
    this.setState({inputURL: this.state.input, box: {}})
      fetch('http://localhost:3000/imageURL', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
        }
        this.displayFaceLocation(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route ==='signOut'){
      this.setState(initialState)
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
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onInputSubmit={this.onInputSubmit} />
            <FaceRecognition box={box} inputURL={inputURL} />
            </div>
          : (
            route === 'register'
              ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
          
        }
      </div>
    );
  }
}

export default App;
