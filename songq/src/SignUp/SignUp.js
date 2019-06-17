import React, { Component } from 'react'
import { Input, Icon, Tooltip } from 'antd'
import axios from 'axios'
import '../main.css'
import { getHostname } from '../util'
import styles from './SignUp.module.css'
const {
    overallContainer,
    textContainer,
    header,
    button
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


class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            validEmail: true,
            password: '',
            validPassword: true,
            confirmPassword: '',
            validConfirmPassword: true,
            error: ''
        }
        this.onEmailChange = this.onEmailChange.bind(this)
        this.onPasswordChange = this.onPasswordChange.bind(this)
        this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this)
        this.authenticateSpotify = this.authenticateSpotify.bind(this)
    }
    onEmailChange(email) {
        var validEmail = validateEmail(email)
        this.setState({ 
            email, 
            validEmail
        })
    }
    onPasswordChange(password) {
        var validPassword = validatePassword(password)
        var validConfirmPassword = false
        if (this.state.confirmPassword === password) {
            validConfirmPassword = true
        } else {
            validConfirmPassword = false
        }
        this.setState({ 
            password, 
            validPassword,
            validConfirmPassword
        })
    }
    onConfirmPasswordChange(confirmPassword) {
        var validConfirmPassword = false
        if (confirmPassword === this.state.password) {
            validConfirmPassword = true
        }
        this.setState({ 
            confirmPassword, 
            validConfirmPassword 
        })
    }
    authenticateSpotify() {
        const { email, password } = this.state
        if (!email) {
            this.setState({
                validEmail: false
            })
            return
        }
        if (!password) {
            this.setState({
                validPassword: false
            })
            return
        }
        axios.post('http://localhost:5000/sign-up', {
            email,
            password
        }, {
            withCredentials: true
        })
        .then((response) => {
            window.location.href = 'http://localhost:5000/spotify-login'
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
           <div className={overallContainer}>
               <div className={textContainer}>
                    <h2 className={header}>Tell us a bit about yourself</h2>
                    <Tooltip
                            title="A valid email address is required"
                            placement="right"
                            visible={!this.state.validEmail}
                    >
                            <Input
                                placeholder='Email'
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                style={{
                                    width: '30%',
                                    margin: 'auto', 
                                    display: 'block',
                                    marginBottom: '20px'
                                }}
                                onChange={e => this.onEmailChange(e.target.value)}
                            />
                    </Tooltip>
                    <Tooltip
                        title="Password does not match requirements"
                        placement="right"
                        visible={!this.state.validPassword}
                >
                        <Password 
                            placeholder='Password'
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            style={{
                                width: '30%',
                                margin: 'auto', 
                                display: 'block',
                                marginBottom: '20px'
                            }}
                            onChange={e => this.onPasswordChange(e.target.value)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Passwords do not match"
                        placement="right"
                        visible={!this.state.validConfirmPassword}
                    >
                        <Password 
                            placeholder='Confirm Password'
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            style={{
                                width: '30%',
                                margin: 'auto', 
                                display: 'block',
                                marginBottom: '20px'
                            }}
                            onChange={e => this.onConfirmPasswordChange(e.target.value)}
                        />
                    </Tooltip>
                    <button 
                        onClick={this.authenticateSpotify}
                        className={button}
                    >
                        AUTHENTICATE SPOTIFY
                    </button>
                 </div>
           </div>
        )
    }
}

export default SignUp