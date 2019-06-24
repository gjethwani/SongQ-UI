import React, { Component } from 'react'
import CreateNavBar from '../CreateNavBar'
import axios from 'axios'
import Input from 'muicss/lib/react/input'
import { Button, Radio, Select } from 'antd'
import { getHostname } from '../util'
import styles from './CreatePlaylist.module.css'
import 'muicss/dist/css/mui.min.css'
import 'antd/dist/antd.css'
import '../main.css'

const { Group } = Radio
const { Option } = Select

const {
    createContainer,
    createButton,
    existingPlaylists,
    option
} = styles

class CreatePlaylist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playlistName: '',
            playlistIsPublic: false,
            playlistNameType: "new",
            existingPlaylists: [],
            existingPlaylistsLoading: true,
            playlistId: ''
        }
        axios.defaults.withCredentials = true
        this.onPublicChange = this.onPublicChange.bind(this)
        this.onPlaylistNameChange = this.onPlaylistNameChange.bind(this)
        this.createPlaylist = this.createPlaylist.bind(this)
        this.onPlaylistNameTypeChange = this.onPlaylistNameTypeChange.bind(this)
        this.onExistingPlaylistChange = this.onExistingPlaylistChange.bind(this)
    }
    componentDidMount() {
        axios.post('http://localhost:5000/get-existing-playlists', {}, {
            withCredentials: true
        })
        .then((response) => {
            const { playlists } = response.data
            this.setState({
                existingPlaylistsLoading: false,
                existingPlaylists: playlists
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }
    createPlaylist() {
        var useExistingPlaylist = this.state.playlist === 'new' ? false : true
        axios.post('http://localhost:5000/create-playlist', {
            playlistName: this.state.playlistName,
            playlistIsByLocation: false,
            playlistIsPublic: this.state.playlistIsPublic,
            useExistingPlaylist,
            playlistId: this.state.playlistId
        }, {
            withCredentials: true
        })
        .then((response) => {
            window.location.href = `http://${getHostname()}/home`
        })
        .catch((error) => {
            console.log(error)
        })
    }
    onPublicChange(e) {
        this.setState({ playlistIsPublic: e.target.value })
    }
    onPlaylistNameChange(e) {
        this.setState({ playlistName: e.target.value })
    }
    onExistingPlaylistChange(id) {
        const playlistName = document.getElementById(id).innerHTML
        this.setState({ 
            playlistId: id, 
            playlistName
        })
    }
    onPlaylistNameTypeChange(e) {
        this.setState({ playlistNameType: e.target.value })
    }
    render() {
        return(
            <div>
                <CreateNavBar/>
                <div className={createContainer}>
                    <h4>Would you like to create a new Spotify playlist or choose an existing one?</h4>
                    <Group 
                        onChange={this.onPlaylistNameTypeChange}
                        value={this.state.playlistNameType}
                    >
                        <Radio value={'new'}>New</Radio>
                        <Radio value={'existing'}>Existing</Radio>
                    </Group>
                    {this.state.playlistNameType === 'new' && <Input 
                        label="Playlist Name"
                        floatingLabel={true}
                        onChange={this.onPlaylistNameChange}
                    />}
                    {this.state.playlistNameType === 'existing' && 
                        <Select
                            onChange={this.onExistingPlaylistChange}
                            className={existingPlaylists}
                            value={this.state.playlistId}
                        >
                            {this.state.existingPlaylists.map((playlist, i) => 
                                <Option 
                                    key={i} 
                                    id={playlist.id}
                                    value={playlist.id}
                                    className={option}
                                >
                                    {playlist.name}
                                </Option>
                            )}
                        </Select>
                    }
                   {this.state.playlistNameType === 'new' && <div>
                       <h4>Do you want your Spotify playlist to be public?</h4>
                        <Group 
                            onChange={this.onPublicChange}
                            value={this.state.playlistIsPublic}
                        >
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                        </Group>
                        </div>
                    }
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