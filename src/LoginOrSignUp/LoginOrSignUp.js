import React, { Component } from 'react'
import '../main.css'
import styles from './LoginOrSignUp.module.css'
import 'antd/dist/antd.css'
const { 
    welcomeScreenTextContainer,
    welcomeScreenInnerContainer,
    welcomeScreenHeader,
    question,
    loginSignupButton
} = styles

class LoginOrSignUp extends Component {
    render() {
        return(
            <div className={welcomeScreenTextContainer}>
                <div className={welcomeScreenInnerContainer}>
                    <h1 className={welcomeScreenHeader}>Thanks for hosting!</h1>
                    <p className={question}>Are you new here?</p>
                    <button 
                        onClick={this.props.changeToLoginView}
                        className={loginSignupButton}>
                            LOG IN
                    </button>
                    <button
                        className={loginSignupButton}
                        onClick={this.props.changeToSignUpView}>
                            SIGN UP
                    </button>
                </div>
            </div>
        )
    }
}

export default LoginOrSignUp