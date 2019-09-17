import React from 'react';
import axios from 'axios';

class Register extends React.Component{
    constructor(props){
      super(props);
      this.state={
        user:'',
        password:'',
        confirmPassword:'',
        created:false,
        matcherror:'',
        submitted:false,
        createdSuccess:''
        
      }
    }
    handleChanger(event){
      this.setState({
        
        [event.target.name]: event.target.value
      
        
        
        });
}

handleSubmit(e) {
  e.preventDefault();

  if (this.state.password !== this.state.confirmPassword) {
    this.setState({matcherror:"passwords do not match"})
    return ;
  }
  axios.post('/register', {
    name: this.state.user,
    password:this.state.password
})
.then((response) =>{
  switch(response.status){
    case 200:
       this.setState({submitted:true,})  
        break;
    case 201  :
      this.setState({submitted:true,created:true, createdSuccess:'submitted successfully'})
      break;
    default:
      console.error('something happend')             
          
  }

  //otherwise set some state to show hello
})
.catch((error)=>{
 if (error.response.status===403){
  this.setState({submittedPass:true,errorPass:true})
 }
})
  }

    render() {
      return (
        <div className="Registration">
      <form onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
        <input name='user'type="text" placeholder='username' value={this.state.user} onChange={this.handleChanger.bind(this)}/>
        <input name='password'type="password" placeholder='password' value={this.state.password} onChange={this.handleChanger.bind(this)}/>
        <input name='confirmPassword'type="password" placeholder='Confirm password' value={this.state.handleChanger} onChange={this.handleChanger.bind(this)}/>
      
        <input type="submit"/>

      </form>
      {this.state.matcherror.length>0 && <p>{this.state.matcherror}</p>}
      {this.state.created && 
          <h1>{this.state.createdSuccess}</h1>}
        </div>
      );
    }
  }
  
  export default Register;