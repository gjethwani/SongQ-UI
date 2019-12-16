import React, { Component } from 'react'
import '../main.css'
import styles from './LoginOrSignUp.module.css'
import { getHostname, authenticateSpotify } from '../util.js'
import axios from 'axios'
import 'antd/dist/antd.css'
const { 
    welcomeScreenTextContainer,
    welcomeScreenInnerContainer,
    welcomeScreenHeader,
    question,
    loginSignupButton
} = styles

class LoginOrSignUp extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount = async () => {
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