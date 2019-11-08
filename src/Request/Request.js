import React, { Component } from 'react'
import '../main.css'
import 'antd/dist/antd.css'
import { Button, Popover, notification, Icon } from 'antd'
import styles from './Request.module.css'

const {
    cardContainer,
    albumArt, 
    title,
    artist,
    innerDiv,
    added
} = styles


class Request extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        }
    }
    serviceRequest(requestId, songId, accepted) {
        this.setState({ loading: true })
        this.props.serviceRequest(requestId, songId, accepted)
            .catch(() => {
                notification.error({
                    message: `Could not ${accepted ? 'accept' : 'reject'} request`,
                    description: 'Please try again later'
                })
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }
    render() {
        const { request } = this.props
        return (
            <div>
                <Popover
                    trigger={'click'}
                    content={(
                        <div>
                            <Button 
                                style={{borderColor: '#52c41a', 
                                backgroundColor: '#F6FFED', 
                                color: '#52c41a',
                                width: '100%'}}
                                onClick={() => this.serviceRequest(request.id, request.songId, true)}
                            >
                                Accept
                            </Button>
                            <Button
                                style={{borderColor: '#F5212D', 
                                backgroundColor: '#FFEDED', 
                                color: '#F5212D',
                                width: '100%'}}
                                onClick={() => this.serviceRequest(request.id, request.songId, false)}
                            >
                                Reject
                            </Button>
                        </div>)} 
                    title={'What would you like to do with this request?'}>
                    <div className={cardContainer}>
                        <div
                            className={albumArt}
                            style={{
                                'backgroundImage': `url(${request.albumArt})`,
                            }}
                        >
                                {this.state.loading && <div
                                    className={innerDiv}
                                >
                                    <Icon 
                                        type="loading" 
                                        className={added}
                                    />
                                </div>}
                        </div>
                        <p className={title}>{request.songName}</p>
                        <p className={artist}>{request.artists}</p>
                    </div>
                </Popover>
            </div>
        )
        // )
    }          
}

export default Request

