import React, { Component } from 'react'
import axios from 'axios'

class Login extends Component {
    submitForm() {
        axios.post('http://localhost:5000/login', {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        }, {
            withCredentials: true
        })
        .then(function(response) {
            var { needToSpotifyAuth, spotifyRefresh } = response.data
            if (needToSpotifyAuth) {
                if (spotifyRefresh) {
                    window.location.href = 'http://localhost:5000/spotify-refresh-token'
                } else {
                    window.location.href = 'http://localhost:5000/spotify-login'
                }
            } else {
                window.location.href = 'http://localhost:3000/home'
            }
        })
        .catch(function(error) {
            console.log(error)
        })
    }
    render() {
        return(
            <div>
                <input id='email' type='text'/>
                <input id='password' type ='password'/>
                <button onClick={this.submitForm}>Submit</button>
            </div>
        )
    }
}

export default Login