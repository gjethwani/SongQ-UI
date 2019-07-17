import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import axios from 'axios'
import { getHostname } from '../util'
import styles from './PlaylistMap.module.css'
import '../main.css'
import 'antd/dist/antd.css'
const {
    marker,
    map
} = styles

class PlaylistMap extends Component {
    constructor(props) {
        super(props)
    }
    goToPlaylist(name, roomCode) {
        axios.post(`${process.env.REACT_APP_BACK_END_URI}/guest-login`, {}, {
            withCredentials: true
        })
        .then((response) => {
            window.location.href = `http://${getHostname()}/request-songs?playlistName=${name}&roomCode=${roomCode}`
        })
        .catch(error => {
            this.setState({
                error: 'Could not connect with spotify'
            })
        })
    }
    render() {
        var { currLatitude, currLongitude } = this.props
        return(
            <div style={{ height: '100vh', width: '100%' }} className={map}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyCsW6xaXYfBDeuyzfgkGcPtHYL55hvGLTg" }}
                    defaultCenter={{
                        lat: currLatitude,
                        lng: currLongitude
                    }}
                    defaultZoom={15}
                >
                    {this.props.nearbyPlaylists.map((playlist, i) => 
                        <div
                            lat={playlist.latitude}
                            lng={playlist.longitude}
                        >
                            <p 
                                className={marker}
                                onClick={() => this.goToPlaylist(
                                    playlist.playlistName,
                                    playlist.roomCode
                                )}
                            >
                                {playlist.playlistName
                            }</p>
                        </div>
                    )
                    }
                </GoogleMapReact>
            </div>
        )
    }
}

export default PlaylistMap