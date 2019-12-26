import React, { Component } from 'react'
import { PageHeader } from 'antd'
import Login from '../Login'
import '../main.css'
import styles from './WelcomeScreen.module.css'
import HostOrGuest from '../HostOrGuest'
import SignUp from '../SignUp'
import GuestLogin from '../GuestLogin'
import PlaylistMapContainer from '../PlaylistMapContainer'
import LoginOrSignUp from '../LoginOrSignUp'
import { getHostname, authenticateSpotify } from '../util.js'
import queryString from 'query-string'
import axios from 'axios'
import 'antd/dist/antd.css'
const { 
    welcomeScreenContainer, 
    header,
} = styles

class WelcomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showLogin: false,
            showWelcome: false,
            showHostOrGuest: true, 
            showSignUp: false,
            showGuestLogin: false,
            showPlaylistMap: false,
            latitude: null,
            longitude: null,
            nearbyPlaylists: [],
        }
    }
    componentDidMount = () => {
        var rawQuery = queryString.parse(this.props.location.search)
        let { mode } = rawQuery
        if (mode === 'guest') {
            this.changeToGuestLoginView()
        } else {
            this.checkIfLoggedIn()
        }
    }
    checkIfLoggedIn = async () => {
        const response = await axios.post(`${process.env.REACT_APP_BACK_END_URI}/is-logged-in`, {}, {
            withCredentials: true
        })
        const { isLoggedIn, needToSpotifyAuth, spotifyRefresh } = response.data
        if (isLoggedIn) {
            if (needToSpotifyAuth) {
                authenticateSpotify(spotifyRefresh)
            } else {
                window.location.href = `http://${getHostname()}/home`
            }
        }
    }
    setStateToFalseButOne = (key) => {
        var { state } = this
        Object.keys(state).forEach(v => state[v] = false)
        state[key] = true
        this.setState(state)
    }
    changeToLoginView = () => {
        this.setStateToFalseButOne('showLogin')
    }
    changeToHostView = () => {
        this.setStateToFalseButOne('showWelcome')
    }
    changeToSignUpView = () => {
        this.setStateToFalseButOne('showSignUp')
    }
    changeToGuestLoginView = () => {
        this.setStateToFalseButOne('showGuestLogin')
    }
    changeToHostOrGuestView = () => {
        this.checkIfLoggedIn()
        this.setStateToFalseButOne('showHostOrGuest')
    }
    back = () => {
        if (this.state.showWelcome || 
            this.state.showGuestLogin ||
            this.state.showPlaylistMap ||
            this.state.showGuestLogin
        ) {
            this.changeToHostOrGuestView()
        }
        if (this.state.showLogin || this.state.showSignUp) {
            this.changeToHostView()
        }
    }
    switchToLocationBased = () => {
        this.setStateToFalseButOne('showPlaylistMap')
    }
    render() {
        return(
            <div className={welcomeScreenContainer}>
                <PageHeader 
                    className={header}
                    onBack={this.back}
                />
                {this.state.showHostOrGuest && 
                    <HostOrGuest 
                        changeToHostView={this.changeToHostView} 
                        changeToGuestView={this.changeToGuestLoginView}
                />}
                {this.state.showWelcome && <LoginOrSignUp 
                    changeToLoginView={this.changeToLoginView}
                    changeToSignUpView={this.changeToSignUpView}
                />}
                {this.state.showLogin && <Login/>}
                {this.state.showSignUp && <SignUp/>}
                {this.state.showGuestLogin && <GuestLogin
                    switchToLocationBased={this.switchToLocationBased}
                />}
                {this.state.showPlaylistMap && 
                    <PlaylistMapContainer 
                        changeToGuestLoginView={this.changeToGuestLoginView} 
                />}
            </div>
        )
    }
}

export default WelcomeScreen