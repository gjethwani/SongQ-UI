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
            roomCode: ['-','-','-','-'],
            refs: [],
            playlistName: '',
        }
        this.onDigitChange = this.onDigitChange.bind(this)
        this.authenticateRoomCode = this.authenticateRoomCode.bind(this)
        var refs = []
        this.state.roomCode.map(() => {
            refs.push(React.createRef())
        })
        this.state.refs = refs
        axios.defaults.withCredentials = true
    }
    onDigitChange(digit, value) {
        var { roomCode } = this.state
        var currDigit = roomCode[digit]
        if (value === '') {
            value = '-'
            if (digit > 0) {
                this.state.refs[digit - 1].current.focus()
            }
        } else if (currDigit !== '-') {
            return
        } else {
            if (digit < 3) {
                this.state.refs[digit + 1].current.focus()
            }
        }
        roomCode[digit] = value
        this.setState({ roomCode })
    }
    authenticateRoomCode() {
        var { roomCode } = this.state
        var badRoomCode = false
        roomCode.map((r) => {
            if (r === '-') {
                badRoomCode = true
                return
            }
        })
        if (badRoomCode) {
            notification.error({
                message: 'Invalid room code',
                description: 'Please check whether the room code is correct'
            })
            return
        }
        roomCode = roomCode.join('')
        axios.post(`${process.env.REACT_APP_BACK_END_URI}/check-playlist-exists`, {
            roomCode
        }, {
            withCredentials: true
        })
        .then((response) => {
            const { playlistExists, playlistName } = response.data
            this.setState({ playlistName })
            if (playlistExists) {
                axios.post(`${process.env.REACT_APP_BACK_END_URI}/guest-login`, {}, {
                    withCredentials: true
                })
                .then((response) => {
                    console.log(response.status)
                    window.location.href = `http://${getHostname()}/request-songs?playlistName=${this.state.playlistName}&roomCode=${this.state.roomCode.join('')}`
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
                    {
                        this.state.roomCode.map((_, i) => 
                            <Input
                                value={this.state.roomCode[i] === '-'? '' : this.state.roomCode[i]}
                                onChange={e => this.onDigitChange(i, e.target.value)}
                                className={roomCodeInput}
                                ref={this.state.refs[i]}
                                style={i === 0 ? {'marginLeft': '0'} : {}}
                            />
                        )
                    }
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