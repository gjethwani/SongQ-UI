import React, { Component } from 'react'
import '../main.css'
import styles from './HostOrGuest.module.css'
const {
    hostOrGuestContainer,
    hostOrGuestTextContainer,
    welcomeHeader,
    hostGuestButton
} = styles

class HostOrGuest extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <div className={hostOrGuestContainer}>
                <div className={hostOrGuestTextContainer}>
                    <h1 className={welcomeHeader}>Welcome to SongQ</h1>
                    <p>Are you a host or a guest?</p>
                    <button 
                        className={hostGuestButton}
                        onClick={this.props.changeToHostView}
                    >
                        Host
                    </button>
                    <button
                        className={hostGuestButton}
                    >
                        Guest
                    </button>
                </div>
            </div>
        )
    }
}

export default HostOrGuest