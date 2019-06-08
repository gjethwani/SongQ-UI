import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router'

class Playground extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }
        this.redirect = this.redirect.bind(this)
    }
    submitForm() {
        axios.post('http://localhost:5000/login', {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        }, {
            withCredentials: true
        })
        .then(function(response) {
            console.log(response)
        })
        .catch(function(error) {
            console.log(error)
        })
    }
    redirect() {
        window.location.href = 'http://localhost:5000/spotify-login'
    }
    render() {
        return(
            <div>
                <input id='email' type='text'/>
                <input id='password' type ='password'/>
                <button onClick={this.redirect}>Submit</button>
                {/* {this.state.redirect && <Redirect push to={'http://localhost:5000/spotify-login'}/> } */}
            </div>
        )
    }
}

export default Playground