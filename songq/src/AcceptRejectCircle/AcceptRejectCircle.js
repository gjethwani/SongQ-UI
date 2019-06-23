import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'
import { dndTypes } from '../util'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './AcceptRejectCircle.module.css'
const {
    acceptDrop,
    rejectDrop
} = styles

function collect(connect, monitor) {
    return {
        // isDragging: monitor.isDragging(),
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}

class AcceptRejectCircle extends Component {
    constructor(props) {
        super(props)
        
    }
    render() {
        const { isOver } = this.props
        const { connectDropTarget } = this.props
        return connectDropTarget(
            <div 
                className={this.props.accept ? acceptDrop : rejectDrop}
                style={isOver ? {'transform': 'scale(1.2)'} : {}}
            >
            </div>
        )
    }          
}


export default DropTarget(dndTypes.REQUEST, 
{
    drop(props, monitor) {
        props.serviceRequest(
            monitor.getItem().id, 
            monitor.getItem().songId, 
            props.accept
        )
    }
}, collect)(AcceptRejectCircle)

