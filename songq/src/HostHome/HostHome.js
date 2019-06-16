import React, { Component } from 'react'
import { Card, Skeleton } from 'antd'
import PlaylistNavBar from '../PlaylistNavBar'
import axios from 'axios'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './HostHome.module.css'
const { 
    card,
    lineDivider,
    overallContainer
} = styles

const { Meta } = Card

class HostHome extends Component {
    constructor(props) {
        super(props)
        axios.defaults.withCredentials = true
        this.state = {
            loading: true,
            playlists: ["placeholder"]
        }
        this.fetchPlaylists = this.fetchPlaylists.bind(this)
    }
    componentDidMount() {
        this.fetchPlaylists()
    }
    fetchPlaylists() {
        axios.get('http://localhost:5000/get-playlists', {}, { withCredentials: true })
            .then((response) => {
                this.setState({
                    playlists: response.data.playlists,
                    loading: false
                })
            })
            .catch((error) => {
                // TODO: Error Handling
            })
    }
    render() {
        return(
            <div className={overallContainer}>
                <PlaylistNavBar/>
                <hr className={lineDivider}/>
                <div>
                {
                    this.state.playlists.map((playlist, i) => 
                        <Card
                            className={card}
                            hoverable={true}
                        >
                            <Skeleton loading={this.state.loading} active>
                                <Meta
                                    title={playlist.playlistName}
                                    description={`Code: ${playlist.roomCode}`}
                                />
                            </Skeleton>
                        </Card>
                    )
                }
                </div>
            </div>
           
        )
    }
}

export default HostHome