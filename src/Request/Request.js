import React, { Component } from 'react'
// import { DragSource } from 'react-dnd'
// import { dndTypes } from '../util'
import '../main.css'
import 'antd/dist/antd.css'
import { Button, Popover } from 'antd'
import styles from './Request.module.css'
const {
    cardContainer,
    albumArt, 
    title,
    artist
} = styles

// const itemSource = {
//     beginDrag(props) {
//         props.onShowAcceptChange(true)
//         props.onShowRejectChange(true)
//         const { id, songId } = props.request
//         return { 
//             id,
//             songId,
//         }
//     },
//     endDrag(props, monitor, component) {
//         props.onShowAcceptChange(false)
//         props.onShowRejectChange(false)
//     }
// }

// function collect(connect, monitor) {
//     return {
//         connectDragSource: connect.dragSource(),
//         isDragging: monitor.isDragging()
//     }
// }

const popoverContent = (
    <div>
        <Button 
            style={{borderColor: '#52c41a', 
            backgroundColor: '#F6FFED', 
            color: '#52c41a'}}
        >
            Accept
        </Button>
        <Button type='danger' block>
            Reject
        </Button>
    </div>
)

class Request extends Component {
    constructor(props) {
        super(props)
        
    }
    render() {
        const { request } = this.props
        // const { isDragging, connectDragSource, src } = this.props
        // return connectDragSource(
        return (
            <Popover content={popoverContent} title={'What would you like to do with this request?'} trigger='click'>
                <div className={cardContainer}>
                    <div
                        className={albumArt}
                        style={{
                            'backgroundImage': `url(${request.albumArt})`,
                        }}
                    >
                    </div>
                    <p className={title}>{request.songName}</p>
                    <p className={artist}>{request.artists}</p>
                </div>
            </Popover>
        )
        // )
    }          
}

export default Request
// export default DragSource(dndTypes.REQUEST, itemSource, collect)(Request)

