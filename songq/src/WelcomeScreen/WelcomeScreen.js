import React, { Component } from 'react'
import Login from '../Login'
import '../main.css'
import styles from './WelcomeScreen.module.css'
import HostOrGuest from '../HostOrGuest'
import SignUp from '../SignUp'
import GuestLogin from '../GuestLogin'
const { welcomeScreenContainer, 
    welcomeScreenTextContainer, 
    loginSignupButton, 
    welcomeScreenHeader,
    question
} = styles

class WelcomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showLogin: false,
            showWelcome: false,
            showHostOrGuest: true, 
            showSignUp: false,
            showGuestLogin: false
        }
        this.changeToLoginView = this.changeToLoginView.bind(this)
        this.changeToHostView = this.changeToHostView.bind(this)
        this.changeToSignUpView = this.changeToSignUpView.bind(this)
        this.changeToGuestLoginView = this.changeToGuestLoginView.bind(this)
    }
    changeToLoginView() {
        this.setState({ 
            showLogin: true,
            showWelcome: false
        })
    }
    changeToHostView() {
        this.setState({
            showWelcome: true,
            showHostOrGuest: false
        })
    }
    changeToSignUpView() {
        this.setState({
            showSignUp: true,
            showWelcome: false 
        })
    }
    changeToGuestLoginView() {
        this.setState({
            showHostOrGuest: false,
            showGuestLogin: true
        })
    }
    render() {
        return(
            <div className={welcomeScreenContainer}>
                {this.state.showHostOrGuest && 
                    <HostOrGuest 
                    changeToHostView={this.changeToHostView} 
                    changeToGuestView={this.changeToGuestLoginView}
                />}
                {this.state.showWelcome && <div className={welcomeScreenTextContainer}>
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
                </div>}
                {this.state.showLogin && <Login/>}
                {this.state.showSignUp && <SignUp/>}
                {this.state.showGuestLogin && <GuestLogin/>}
            </div>
        )
    }
}

export default WelcomeScreen