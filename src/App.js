import React, {Component} from 'react';


import './App.css';
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);
    // initialize state here
    
    this.state = {
      user:'',
      // input:'',
      // data:null
      
    };

  }
    handleChange(event){
      this.setState({
        user: event.target.value,
        
        });
}
handleSubmit(e) {
  e.preventDefault();
   
  // On submit of the form, send a POST request with the data to the server.
  axios.post('/user', {
        name: this.state.user,
    })
    .then(function(response) {
      if (response.status !== 200) {
        //process error
      }
      //otherwise set some state to show hello
    });
}


  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" value={this.state.user} onChange={this.handleChange.bind(this)}/>
        <input type="submit" />
        </form>
        {/* <h1>Hello, {this.ref.name}</h1> */}
        
      </div>
    );
  }

}

export default App;
