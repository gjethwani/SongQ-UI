import React, { Component } from 'react'
import { PageHeader } from 'antd'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './GuestNavBar.module.css'
const { 
    navBar,
    playlistNameText
} = styles

class GuestNavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return(
            <PageHeader
                backIcon={false}
                style={{ width: '100%'}}
                title={<p className={playlistNameText}>{this.props.playlistName}</p>}
                className={navBar}
            />
        )
    }
}

export default GuestNavBar