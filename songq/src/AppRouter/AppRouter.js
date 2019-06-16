import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { homedir } from 'os';
import WelcomeScreen from '../WelcomeScreen'
import HostHome from '../HostHome'
import CreatePlaylist from '../CreatePlaylist'

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
                        <HostHome 
                            {...props} 
                        /> }
                    />
                    <Route exact path='/create-playlist' render={(props) =>
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