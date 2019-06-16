import React, { Component } from 'react'
import { Input } from 'antd'
import { getHostname } from '../util.js'
import axios from 'axios'
import styles from './Login.module.css'
import '../main.css'
import 'antd/dist/antd.css'

const {
    loginContainer,
    loginTextContainer,
    loginButton,
    header,
    error
} = styles

const Password = Input.Password

const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

const validatePassword = (password) => {
    /*
    Password requirements
    1 lowercase
    1 uppercase
    1 numeric
    1 special character
    8 characters or longer 
    */
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    return re.test(String(password))
}

class Login extends Component {
    constructor(props) {
        super(props)
        axios.defaults.withCredentials = true
        this.state = {
            email: '',
            password: '',
            error: ''
        }
        this.submitForm = this.submitForm.bind(this)
    }
    authenticateSpotify(refresh) {
        var url = 'http://localhost:5000'
        if (refresh) {
            url += '/spotify-refresh-token'
        } else {
            url += '/spotify-login'
        }
        window.location.href = url
    }
    onEmailChange(email) {
        this.setState({ email })
    }
    onPasswordChange(password) {
        this.setState({ password })
    }
    submitForm() {
        axios.post('http://localhost:5000/login', {
            email: this.state.email,
            password: this.state.password
        }, {
            withCredentials: true
        })
        .then((response) => {
            var { needToSpotifyAuth, spotifyRefresh } = response.data
            if (needToSpotifyAuth) {
                if (spotifyRefresh) {
                    this.authenticateSpotify(spotifyRefresh)
                    window.location.href = `http://${getHostname()}/spotify-refresh-token`
                } else {
                    window.location.href = `http://${getHostname()}/spotify-login`
                }
            } else {
                window.location.href = `http://${getHostname()}/home`
            }
        })
        .catch((error) => {
            console.log(error)
            this.setState({
                error: error.response.data.err.message
            })
        })
    }
    render() {
        return(
            <div className={loginContainer}>
                <div className={loginTextContainer}>
                    <h2 className={header}>Welcome back! Tell us who you are</h2>
                    <Input
                        placeholder='Email'
                        style={{
                            width: '30%',
                            margin: 'auto', 
                            display: 'block',
                            marginBottom: '20px'
                        }}
                        onChange={e => this.onEmailChange(e.target.value)}
                    />
                    <Password 
                        placeholder='Password'
                        style={{
                            width: '30%',
                            margin: 'auto', 
                            display: 'block',
                            marginBottom: '20px'
                        }}
                        onChange={e => this.onPasswordChange(e.target.value)}
                    />
                    <button 
                        onClick={this.submitForm}
                        className={loginButton}
                    >
                        Submit
                    </button>
                    <button 
                        onClick={this.submitForm}
                        className={loginButton}
                    >
                        Back
                    </button>
                    {this.state.error && <p className={error}>{this.state.error}</p>}
                </div>
            </div>
        )
    }
}

export default Login