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
    render() {
        return(
            <PageHeader
                backIcon={false}
                title="Playlists"
                style={{ width: '100%'}}
                extra={[
                    <Button 
                        key="1"
                        onClick={this.createPlaylist}
                    >
                        Create
                    </Button>,
                ]}
            />
        )
    }
}

export default PlaylistNavBar