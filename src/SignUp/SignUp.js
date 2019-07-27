import React, { Component } from 'react'
import { Input, Icon, notification, Modal } from 'antd'
import axios from 'axios'
import '../main.css'
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
    if (password === "") {
        return false
    }
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    return re.test(String(password))
}


class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            validEmail: false,
            password: '',
            validPassword: false,
            confirmPassword: '',
            validConfirmPassword: false,
            showModal: false
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
        if (!this.state.validConfirmPassword || !this.state.validEmail || !this.state.validPassword) {
            Modal.error({
                title: "Error",
                content: 
                    <div>
                        {!this.state.validEmail && <p>A valid email address is required</p>}
                        {!this.state.validPassword && <p>Password needs to be 8 or more characters and have at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character</p>}
                        {!this.state.validConfirmPassword  && <p>Passwords do not match</p>}
                    </div>
            })
            return
        }
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
        axios.post(`${process.env.REACT_APP_BACK_END_URI}/sign-up`, {
            email,
            password
        }, {
            withCredentials: true
        })
        .then((response) => {
            window.location.href = `${process.env.REACT_APP_BACK_END_URI}/spotify-login`
        })
        .catch((error) => {
            notification.error({
                message: 'Network error',
                description: 'Please try again later'
            })
        })
    }
    render() {
        return(
           <div className={overallContainer}>
               <div className={textContainer}>
                    <h2 className={header}>Tell us a bit about yourself</h2>
                    <Input
                        placeholder='Email'
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        style={{
                            width: '80%',
                            margin: 'auto', 
                            display: 'block',
                            marginBottom: '20px'
                        }}
                        onChange={e => this.onEmailChange(e.target.value)}
                    />
                    <Password 
                        placeholder='Password'
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        style={{
                            width: '80%',
                            margin: 'auto', 
                            display: 'block',
                            marginBottom: '20px'
                        }}
                        onChange={e => this.onPasswordChange(e.target.value)}
                    />
                    <Password 
                        placeholder='Confirm Password'
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        style={{
                            width: '80%',
                            margin: 'auto', 
                            display: 'block',
                            marginBottom: '20px'
                        }}
                        onChange={e => this.onConfirmPasswordChange(e.target.value)}
                    />
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