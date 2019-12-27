import React, { Component } from 'react'
import { PageHeader, Button, Switch, Icon } from 'antd'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './GuestNavBar.module.css'
import { getHostname } from '../util'
const { 
    navBar,
    playlistName,
    subtitle,
    lock
} = styles

class GuestNavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            locked: this.props.locked
        }
    }
    goHome() {
        window.location.href = `http://${getHostname()}/home`
    }
    lockPlaylist() { 
        const playlistData = {
            host: this.props.host,
            roomCode: this.props.roomCode,
            playlistName: this.props.playlistName
        }
        if (this.props.host) {
            playlistData.playlistId = this.props.playlistId
        }
        localStorage.setItem('lockedPlaylist', JSON.stringify(playlistData))
    }
    unlockPlaylist() {
        localStorage.removeItem('lockedPlaylist')
    }
    onLockChange(checked) {
        if (checked) {
            this.lockPlaylist()
            this.setState({ locked: true })
        } else {
            this.unlockPlaylist()
            this.setState({ locked: false })
        }
    }
    render() {
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
                extra={[
                    <Switch
                        checkedChildren={<Icon type='lock' />}
                        unCheckedChildren={<Icon type='unlock' />}
                        onChange={(checked) => this.onLockChange(checked)}
                        checked={this.state.locked}
                        className={lock}
                    />,
                    <Button 
                        onClick={() => this.goHome()}
                        key="1"
                    >
                        Home
                    </Button>,
                ]}
            />
        )
    }
}

export default GuestNavBar