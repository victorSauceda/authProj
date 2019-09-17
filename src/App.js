import React, { Component } from 'react';


import './App.css';

import Login from './Login';
import Register from './Register';






class App extends Component {
  constructor(props) {
    super(props);
    // initialize state here

    this.state = {
      pageSetter:false,
      pageSetterLogin:false




    };
    this.togglePage=this.togglePage.bind(this);

  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  togglePage(val){
    this.setState({pageSetter:val})
  }

  handleSubmit(e) {
    e.preventDefault();



    // On submit of the form, send a POST request with the data to the server.

  }


  render() {
    return (
      <div>
        {this.state.pageSetter?<Register />:<Login />}
        
        {this.state.pageSetter?<button onClick={()=>this.togglePage(false)}>Login</button>:<button onClick={()=>this.togglePage(true)}>Register</button>}
        
      </div>
    );
  }

}


export default App;
