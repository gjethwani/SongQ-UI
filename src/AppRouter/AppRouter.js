import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import WelcomeScreen from '../WelcomeScreen'
import HostHome from '../HostHome'
import CreatePlaylist from '../CreatePlaylist'
import GuestHome from '../GuestHome'
import ViewPlaylist from '../ViewPlaylist'
import { getHostname } from '../util'

class AppRouter extends Component {
    render() {
        const lockedPlaylist = JSON.parse(localStorage.getItem('lockedPlaylist'))
        if (lockedPlaylist) {
            const { host, roomCode, playlistName, playlistId } = lockedPlaylist
            if (host) {
                return (
                    <ViewPlaylist
                        fromProps
                        roomCode={roomCode}
                        playlistName={playlistName}
                        playlistId={playlistId}
                        locked
                    />
                )
            } else {
                return (
                    <GuestHome
                        fromProps
                        roomCode={roomCode}
                        playlistName={playlistName}
                        locked
                    />
                )
            }
        } else {
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
                                fromProps={false}
                                locked={false}
                            /> }
                        />
                        <Route exact path='/requests' render={(props) =>
                            <ViewPlaylist
                                {...props}
                                fromProps={false}
                                locked={false}
                            /> }
                        />
                    </Switch>
                </Router>
            )
        }
    }
}

export default AppRouter
