import React, { Component } from 'react'
import axios from 'axios'
import queryString from 'query-string'
import GuestNavBar from '../GuestNavBar'
import Request from '../Request'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './ViewPlaylist.module.css'
const { 
    container,
    acceptDrop
} = styles

class ViewPlaylist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            requests: [],
            playlistName: '', 
            showAccept: false
        }
        axios.defaults.withCredentials = true
        this.onShowAcceptChange = this.onShowAcceptChange.bind(this)
    }
    componentDidMount() {
        var rawQuery = queryString.parse(this.props.location.search)
        var { roomCode, playlistName } = rawQuery
        this.setState({ playlistName })
        axios.get(`http://localhost:5000/get-requests?roomCode=${roomCode}`, {}, {
            withCredentials: true
        })
        .then((response) => {
            var { requests } = response.data
            this.setState({ requests })
        })
        .catch((error) => {
            console.log(error)
        })
    }
    onShowAcceptChange(val) {
        this.setState({
            showAccept: val
        })
    }
    render() {
        return(
            <div>
                <GuestNavBar 
                    playlistName={this.state.playlistName}
                />
                {this.state.showAccept && <div className={acceptDrop}></div>}
                <div className={container}>
                    {
                        this.state.requests.map((request, i) => 
                            <Request
                                request={request}
                                onShowAcceptChange={this.onShowAcceptChange}
                            />  
                        )
                    }
                </div>
            </div>
        )
    }
}

export default ViewPlaylist