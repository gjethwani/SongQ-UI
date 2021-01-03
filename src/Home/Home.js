import { useEffect } from 'react'
import {
    extraContainer,
    checkButton,
    header,
    queueActivatedText
} from './Home.module.css'
import { PageHeader, Switch, Table, List, Button, notification } from 'antd'
import 'antd/dist/antd.css'
import axios from 'axios'
import { getURL } from '../util'
import { useState } from 'react'

const Home = () => {
    const [userId, setUserId] = useState(null)
    const [queueActivated, setQueueActivated] = useState(false)
    const [code, setCode] = useState('')
    const [requests, setRequests] = useState([])
    useEffect(() => {
        axios.get(`${getURL()}/get-user-details`, { withCredentials: true })
            .then(response => {
                const { user } = response.data
                setQueueActivated(user.queueActivated)
                setCode(user.code)
                setUserId(user.userId)
                setRequests(user.requests)
            })
            .catch(err => {
                console.log(err)
            })
    })
    const onCheckedButtonChange = activated => {
        axios.patch(`${getURL()}/change-queue-activation`, { userId, activated }, { withCredentials: true })
            .then(() => {
                setQueueActivated(activated)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const generateData = () => {
        const result = []
        let i = 1
        requests.forEach(r => {
            result.push({
                key: `${i}`,
                track: {
                    songName: r.songName,
                    albumArt: r.albumArt,
                    artists: r.artists
                },
                approveOrReject: r._id
            })
            i++
        })
        return result
    }
    const approveReject = (requestId, accepted) => {
        axios.post(`${getURL()}/service-request`, { requestId, accepted }, { withCredentials: true })
            .catch((err) => {
                if (err.response) {
                    if (err.response.data) {
                        if (err.response.data.err && err.response.data.err === 'no queue') {
                            notification['error']({
                                message: 'No queue found',
                                description: 'Please make sure your queue is active'
                            })
                        }
                    }
                }
                console.log(err.response)
            })
    }
    const columns = [
        {
            title: 'Track',
            dataIndex: 'track',
            key: 'track',
            width: '70%',
            render: track => (
                <List.Item>
                    <List.Item.Meta 
                        avatar={<img src={track.albumArt} style={{ width: '64px' }}/>}
                        title={track.songName}
                        description={track.artists}
                    />
                </List.Item>
            ),
        },
        {
            title: 'Approve Or Reject',
            dataIndex: 'approveOrReject',
            key: 'approveOrReject',
            render: requestId => (
                <div>
                    <Button style={{ 
                        color: 'green', 
                        borderColor: 'green', 
                        marginRight: '0.5rem' 
                    }} onClick={() => approveReject(requestId, true)}>Approve</Button>
                    <Button danger onClick={() => approveReject(requestId, false)}>Reject</Button>
                </div>
            )
        }
    ]
    return (
        <div>
            <PageHeader
                title='Welcome!'
                className={header}
                extra={[
                    <div className={extraContainer}>
                        <p className={queueActivatedText}>{queueActivated ? `Code: ${code}` : `Queue Disabled`}</p>
                        <Switch 
                            checked={queueActivated} 
                            className={checkButton} 
                            onChange={onCheckedButtonChange} />
                    </div>
                ]}
            />
            <Table columns={columns} dataSource={generateData()} />
        </div>
    )
}

export default Home
