import React, { Component } from 'react'
import { notification } from 'antd'
import PlaylistNavBar from '../PlaylistNavBar'
import PlaylistList from '../PlaylistList'
import { getHostname } from '../util'
import axios from 'axios'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './HostHome.module.css'
const { 
    lineDivider,
    overallContainer,
} = styles

class HostHome extends Component {
    constructor(props) {
        super(props)
        axios.defaults.withCredentials = true
        this.state = {
            loading: true,
            playlists: ["placeholder"],
        }
    }
    componentDidMount = () => {
        this.fetchPlaylists()
    }
    fetchPlaylists = () => {
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
    render() {
        return(
            <div>
                <div className={overallContainer}>
                    <PlaylistNavBar />
                    <hr className={lineDivider}/>
                    <PlaylistList 
                        playlists={this.state.playlists} 
                        loading={this.state.loading} 
                    />
                </div>
            </div>
        )
    }
}

export default HostHome