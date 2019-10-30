import React, { Component } from 'react'
import { Input, Icon, notification } from 'antd'
import { getHostname, authenticateSpotify } from '../util.js'
import axios from 'axios'
import styles from './Login.module.css'
import '../main.css'
import 'antd/dist/antd.css'

const {
    loginContainer,
    loginTextContainer,
    loginButton,
    header,
    input
} = styles

const Password = Input.Password

// const validateEmail = (email) => {
//     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     return re.test(String(email).toLowerCase())
// }

// const validatePassword = (password) => {
//     /*
//     Password requirements
//     1 lowercase
//     1 uppercase
//     1 numeric
//     1 special character
//     8 characters or longer 
//     */
//     var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
//     return re.test(String(password))
// }

class Login extends Component {
    constructor(props) {
        super(props)
        axios.defaults.withCredentials = true
        this.state = {
            email: '',
            password: '',
        }
        this.submitForm = this.submitForm.bind(this)
    }
    // componentDidMount() {
    //     axios.get(`${process.env.REACT_APP_BACK_END_URI}/authenticate-spotify?justSignedUp=false`, {}, {
    //         withCredentials: true
    //     })
    //     .then((response) => {
    //         const { isLoggedIn, needToSpotifyAuth, spotifyRefresh } = response.data
    //         if (isLoggedIn) {
    //             if (needToSpotifyAuth) {
    //                 authenticateSpotify(spotifyRefresh)
    //             } else {
    //                 window.location.href = `http://${getHostname()}/home`
    //             }
    //         }
    //     })
    // }
    onEmailChange(email) {
        this.setState({ email })
    }
    onPasswordChange(password) {
        this.setState({ password })
    }
    submitForm() {
        axios.post(`${process.env.REACT_APP_BACK_END_URI}/login`, {
            email: this.state.email,
            password: this.state.password
        }, {
            withCredentials: true
        })
        .then((response) => {
            var { needToSpotifyAuth, spotifyRefresh } = response.data
            if (needToSpotifyAuth) {
                authenticateSpotify(spotifyRefresh)
            } else {
                window.location.href = `http://${getHostname()}/home`
            }
        })
        .catch((error) => {
            if (!error.response) {
                notification.error({
                    message: 'Something went wrong',
                    description: 'Please try again later'
                })
            }
            const { status, data } = error.response
            if (status === 401) {
                notification.error({
                    message: 'Login Error',
                    description: data.err.message
                })
            } else {
                notification.error({
                    message: 'Network error',
                    description: 'Please try again later'
                })
            }
            
        })
    }
    render() {
        return(
            <div className={loginContainer}>
                <div className={loginTextContainer}>
                    <h2 className={header}>Welcome back! Tell us who you are</h2>
                    <Input
                        placeholder='Email'
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        style={{
                            margin: 'auto', 
                            display: 'block',
                            marginBottom: '20px'
                        }}
                        className={input}
                        onChange={e => this.onEmailChange(e.target.value)}
                    />
                    <Password 
                        placeholder='Password'
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        style={{
                            margin: 'auto', 
                            display: 'block',
                            marginBottom: '20px'
                        }}
                        className={input}
                        onChange={e => this.onPasswordChange(e.target.value)}
                    />
                    <button 
                        onClick={this.submitForm}
                        className={loginButton}
                    >
                        Submit
                    </button>
                </div>
            </div>
        )
    }
}

export default Login