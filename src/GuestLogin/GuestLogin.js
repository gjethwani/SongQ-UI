import React, { Component } from 'react'
import { Input, notification } from 'antd'
import axios from 'axios'
import { getHostname } from '../util'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './GuestLogin.module.css'
const { 
    container,
    textContainer,
    roomCodeInput,
    button
} = styles

class GuestLogin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roomCode: '',
            refs: [],
        }
        axios.defaults.withCredentials = true
    }
    onRoomCodeChange = (roomCode) => {
        if (roomCode.length < 5)  {
            this.setState({ roomCode })
        }
    }
    authenticateRoomCode = () => {
        var { roomCode } = this.state
        if (roomCode.length < 4) {
            notification.error({
                message: 'Invalid room code',
                description: 'Please check whether the room code is correct'
            })
            return
        }
        axios.post(`${process.env.REACT_APP_BACK_END_URI}/check-playlist-exists`, {
            roomCode
        }, {
            withCredentials: true
        })
        .then((response) => {
            const { playlistExists, playlistName } = response.data
            if (playlistExists) {
                axios.post(`${process.env.REACT_APP_BACK_END_URI}/guest-login`, {}, {
                    withCredentials: true
                })
                .then((response) => {
                    window.location.href = `http://${getHostname()}/request-songs?playlistName=${playlistName}&roomCode=${this.state.roomCode}`
                })
                .catch(error => {
                    notification.error({
                        message: 'Could not connect to spotify',
                        description: 'Please try again later'
                    })
                })
            } else {
                notification.error({
                    message: 'Playlist does not exist',
                    description: 'Please check whether the room code is correct',
                })
            }
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
            <div className={container}>
                <div className={textContainer}>
                    <Input
                        value={this.state.roomCode}
                        onChange={e => this.onRoomCodeChange(e.target.value)}
                        className={roomCodeInput}
                    />
                    <button 
                        className={button}
                        onClick={this.authenticateRoomCode}
                    >
                        JOIN THE PARTY
                    </button>
                    <button
                        className={button}
                        onClick={this.props.switchToLocationBased}
                    >
                        FIND PARTIES BY LOCATION
                    </button>
                </div>
            </div>
        )
    }
}

export default GuestLogin