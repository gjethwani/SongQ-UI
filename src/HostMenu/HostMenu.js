import React, { Component } from 'react'
import { Drawer, Button, Icon, Menu } from 'antd'
import '../main.css'
import 'antd/dist/antd.css'
import styles from './HostMenu.module.css'
const { 
    drawer
} = styles

class HostMenu extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <div style={{ width: '256px', height: '100%' }}>
                {/* <Drawer
                    title='SongQ'
                    placement='left'
                    closable={true}
                    onClose={() => this.props.onVisibleChange(false)}
                    visible={this.props.visible}
                    className={drawer}
                >
                </Drawer> */}
                <Menu
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="dark"
                inlineCollapsed={this.props.visible}
                >
                    <Menu.Item key="1">
                        <span>Option 1</span>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default HostMenu