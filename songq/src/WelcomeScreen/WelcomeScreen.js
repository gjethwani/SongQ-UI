import React, { Component } from 'react'
import Login from '../Login'
import '../main.css'
import styles from './WelcomeScreen.module.css'
import HostOrGuest from '../HostOrGuest/HostOrGuest';
const { welcomeScreenContainer, 
    welcomeScreenTextContainer, 
    loginSignupButton, 
    welcomeScreenHeader
} = styles

class WelcomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showLogin: false,
            showWelcome: false,
            showHostOrGuest: true
        }
        this.redirectToLogin = this.redirectToLogin.bind(this)
        this.changeToHostView = this.changeToHostView.bind(this)
    }
    redirectToLogin() {
        this.setState({ 
            showLogin: true,
            showWelcome: false
        })
    }
    changeToHostView() {
        this.setState({
            showWelcome: true,
            showLogin: false,
            showHostOrGuest: false
        })
    }
    render() {
        return(
            <div className={welcomeScreenContainer}>
                {this.state.showHostOrGuest && <HostOrGuest changeToHostView={this.changeToHostView} />}
                {this.state.showWelcome && <div className={welcomeScreenTextContainer}>
                    <h1 className={welcomeScreenHeader}>Thanks for hosting!</h1>
                    <p>Are you new here?</p>
                    <button 
                        onClick={this.redirectToLogin}
                        className={loginSignupButton}>
                            Log in
                    </button>
                    <button
                        className={loginSignupButton}>
                            Sign up
                    </button>
                </div>}
                {this.state.showLogin && <Login/>}
            </div>
        )
    }
}

export default WelcomeScreen