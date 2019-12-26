import React, { Component } from 'react'
import { Card, Skeleton, notification } from 'antd'
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
    text,
} = styles

const { Meta } = Card

class HostHome extends Component {
    constructor(props) {
        super(props)
        axios.defaults.withCredentials = true
        this.state = {
            loading: true,
            playlists: ["placeholder"],
        }
        this.fetchPlaylists = this.fetchPlaylists.bind(this)
        this.showPlaylists = this.showPlaylists.bind(this)
    }
    componentDidMount() {
        this.fetchPlaylists()
    }
    fetchPlaylists() {
        axios.get(`${process.env.REACT_APP_BACK_END_URI}/get-playlists`, {}, { withCredentials: true })
            .then((response) => {
                this.setState({
                    playlists: response.data.playlists.reverse(),
                    loading: false
                })
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    window.location.href = `http://${getHostname()}/`
                } else {
                    notification.error({
                        message: 'Something went wrong',
                        description: 'Please try again'
                    })
                }
                
            })
    }
    showPlaylists(roomCode, playlistName, playlistId) {
        window.location.href = `http://${getHostname()}/requests?roomCode=${roomCode}&playlistName=${playlistName}&playlistId=${playlistId}`
    }
    render() {
        return(
            <div>
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
                                style={{'display': 'flex'}}
                                key={i}
                            >   
                                {   
                                    <img 
                                        src={playlist.image && playlist.image.length > 2 ? playlist.image[2].url : `${process.env.PUBLIC_URL}/playlist-icon/playlist-icon-60.png`}
                                        alt='Playlist Thumbnail'
                                    />
                                }
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
            </div>
        )
    }
}

export default HostHome