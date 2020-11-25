import React, { Component } from 'react';
import ProfileItem from './ProfileItem.js';

class ProfileList extends Component {
  constructor(prop){
    super();
    this.state = {
      profiles: [],
      loadSuccess: true,
      loadMessage: ''
    }
  }

  FuncLogin(event){
    console.log(event)
  }

  componentDidMount() {
    fetch('/api/')
    .then(resp => resp.json())
    .then(prof =>{
      this.setState({profiles: prof.report, loadMessage: prof.message})
    })
    .catch(err=>{
      this.setState({loadSuccess: false, loadMessage: 'Fail'})
    })
  }
  render() {
    return (
      <div>
      <p>{this.state.loadMessage}</p>
      {this.state.profiles.map((item) => {
        return <ProfileItem key={item.id} username={item.username}
         userLoginPath={item.loginProfile}
         funcLogin={this.FuncLogin} loginState='false' />
      })
      }
    </div>
    )
  }
}

export default ProfileList
