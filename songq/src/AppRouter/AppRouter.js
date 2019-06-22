import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import WelcomeScreen from '../WelcomeScreen'
import HostHome from '../HostHome'
import CreatePlaylist from '../CreatePlaylist'
import GuestHome from '../GuestHome'
import ViewPlaylist from '../ViewPlaylist'

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
                    <Route exact path='/request-songs' render={(props) =>
                        <GuestHome
                            {...props}
                        /> }
                    />
                    <Route exact path='/requests' render={(props) =>
                        <ViewPlaylist
                            {...props}
                        /> }
                    />
                </Switch>
            </Router>
        )
    }
}

export default DragDropContext(HTML5Backend)(AppRouter)