import React, { Component } from 'react'
import axios from 'axios'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './SearchResults.module.css'
const {
    albumArt,
    title,
    cardContainer,
    artist,
    container
} = styles

class PlaylistNavBar extends Component {
    constructor(props) {
        super(props)
        this.joinArtists = this.joinArtists.bind(this)
    }
    joinArtists(artists) {
        var artistsJoined = ''
        artists.forEach((artist, i) => {
            artistsJoined += artist.name
            if (i !== artists.length - 1) {
                artistsJoined += ','
            }
        })
        return artistsJoined
    }
    makeRequest(songData) {
        var requestData = {
            ...songData,
            roomCode: this.props.roomCode
        }
        axios.post('http://localhost:5000/make-request', requestData, {
            withCredentials: true
        })
        .then((response) => {
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
                            <img 
                                src={track.album.images[1].url} 
                                className={albumArt}
                                onClick={() => this.makeRequest({
                                    songId: track.id,
                                    songName: track.name,
                                    artists: this.joinArtists(track.artists),
                                    album: track.album.name,
                                    albumArt: track.album.images[1].url
                                })}
                            />
                            <p className={title}>{track.name}</p>
                            <p className={artist}>{this.joinArtists(track.artists)}</p>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default PlaylistNavBar