import React, { Component } from 'react'
import { Card, Skeleton } from 'antd'
import PlaylistNavBar from '../PlaylistNavBar'
import { getHostname } from '../util'
import axios from 'axios'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './HostHome.module.css'
const { 
    card,
    lineDivider,
    overallContainer,
    text
} = styles

const { Meta } = Card

class HostHome extends Component {
    constructor(props) {
        super(props)
        axios.defaults.withCredentials = true
        this.state = {
            loading: true,
            playlists: ["placeholder"]
        }
        this.fetchPlaylists = this.fetchPlaylists.bind(this)
        this.showPlaylists = this.showPlaylists.bind(this)
    }
    componentDidMount() {
        this.fetchPlaylists()
    }
    fetchPlaylists() {
        axios.get('http://localhost:5000/get-playlists', {}, { withCredentials: true })
            .then((response) => {
                this.setState({
                    playlists: response.data.playlists,
                    loading: false
                })
            })
            .catch((error) => {
                // TODO: Error Handling
            })
    }
    showPlaylists(roomCode, playlistName, playlistId) {
        window.location.href = `http://${getHostname()}/requests?roomCode=${roomCode}&playlistName=${playlistName}&playlistId=${playlistId}`
    }
    render() {
        return(
                <div className={overallContainer}>
                    <PlaylistNavBar />
                    <hr className={lineDivider}/>
                    <div>
                    {
                        this.state.playlists.map((playlist, i) => 
                            <Card
                                className={card}
                                hoverable={true}
                                onClick={() => this.showPlaylists(playlist.roomCode, playlist.playlistName, playlist.spotifyPlaylistId)}
                            >
                                <Skeleton loading={this.state.loading} active>
                                    <Meta
                                        title={<p className={text}>{playlist.playlistName}</p>}
                                        description={<p className={text}>{`Code: ${playlist.roomCode}`}</p>}
                                    />
                                </Skeleton>
                            </Card>
                        )
                    }
                    </div>
                </div>
        )
    }
}

export default HostHome