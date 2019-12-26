import React, { Component } from 'react'
import CreateNavBar from '../CreateNavBar'
import axios from 'axios'
import Input from 'muicss/lib/react/input'
import { Button, Radio, Select, notification } from 'antd'
import { getHostname } from '../util'
import { geolocated } from 'react-geolocated'
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
            playlistId: '',
            locationEnabled: false,
            latitude: null,
            longitude: null
        }
        axios.defaults.withCredentials = true
        this.onPublicChange = this.onPublicChange.bind(this)
        this.onPlaylistNameChange = this.onPlaylistNameChange.bind(this)
        this.createPlaylist = this.createPlaylist.bind(this)
        this.onPlaylistNameTypeChange = this.onPlaylistNameTypeChange.bind(this)
        this.onExistingPlaylistChange = this.onExistingPlaylistChange.bind(this)
        this.onLocationEnabledChange = this.onLocationEnabledChange.bind(this)
    }
    componentDidMount() {
        axios.post(`${process.env.REACT_APP_BACK_END_URI}/get-existing-playlists`, {}, {
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
        var useExistingPlaylist = this.state.playlistNameType === 'new' ? false : true
        if (this.props.coords !== null) {
            this.setState({
                latitude: this.props.latitude,
                longitude: this.props.longitude
            })
        }
        axios.post(`${process.env.REACT_APP_BACK_END_URI}/create-playlist`, {
            playlistName: this.state.playlistName,
            playlistIsByLocation: this.state.locationEnabled,
            playlistIsPublic: this.state.playlistIsPublic,
            useExistingPlaylist,
            playlistId: this.state.playlistId,
            latitude: this.state.latitude,
            longitude: this.state.longitude
        }, {
            withCredentials: true
        })
        .then(() => {
            window.location.href = `http://${getHostname()}/home`
        })
        .catch((error) => {
            if (error.response.status === 400) {
                if (error.response.data.err === 'playlist already used') {
                    notification.error({
                        message: 'Invalid playlist',
                        description: 'You have already used that playlist for another party'
                    })
                }
            }
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
    onLocationEnabledChange(e) {
        this.setState({ locationEnabled: e.target.value })
        if (this.props.isGeolocationAvailable) {
            if (this.props.isGeolocationEnabled) {
                if (this.props.coords !== null) {
                    this.setState({
                        latitude: this.props.coords.latitude,
                        longitude: this.props.coords.longitude
                    })
                }
            }
        }
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
                    <h4>Would you like for people near you to see your playlist?</h4>     
                    <Group
                        onChange={this.onLocationEnabledChange}
                        value={this.state.locationEnabled}
                    >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                    </Group>               
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

// export default CreatePlaylist

export default geolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  })(CreatePlaylist)