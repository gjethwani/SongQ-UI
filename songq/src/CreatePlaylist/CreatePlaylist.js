import React, { Component } from 'react'
import CreateNavBar from '../CreateNavBar'
import axios from 'axios'
import Input from 'muicss/lib/react/input'
import { Button, Radio } from 'antd'
import { getHostname } from '../util'
import styles from './CreatePlaylist.module.css'
import 'muicss/dist/css/mui.min.css'
import 'antd/dist/antd.css'
import '../main.css'

const { Group } = Radio

const {
    createContainer,
    createButton
} = styles

class CreatePlaylist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playlistName: '',
            playlistIsPublic: false
        }
        axios.defaults.withCredentials = true
        this.onPublicChange = this.onPublicChange.bind(this)
        this.onPlaylistNameChange = this.onPlaylistNameChange.bind(this)
        this.createPlaylist = this.createPlaylist.bind(this)
    }
    createPlaylist() {
        axios.post('http://localhost:5000/create-playlist', {
            playlistName: this.state.playlistName,
            playlistIsByLocation: false,
            playlistIsPublic: this.state.playlistIsPublic,
        }, {
            withCredentials: true
        })
        .then(function(response) {
            console.log(response)
            window.location.href = `http://${getHostname()}/home`
        })
        .catch(function(error) {
            console.log(error)
        })
    }
    onPublicChange(e) {
        this.setState({ playlistIsPublic: e.target.value })
    }
    onPlaylistNameChange(e) {
        this.setState({ playlistName: e.target.value })
    }
    render() {
        return(
            <div>
                <CreateNavBar/>
                <div className={createContainer}>
                    <Input 
                        label="Playlist Name"
                        floatingLabel={true}
                        onChange={this.onPlaylistNameChange}
                    />
                    <h4>Do you want your Spotify playlist to be public?</h4>
                    <Group 
                        onChange={this.onPublicChange}
                        value={this.state.playlistIsPublic}
                    >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                    </Group>
                    <br/>
                    <Button 
                        onClick={this.createPlaylist}
                        type="primary"
                        className={createButton}
                    >
                        Create
                    </Button>
                </div>
            </div>
        )
    }
}

export default CreatePlaylist