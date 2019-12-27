import React, { Component } from 'react'
import { Card, Skeleton } from 'antd'
import { getHostname } from '../util'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './PlaylistList.module.css'

const {
    card,
    text
} = styles


const { Meta } = Card

class PlaylistList extends Component {
    showPlaylists(roomCode, playlistName, playlistId) {
        window.location.href = `http://${getHostname()}/requests?roomCode=${roomCode}&playlistName=${playlistName}&playlistId=${playlistId}`
    }
    render() {
        return (
            <div>
                {
                    this.props.playlists.map((playlist, i) => 
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
                            <Skeleton loading={this.props.loading} active>
                                <Meta
                                    title={<p className={text}>{playlist.playlistName}</p>}
                                    description={<p className={text}>{`Code: ${playlist.roomCode}`}</p>}
                                />
                            </Skeleton>
                        </Card>
                    )
                }                
            </div>
        )
    }          
}

export default PlaylistList

