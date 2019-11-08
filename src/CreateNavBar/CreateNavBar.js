import React, { Component } from 'react'
import { PageHeader } from 'antd'
import 'antd/dist/antd.css'
// import '../main.css'

class CreateNavBar extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <PageHeader
                onBack={() => window.history.back()}
                title={<span style={{'color': 'black'}}>Create Playlist</span>}
            />
        )
    }
}

export default CreateNavBar