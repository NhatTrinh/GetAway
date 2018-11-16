import React, { Component } from 'react';
import { BrowserRouter, Route} from 'react-router-dom';

import NavBar from './components/NavBar';
import Home from './components/Home/Home';
import Footer from './components/Footer';
import Profile from './components/Profile/Profile';
import Reservation from './components/Reservation/Reservation';
import Register from './components/Register';
import GuestRoute from './components/Routes/GuestRoute';
import UserRoute from './components/Routes/UserRoute';

//import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div >
        <NavBar />
        <BrowserRouter>
            <div id='routes' style={ styles.routeStyle }>
              <Route exact path='/' component={Home} />
              <UserRoute exact path='/profile' component={Profile}/>
              <Route exact path = '/reservation' component ={Reservation}/>
              <GuestRoute exact path = '/register' component ={Register}/>
            </div>
        </BrowserRouter>

        <div className = 'App-footer'>
          <Footer/>
        </div>
      </div>
    );
  }
}

const styles = {
}

export default App;
