import React, { Component } from 'react'
import { PageHeader } from 'antd'
import Login from '../Login'
import '../main.css'
import styles from './WelcomeScreen.module.css'
import HostOrGuest from '../HostOrGuest'
import SignUp from '../SignUp'
import GuestLogin from '../GuestLogin'
import PlaylistMap from '../PlaylistMap'
import { geolocated } from 'react-geolocated'
import 'antd/dist/antd.css'
import axios from 'axios'
const { welcomeScreenContainer, 
    welcomeScreenTextContainer, 
    loginSignupButton, 
    welcomeScreenHeader,
    question,
    header,
    welcomeScreenInnerContainer
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
        this.changeToLoginView = this.changeToLoginView.bind(this)
        this.changeToHostView = this.changeToHostView.bind(this)
        this.changeToSignUpView = this.changeToSignUpView.bind(this)
        this.changeToGuestLoginView = this.changeToGuestLoginView.bind(this)
        this.switchToLocationBased = this.switchToLocationBased.bind(this)
        this.changeToHostOrGuestView = this.changeToHostOrGuestView.bind(this)
        this.back = this.back.bind(this)
        this.setStateToFalseButOne = this.setStateToFalseButOne.bind(this)
    }
    setStateToFalseButOne(key) {
        var { state } = this
        Object.keys(state).forEach(v => state[v] = false)
        state[key] = true
        this.setState(state)
    }
    changeToLoginView() {
        this.setStateToFalseButOne('showLogin')
    }
    changeToHostView() {
        this.setStateToFalseButOne('showWelcome')
    }
    changeToSignUpView() {
        this.setStateToFalseButOne('showSignUp')
    }
    changeToGuestLoginView() {
        this.setStateToFalseButOne('showGuestLogin')
    }
    changeToHostOrGuestView() {
        this.setStateToFalseButOne('showHostOrGuest')
    }
    back() {
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
    switchToLocationBased() {
        if (this.props.isGeolocationAvailable) {
            if (this.props.isGeolocationEnabled) {
                if (this.props.coords !== null) {
                    this.setState({
                        latitude: this.props.coords.latitude,
                        longitude: this.props.coords.longitude,
                    }, () => {
                        axios.get(`${process.env.REACT_APP_BACK_END_URI}/get-nearby-playlists?latitude=${this.state.latitude}&longitude=${this.state.longitude}`, {}, {
                            withCredentials: true
                        })
                        .then((response) => {
                            const { playlists } = response.data
                            this.setState({ 
                                showPlaylistMap: true,
                                showGuestLogin: false,
                                nearbyPlaylists: playlists,
                            })
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                    })
                }
            }
        }
    }
    render() {
        return(
            <div className={welcomeScreenContainer}>
                <PageHeader 
                    className={header}
                    onBack={this.back}
                ></PageHeader>
                {this.state.showHostOrGuest && 
                    <HostOrGuest 
                    changeToHostView={this.changeToHostView} 
                    changeToGuestView={this.changeToGuestLoginView}
                />}
                {this.state.showWelcome && <div className={welcomeScreenTextContainer}>
                    <div className={welcomeScreenInnerContainer}>
                        <h1 className={welcomeScreenHeader}>Thanks for hosting!</h1>
                        <p className={question}>Are you new here?</p>
                        <button 
                            onClick={this.changeToLoginView}
                            className={loginSignupButton}>
                                LOG IN
                        </button>
                        <button
                            className={loginSignupButton}
                            onClick={this.changeToSignUpView}>
                                SIGN UP
                        </button>
                    </div>
                </div>}
                {this.state.showLogin && <Login/>}
                {this.state.showSignUp && <SignUp/>}
                {this.state.showGuestLogin && <GuestLogin
                    switchToLocationBased={this.switchToLocationBased}
                />}
                {this.state.showPlaylistMap && <PlaylistMap 
                    currLatitude={this.state.latitude}
                    currLongitude={this.state.longitude}
                    nearbyPlaylists={this.state.nearbyPlaylists}
                />}
            </div>
        )
    }
}

export default geolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  })(WelcomeScreen)