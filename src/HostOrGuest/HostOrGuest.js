import React, { Component } from 'react'
import '../main.css'
import styles from './HostOrGuest.module.css'
const {
    hostOrGuestContainer,
    hostOrGuestTextContainer,
    welcomeHeader,
    hostGuestButton,
    question
} = styles

class HostOrGuest extends Component {
    render() {
        return(
            <div className={hostOrGuestContainer}>
                <div className={hostOrGuestTextContainer}>
                    <h1 className={welcomeHeader}>Welcome to SongQ</h1>
                    <p className={question}>Are you a host or a guest?</p>
                    <button 
                        className={hostGuestButton}
                        onClick={this.props.changeToHostView}
                    >
                        HOST
                    </button>
                    <button
                        className={hostGuestButton}
                        onClick={this.props.changeToGuestView}
                    >
                        GUEST
                    </button>
                </div>
            </div>
        )
    }
}

export default HostOrGuest