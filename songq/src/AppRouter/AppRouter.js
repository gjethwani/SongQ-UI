import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { homedir } from 'os';
import Login from '../Login'
import CreatePlaylist from '../CreatePlaylist'
import WelcomeScreen from '../WelcomeScreen';

class AppRouter extends Component {
    render() {
        return(
            <Router>
                <Switch>
                    <Route exact path='/' render={(props) => 
                        <WelcomeScreen 
                            {...props} 
                        /> }
                    />
                    <Route exact path='/home' render={(props) => 
                        <CreatePlaylist
                            {...props}
                        /> }
                    />
                </Switch>
            </Router>
        )
    }
}

export default AppRouter