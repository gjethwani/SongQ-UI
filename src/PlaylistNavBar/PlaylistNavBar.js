import React, { Component } from 'react'
import { PageHeader, Button } from 'antd'
import { getHostname } from '../util.js'
import '../main.css'
import 'antd/dist/antd.css'

class PlaylistNavBar extends Component {
    constructor(props) {
        super(props)
        this.createPlaylist = this.createPlaylist.bind(this)
    }
    createPlaylist() {
        window.location.href = `http://${getHostname()}/create-playlist`
    }
    switchToGuest() {
        window.location.href = `http://${getHostname()}?mode=guest`
    }
    render() {
        return(
            <PageHeader
                backIcon={false}
                title={<span style={{'color': 'black'}}>Playlists</span>}
                style={{ width: '100%'}}
                extra={[
                    <Button 
                        key="1"
                        onClick={this.createPlaylist}
                    >
                        Create Playlist
                    </Button>,
                    <Button 
                        key="2"
                        onClick={this.switchToGuest}
                    >
                        Swtich to Guest
                    </Button>,
                ]}
            />
        )
    }
}

export default PlaylistNavBar