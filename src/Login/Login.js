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
            if (error === undefined) {
                return notification.error({
                    message: 'Something went wrong',
                    description: 'Please try again later'
                })
            }
            if (!error.response) {
                return notification.error({
                    message: 'Something went wrong',
                    description: JSON.stringify(error)
                })
            }
            const { status, data } = error.response
            if (status === 401) {
                return notification.error({
                    message: 'Login Error',
                    description: data.err.message
                })
            } else {
                return notification.error({
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