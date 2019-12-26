import React, { Component } from 'react'
import { PageHeader, Button, Switch } from 'antd'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './GuestNavBar.module.css'
import { getHostname } from '../util'
const { 
    navBar,
    playlistName,
    subtitle
} = styles

class GuestNavBar extends Component {
    goHome() {
        window.location.href = `http://${getHostname()}/home`
    }
    lockPlaylist() {
        if (this.props.host) {
            localStorage.setItem('lockedUrl', `/requests?roomCode=${this.props.roomCode}&playlistName=${this.props.playlistName}&playlistId=${this.props.playlistId}`)
        } else {
            localStorage.setItem('lockedUrl', `/request-songs?playlistName=l${this.props.playlistName}&roomCode=${this.props.roomCode}`)
        }
    }
    unlockPlaylist() {
        localStorage.removeItem('lockedUrl')
    }
    // onLockChange(checked) {
    //     if (checked) {
    //         this.lockPlaylist()
    //     } else {
    //         this.unlockPlaylist()
    //     }
    // }
    buildExtraList() {
        // let extra = [<Switch onChange={this.onLockChange}/>]
        let extra = []
        if (this.props.homeButton) {
            extra.push(<Button onClick={() => this.goHome()}>Home</Button>)
        }
        return extra
    }
    render() {
        const extraList = this.buildExtraList()
        return(
            <PageHeader
                style={{ width: '100%'}}
                title={
                    <div>
                        <p className={playlistName}>
                            {this.props.playlistName}
                        </p>
                        <p className={subtitle}>
                            Code: {this.props.roomCode}
                        </p>
                    </div>}
                className={navBar}
                extra={extraList}
            />
        )
    }
}

export default GuestNavBar