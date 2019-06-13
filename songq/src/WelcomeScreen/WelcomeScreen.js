import React, { Component } from 'react'
import './WelcomeScreen.css'

class WelcomeScreen extends Component {
    render() {
        return(
            <div className='welcome-screen-container'>
                <div className='welcome-screen-text-container'>
                    <h2>Welcome to SongQ</h2>
                    <p>Are you new here?</p>
                    <button>Log in</button>
                    <button>Sign up</button>
                </div>
                
            </div>
        )
    }
}

export default WelcomeScreen