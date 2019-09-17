import React, { Component } from 'react';

import Main from './Main'
import './App.css';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
      super(props);
      // initialize state here
  
      this.state = {
        username: '',
        submitted: false,
        created: false,
        password: '',
        confirmPassword: '',
        errorPass: false,
        submittedPass: false,
        matcherror: '',
        pagesetterLogin:false
      
  
  
  
  
      };
    }
  
    togglePageLogin(val){
      this.setState({pageSetterLogin:val})
    }
    handleChange(event) {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  

  
  
    render() {
      return (
        <div>
          <form action='/login' method='post' autoComplete="off">
            <input name='username' type="text" placeholder='username' value={this.state.username} onChange={this.handleChange.bind(this)} />
            <input name='password' type="password" placeholder='password' value={this.state.password} onChange={this.handleChange.bind(this)} />
            
<button type="submit">login</button>
        
          </form>
</div>
      );
    }
  
  }
  
  
  export default Login;