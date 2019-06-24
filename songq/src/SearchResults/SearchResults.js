import React, { Component } from 'react'
import { Icon } from 'antd'
import { joinArtists } from '../util'
import axios from 'axios'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './SearchResults.module.css'
const {
    albumArt,
    title,
    cardContainer,
    artist,
    container,
    added,
    innerDiv
} = styles

class PlaylistNavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            added: []
        }
    }
    makeRequest(index, songData) {
        var { added } = this.state
        if (added.includes(index)) {
            return
        }
        var requestData = {
            ...songData,
            roomCode: this.props.roomCode
        }
        axios.post(`${process.env.REACT_APP_BACK_END_URI}/make-request`, requestData, {
            withCredentials: true
        })
        .then((response) => {
            added.push(index)
            this.setState({ added })
            console.log(response.status)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    render() {
        return(
            <div className={container}>
                {
                    this.props.searchResults.map((track, i) => 
                        <div className={cardContainer}>
                            <div
                                className={albumArt}
                                style={{
                                    'backgroundImage': `url(${track.album.images[1].url})`,
                                }}
                                onClick={() => this.makeRequest(i, {
                                    songId: track.id,
                                    songName: track.name,
                                    artists: joinArtists(track.artists),
                                    album: track.album.name,
                                    albumArt: track.album.images[1].url
                                })}
                            >
                                {this.state.added.includes(i) && <div
                                    style={{'backgroundColor': `rgba(0,0,0,0.8)`}}
                                    className={innerDiv}
                                >
                                    <Icon 
                                        type="check-circle" 
                                        theme="twoTone" 
                                        className={added}
                                    />
                                </div>}
                            </div>
                            <p className={title}>{track.name}</p>
                            <p className={artist}>{joinArtists(track.artists)}</p>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default PlaylistNavBar