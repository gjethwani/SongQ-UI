import React, { Component } from 'react'
import { PageHeader } from 'antd'
import 'antd/dist/antd.css'

class CreateNavBar extends Component {
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