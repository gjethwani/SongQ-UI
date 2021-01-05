import { useEffect } from 'react'
import {
    extraContainer,
    checkButton,
    header,
    queueActivatedText
} from './Home.module.css'
import { 
    PageHeader, 
    Switch, 
    Table, 
    List, 
    Button, 
    notification, 
    Menu, 
    Dropdown
} from 'antd'
import { DownOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css'
import axios from 'axios'
import { getURL } from '../util'
import { useState } from 'react'

const Home = () => {
    const [userId, setUserId] = useState(null)
    const [queueActivated, setQueueActivated] = useState(false)
    const [code, setCode] = useState('')
    const [requests, setRequests] = useState([])
    const [userName, setUserName] = useState('')
    const errorHandle = err => {
        if (err.response) {
            if (err.response.status) {
                if (err.response.status === 401) {
                    window.location.href = '/login'
                } else {
                    notification['error']({
                        message: 'Server Error',
                        description: 'Please try again later'
                    })
                }
            } else {
                notification['error']({
                    message: 'Server Error',
                    description: 'Please try again later'
                })
            }
        } else {
            notification['error']({
                message: 'Server Error',
                description: 'Please try again later'
            })
        }
    }
    useEffect(() => {
        axios.get(`${getURL()}/get-user-details`, { withCredentials: true })
            .then(response => {
                const { user } = response.data
                setQueueActivated(user.queueActivated)
                setCode(user.code)
                setUserId(user.userId)
                setRequests(user.requests)
                setUserName(user.name)
            })
            .catch(err => {
                errorHandle(err)
                console.log(err)
            })
    }, [queueActivated])
    const onCheckedButtonChange = activated => {
        axios.patch(`${getURL()}/change-queue-activation`, { userId, activated }, { withCredentials: true })
            .then(() => {
                setQueueActivated(activated)
            })
            .catch(err => {
                errorHandle(err)
                console.log(err.response)
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
                errorHandle(err)
                console.log(err.response)
            })
    }
    const sortAlphabetically = (e1, e2, key) => {
        if(e1[key] < e2[key]) { return -1 }
        if(e1[key] > e2[key]) { return 1 }
        return 0
    }
    const sortDate = (e1, e2, key) => {
        return new Date(e1[key]) - new Date(e2[key])
    }
    const sortBy = sortKey => {
        let sortComparator
        switch (sortKey) {
            case 'newest':
                sortComparator = (r1, r2) => {
                    return sortDate(r1, r2, 'createdAt')
                }
                break
            case 'oldest':
                sortComparator = (r1, r2) => {
                    return sortDate(r2, r1, 'createdAt')
                }
                break
            case 'title':
                sortComparator = (r1, r2) => {
                    return sortAlphabetically(r1, r2, 'songName')
                }
                break
            case 'artists':
                sortComparator = (r1, r2) => {
                    return sortAlphabetically(r1, r2, 'artists')
                }
                break
            default:
                sortComparator = () => 0
        }
        const newRequests = requests.sort(sortComparator)
        setRequests([...newRequests])
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
                        avatar={<img alt='album art' src={track.albumArt} style={{ width: '64px' }}/>}
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
    const sortMenu = (
        <Menu>
            <Menu.Item onClick={() => sortBy('newest')}>
                <p>Newest First</p>
            </Menu.Item>
            <Menu.Item onClick={() => sortBy('oldest')}>
                <p>Oldest First</p>
            </Menu.Item>
            <Menu.Item onClick={() => sortBy('title')}>
                <p>Title</p>
            </Menu.Item>
            <Menu.Item onClick={() => sortBy('artists')}>
                <p>Artists</p>
            </Menu.Item>
        </Menu>
    )
    return (
        <div>
            <PageHeader
                title={(userName !== '' && userName !== undefined) ? `Welcome, ${userName}!` : `Welcome!`}
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
            <Dropdown overlay={sortMenu}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    Sort By <DownOutlined />
                </a>
            </Dropdown>
            <Table columns={columns} dataSource={generateData()} />
        </div>
    )
}

export default Home
