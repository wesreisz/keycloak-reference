import React, { Component } from 'react';

class UserInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "tmp",
      email: "email",
      id: "uid"
    };
  }
  componentDidMount() {
    this.props.keycloak.loadUserInfo().success(userInfo => {
      this.setState({name: userInfo.name, email: userInfo.email, id: userInfo.sub})
    });
  }

  render() {
    return (
      <div className="UserInfo">
        <p>Name: {this.state.name}</p>
        <p>Email: {this.state.email}</p>
        <p>ID: {this.state.id}</p>
      </div>
    );
  }
}
export default UserInfo;