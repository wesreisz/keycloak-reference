import React, { Component } from 'react';
import Keycloak from 'keycloak-js';
import Logout from './logout';
import UserInfo from './userInfo';

class Secured extends Component {

  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false }; 
  }

  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json');
    keycloak
        .init({ onLoad: 'login-required' })
        .success(authenticated => {
            this.setState({ 
                keycloak: keycloak, 
                authenticated: authenticated 
            });
        }).error(err => {
            alert(err);
        })
    ; 
  }


  render() {

    console.log("keycloak: " + this.state.keycloak);
    console.log("authenticated: " + this.state.authenticated);
      
    if (this.state.keycloak) {
      if (this.state.authenticated===true) return (
        <div>
          <p>This is a Keycloak-secured component of your application. You shouldn't be able
          to see this unless you've authenticated with Keycloak.</p>
          
            <UserInfo keycloak={this.state.keycloak} />

            <Logout keycloak={this.state.keycloak} />
        </div>
      ); else return (<div>Unable to authenticate!</div>)
    }
    return (
      <div>Initializing Keycloak...</div>
    );
  }
}
export default Secured;