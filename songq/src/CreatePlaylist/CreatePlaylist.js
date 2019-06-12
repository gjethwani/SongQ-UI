import React, { Component } from 'react'
import axios from 'axios'

class CreatePlaylist extends Component {
    createPlaylist() {
        axios.post('http://localhost:5000/create-playlist', {
            playlistName: 'test-playlist',
            playlistIsByLocation: false,
            playlistIsPublic: false,
        }, {
            withCredentials: true
        })
        .then(function(response) {
            console.log(response)
        })
        .catch(function(error) {
            console.log(error)
        })
    }
    getPlaylists() {
        axios.get('http://localhost:5000/get-playlists', {
            someParam: "here"
        }, {
            withCredentials: true
        })
        .then(function(response) {
            console.log(response)
        })
        .catch(function(error) {
            console.log(error)
        })
    }
    render() {
        return(
            <button onClick={this.getPlaylists}>Create Playlist</button>
        )
    }
}

export default CreatePlaylist