import React, { Component } from 'react'
import axios from 'axios'
import queryString from 'query-string'
import GuestNavBar from '../GuestNavBar'
import Request from '../Request'
import AcceptRejectCircle from '../AcceptRejectCircle'
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
            playlistId: '',
            showAccept: false,
            showReject: false
        }
        axios.defaults.withCredentials = true
        this.onShowAcceptChange = this.onShowAcceptChange.bind(this)
        this.onShowRejectChange = this.onShowRejectChange.bind(this)
        this.serviceRequest = this.serviceRequest.bind(this)
    }
    componentDidMount() {
        var rawQuery = queryString.parse(this.props.location.search)
        var { roomCode, playlistName, playlistId } = rawQuery
        this.setState({ 
            playlistName, 
            playlistId 
        })
        axios.get(`${process.env.REACT_APP_BACK_END_URI}/get-requests?roomCode=${roomCode}`, {}, {
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
    onShowRejectChange(val) {
        this.setState({
            showReject: val
        })
    }
    serviceRequest(requestId, songId, accepted) {
        document.getElementById(requestId).style.display = 'none'
        axios.post(`${process.env.REACT_APP_BACK_END_URI}/service-request`, {
            requestId,
            accepted,
            playlistId: this.state.playlistId,
            songId
        }, {
            withCredentials: true
        })
        .then((response) => {
            console.log(response.status)
        })
        .catch((err) => {
            document.getElementById(requestId).style.display = 'block'
            console.log(err)
        })
    }
    render() {
        return(
            <div>
                <GuestNavBar 
                    playlistName={this.state.playlistName}
                />
                {this.state.showAccept && 
                    <AcceptRejectCircle 
                        serviceRequest={this.serviceRequest} 
                        playlistId={this.state.playlistId}
                        accept={true}
                    />
                }
                {this.state.showReject && 
                    <AcceptRejectCircle 
                        serviceRequest={this.serviceRequest} 
                        playlistId={this.state.playlistId}
                        accept={false}
                    />
                }
                <div className={container}>
                    {
                        this.state.requests.map((request, i) => 
                            <div id={request.id}>
                                <Request
                                    request={request}
                                    onShowAcceptChange={this.onShowAcceptChange}
                                    onShowRejectChange={this.onShowRejectChange}
                                />  
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default ViewPlaylist