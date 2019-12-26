import React, { Component } from 'react'
import axios from 'axios'
import queryString from 'query-string'
import GuestNavBar from '../GuestNavBar'
import Request from '../Request'
import { PageHeader, Button, Icon } from 'antd'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './ViewPlaylist.module.css'
const { 
    container,
    requestContainer
} = styles

class ViewPlaylist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            requests: [],
            playlistName: '', 
            playlistId: '',
            roomCode: '',
            gridView: true
        }
        axios.defaults.withCredentials = true
    }
    componentDidMount() {
        var rawQuery = queryString.parse(this.props.location.search)
        var { roomCode, playlistName, playlistId } = rawQuery
        this.setState({ 
            playlistName, 
            playlistId,
            roomCode
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
    serviceRequest = (requestId, songId, accepted) => {
        const playlistId = this.state.playlistId
        return new Promise(function(resolve, reject) {
            axios.post(`${process.env.REACT_APP_BACK_END_URI}/service-request`, {
                requestId,
                accepted,
                playlistId: playlistId,
                songId
            }, {
                withCredentials: true
            })
            .then((response) => {
                if (response.status !== 200) {
                    reject()
                } else {
                    document.getElementById(requestId).style.display = 'none'
                    resolve()
                }
            })
            .catch((err) => {
                document.getElementById(requestId).style.display = 'block'
                reject()
            })
        })
    }
    render() {
        return(
            <div>
                <GuestNavBar 
                    playlistName={this.state.playlistName}
                    roomCode={this.state.roomCode}
                    playlistId={this.state.playlistId}
                    host={true}
                    homeButton
                />
                <div className={container}>
                    <PageHeader 
                        title={"Requests"}
                        style={{
                            borderBottom: '2px solid rgb(235, 237, 240)',
                            width: '100%',
                            textAlignLast: 'left'
                        }}
                        // extra={[
                        //     <Icon 
                        //         type='appstore' 
                        //         style={this.state.gridView ? {color: '#1690FF'} : {}}
                        //     />,
                        //     <Icon 
                        //         type='bars' 
                        //         style={this.state.gridView ? {} : {color: '#1690FF'}}
                        //     />
                        // ]}
                    />
                    {
                        this.state.requests.map((request, i) => 
                            <div className={requestContainer} id={request.id}>
                                <Request
                                    key={i}
                                    request={request}
                                    serviceRequest={this.serviceRequest}
                                    // popoverId={i}
                                    gridView={this.state.gridView}
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