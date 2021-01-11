import { useEffect } from 'react'
import {
    extraContainer,
    checkButton,
    header,
    queueActivatedText,
    sortByText,
    radioButtons,
    approveButton,
    sortContainer,
    serviceAllContainer
} from './Home.module.css'
import { 
    PageHeader, 
    Switch, 
    Table, 
    List, 
    Button, 
    notification, 
    Radio
} from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import 'antd/dist/antd.css'
import axios from 'axios'
import { getURL } from '../util'
import { useState, useRef } from 'react'
import { w3cwebsocket as W3CWebSocket } from "websocket"

const Home = () => {
    const turnOnCode = false
    const [userId, setUserId] = useState(null)
    const [queueActivated, setQueueActivated] = useState(false)
    const [code, setCode] = useState('')
    const [requests, setRequests] = useState([])
    const [userName, setUserName] = useState('')
    const [sortKey, setSortKey] = useState('oldest')
    const [loading, setLoading] = useState([])
    const [autoAccept, setAutoAccept] = useState(false) 
    const requestsRef = useRef(requests)
    const sortKeyRef = useRef(sortKey)
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
                setAutoAccept(user.autoAccept)
            })
            .catch(err => {
                errorHandle(err)
                console.log(err)
            })
    }, [queueActivated])
    useEffect(() => { requestsRef.current = requests }, [requests])
    useEffect(() => {
        sortKeyRef.current = sortKey
        sortBy(sortKey) 
    }, [sortKey])
    useEffect(() => {
        axios.post(`${getURL()}/can-create-ws-connection`, {}, { withCredentials: true })
            .then(response => {
                const { id } = response.data
                const client = new W3CWebSocket(`ws://${window.location.hostname === 'localhost' ? `localhost:5000` : 'api.songq.io'}/connect?id=${id}`)
                client.onmessage = message => {
                    const { data } = message
                    if (data.substring(0, 12) === 'new-request:') {
                        const newRequest = JSON.parse(data.substring(12, data.length))
                        setRequests([...requestsRef.current, newRequest].sort(getSortComparator(sortKeyRef.current)))
                    } else if (data.substring(0, 12) === 'aew-request:') {
                        const newRequest = JSON.parse(data.substring(12, data.length))
                        notification['success']({
                            message: 'Succesfully auto queued',
                            description: `${newRequest.songName} by ${newRequest.artists} succesfully auto queued!`
                        })
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
        
    }, [])
    const formatRequests = requests => {
        const formatted = []
        requests.forEach(request => {
            if (formatted.length === 0) {
                formatted.push({
                    ...request,
                    votes: request.votes ? request.votes : 1
                })
            } else {
                let found = false
                for (let i = 0; i < formatted.length; i++) {
                    if (formatted[i].songId === request.songId) {
                        formatted[i].votes += 1
                        found = true
                        break
                    }
                }
                if (!found) {
                    formatted.push({
                        ...request,
                        votes: request.votes ? request.votes : 1
                    })
                }
            }
        })
        return formatted
    }
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
        const formattedRequests = formatRequests(requests)
        formattedRequests.forEach(r => {
            result.push({
                key: `${i}`,
                track: {
                    songName: r.songName,
                    albumArt: r.albumArt,
                    artists: r.artists
                },
                votes: r.votes,
                approveOrReject: r._id
            })
            i++
        })
        return result
    }
    const approveReject = (requestId, accepted) => {
        const elementId = `${requestId}_${accepted ? 'approve' : 'rejected' }`
        loading.push(elementId)
        setLoading([...loading])
        axios.post(`${getURL()}/service-request`, { requestId, accepted }, { withCredentials: true })
            .then(() => {
                for (let i = 0; i < requests.length; i++) {
                    const r = requests[i]
                    if (r._id === requestId) {
                        requests.splice(i, 1)
                        setRequests([...requests])
                    }
                }
            })
            .catch((err) => {
                if (err.response) {
                    if (err.response.data) {
                        if (err.response.data.err && err.response.data.err === 'no queue') {
                            notification['error']({
                                message: 'No queue found',
                                description: 'Please make sure your queue is active'
                            })
                        } else {
                            errorHandle(err)
                        }
                    } else {
                        errorHandle(err)
                    }
                } else {
                    errorHandle(err)
                }
                console.log(err.response)
            })
            .finally(() => {
                loading.splice(elementId, 1)
                setLoading([...loading])
            })
    }
    const wait = (ms) => {
        const start = Date.now()
        let now = start
        while (now - start < ms) {
          now = Date.now()
        }
    }
    const approveRejectAll = accepted => {
        const serviced = []
        requests.forEach(r => {
            if (serviced.includes(r.songId)) {
                approveReject(r._id, false)
            } else {
                approveReject(r._id, accepted)
                serviced.push(r.songId)
            }
            wait(250)
        })
    }
    const sortAlphabetically = (e1, e2, key) => {
        if(e1[key].toLowerCase() < e2[key].toLowerCase()) { return -1 }
        if(e1[key].toLowerCase() > e2[key].toLowerCase()) { return 1 }
        return 0
    }
    const sortDate = (e1, e2, key) => {
        return new Date(e1[key]) - new Date(e2[key])
    }
    const getSortComparator = sortKey => {
        let sortComparator
        switch (sortKey) {
            case 'newest':
                sortComparator = (r1, r2) => {
                    return sortDate(r2, r1, 'createdAt')
                }
                break
            case 'oldest':
                sortComparator = (r1, r2) => {
                    return sortDate(r1, r2, 'createdAt')
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
        return sortComparator
    }
    const sortBy = sortKey => {
        const sortComparator = getSortComparator(sortKey)
        const newRequests = requestsRef.current.sort(sortComparator)
        setRequests(() => [...newRequests])
    }
    const showCopyNotification = () => {
        notification['success']({
            message: 'Copied Succesfully',
            description: 'Link copied to clipboard'
        })
    }
    const onAutoAcceptChange = autoAcceptNew => {
        axios.post(`${getURL()}/change-auto-accept`, { autoAccept: autoAcceptNew }, { withCredentials: true })
            .then(() => {
                setAutoAccept(autoAcceptNew)
                if (autoAcceptNew) {
                    approveRejectAll(true)
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data) {
                        if (err.response.data.err) {
                            if (err.response.data.err === 'queue inactive') {
                                notification['error']({
                                    message: 'Please open Spotify',
                                    description: 'Cannot activate auto accept if no player is active'
                                })
                            }
                        }
                    }
                }
                console.log(err)
            })
    }
    const columns = [
        {
            title: 'Track',
            dataIndex: 'track',
            key: 'track',
            width: '50%',
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
            title: 'Votes',
            dataIndex: 'votes',
            key: 'votes',
            width: '20%',
            render: votes => (
                <p>{`${votes}`}</p>
            )
        },
        {
            title: 'Approve Or Reject',
            dataIndex: 'approveOrReject',
            key: 'approveOrReject',
            width: '30%',
            render: requestId => (
                <div>
                    <Button 
                        className={approveButton} 
                        onClick={() => approveReject(requestId, true)}
                        id={`${requestId}_approve`}
                        loading={loading.includes(`${requestId}_approve`)}
                    >
                        Approve
                    </Button>
                    <Button 
                        danger 
                        onClick={() => approveReject(requestId, false)}
                        id={`${requestId}_reject`}
                        loading={loading.includes(`${requestId}_reject`)}
                    >
                        Reject
                    </Button>
                </div>
            )
        }
    ]
    return (
        <div>
            <PageHeader
                title={(userName !== '' && userName !== undefined) ? `Welcome, ${userName}!` : `Welcome!`}
                className={header}
                extra={[
                    <div className={extraContainer}>
                        <CopyToClipboard 
                            text={`${window.location.protocol}//${window.location.hostname}${window.location.hostname === 'localhost' ? `:${window.location.port}` : ''}/queue/${userId}`}
                            onCopy={() => showCopyNotification()}
                        >
                            <Button shape='round' ghost icon={<CopyOutlined />}>Copy Queue Link to Clipboard</Button>
                        </CopyToClipboard>
                        {turnOnCode ? <p className={queueActivatedText}>{queueActivated ? `Code: ${code}` : `Queue Disabled`}</p> : ''}
                        Queue Active:
                        <Switch 
                            checked={queueActivated} 
                            className={checkButton} 
                            onChange={onCheckedButtonChange} 
                        />
                        Auto Accept:
                        <Switch
                            checked={autoAccept}
                            onChange={onAutoAcceptChange}
                        />
                    </div>
                ]}
            />
            <div className={sortContainer}>
                <span className={sortByText}>Sort By:</span>
                <Radio.Group value={sortKey} onChange={e => setSortKey(e.target.value)} className={radioButtons}>
                <Radio.Button value='oldest'>Oldest</Radio.Button>
                    <Radio.Button value='newest'>Newest</Radio.Button>
                    <Radio.Button value='title'>Title</Radio.Button>
                    <Radio.Button value='artists'>Artists</Radio.Button>
                </Radio.Group>
            </div>
            <div className={serviceAllContainer}>
                <Button 
                    className={approveButton} 
                    onClick={() => approveRejectAll(true)}
                    loading={loading.includes('approve_all')}
                >
                    Approve All
                </Button>
                <Button 
                    danger 
                    onClick={() => approveRejectAll(false)}
                    loading={loading.includes('reject_all')}
                >
                    Reject All
                </Button>
            </div>
            
            <Table columns={columns} dataSource={generateData()} />
        </div>
    )
}

export default Home
