import React from 'react';
import Login from './Login'

 class Main extends React.Component{
constructor(props){
    super(props)
    this.state=({
        logout:true,
        pagesetter:false
    })
}
toggleMe(val){
    this.setState=({logout:true,pagesetter:true})
}
render(){
    return(
        <div>
        {this.state.logout && this.state.pagesetter?<Login/>: <p>welcome</p>}

    
        {this.state.pagesetter?<button onClick={()=>this.toggleMe(false)}>Login</button>:<button onClick={()=>this.toggleMe(true)}>Register</button>}

    </div>
    )
}

}
export default Main;