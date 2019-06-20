import React, { Component } from 'react'
import { Input } from 'antd'
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
            error: ''
        }
        this.onDigitChange = this.onDigitChange.bind(this)
        this.authenticateRoomCode = this.authenticateRoomCode.bind(this)
        var refs = []
        this.state.roomCode.map(() => {
            refs.push(React.createRef())
        })
        this.state.refs = refs
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
            this.setState({
                error: 'Invalid room code'
            })
            return
        }
        roomCode = roomCode.join('')
        console.log(roomCode)
        axios.post('http://localhost:5000/check-playlist-exists', {
            roomCode
        }, {
            withCredentials: true
        })
        .then((response) => {
            const { playlistExists, playlistName } = response.data
            this.setState({ playlistName })
            if (playlistExists) {
                axios.post('http://localhost:5000/guest-login', {}, {
                    withCredentials: true
                })
                .then((response) => {
                    console.log(response.status)
                    window.location.href = `http://${getHostname()}/request-songs?playlistName=${this.state.playlistName}&roomCode=${this.state.roomCode.join('')}`
                })
                .catch(error => {
                    this.setState({
                        error: 'Could not connect with spotify'
                    })
                })
            } else {
                this.setState({
                    error: 'Playlist does not exist'
                })
            }
        })
        .catch((error) => {
            // TODO: Error handling
            console.log(error)
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
                                style={i === 0 ? {'margin-left': '0'} : {}}
                            />
                        )
                    }
                    <button 
                        className={button}
                        onClick={this.authenticateRoomCode}
                    >
                        JOIN THE PARTY
                    </button>
                    <p>{this.state.error}</p>
                </div>
            </div>
        )
    }
}

export default GuestLogin