import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Welcome from './welcome';
import Secured from './secured';
import './App.css';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div className="container">
        Navigation:
          <ul>
            <li><Link to="/">Public Component</Link></li>
            <li><Link to="/secured">Secured Component</Link></li>
            <li><a href="http://localhost:8080/auth/realms/MyDemo/account/">Keycloak User Profile</a></li>
          </ul>
          <Route exact path="/" component={Welcome} />
          <Route path="/secured" component={Secured} />
        </div>
      </BrowserRouter>
    );
  }
}
export default App;