import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { homedir } from 'os';
import Login from '../Login'
import Home from '../Home'

class AppRouter extends Component {
    render() {
        return(
            <Router>
                <Switch>
                    <Route exact path='/' render={(props) => 
                        <Login 
                            {...props} 
                        /> }
                    />
                    <Route exact path='/home' render={(props) => 
                        <Home
                            {...props}
                        /> }
                    />
                </Switch>
            </Router>
        )
    }
}

export default AppRouter