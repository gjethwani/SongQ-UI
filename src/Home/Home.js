import { useEffect } from 'react'
import {
    checkButton,
    header,
    queueActivatedText,
    sortByText,
    radioButtons,
    approveButton,
    sortContainer,
    serviceAllContainer,
    rejectButton,
    optionsContainer,
    optionContainer,
    approveRejectAllContainer,
    albumArt
} from './Home.module.css'
import { isMobile } from 'react-device-detect'
import { 
    PageHeader, 
    Switch, 
    Table, 
    List, 
    Button, 
    notification, 
    Radio
} from 'antd'
import { CopyOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import 'antd/dist/antd.css'
import axios from 'axios'
import { getURL } from '../util'
import { useState, useRef } from 'react'
import { w3cwebsocket as W3CWebSocket } from "websocket"
import addNotification from 'react-push-notification'

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
                const client = new W3CWebSocket(
                    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname === 'localhost' ? `localhost:5000` : 'api.songq.io'}/connect?id=${id}`
                )
                client.onmessage = message => {
                    const { data } = message
                    if (data.substring(0, 12) === 'new-request:') {
                        const newRequest = JSON.parse(data.substring(12, data.length))
                        setRequests(formatRequests([...requestsRef.current, newRequest]).sort(getSortComparator(sortKeyRef.current)))
                        addNotification({
                            title: 'New Request',
                            subtitle: 'Go to songq.io to approve or reject requests',
                            message: `${newRequest.songName} by ${newRequest.artists} was requested`,
                            theme: 'darkblue',
                            native: true
                        });
                    } else if (data.substring(0, 12) === 'aew-request:') {
                        const newRequest = JSON.parse(data.substring(12, data.length))
                        notification['success']({
                            message: 'Succesfully auto queued',
                            description: `${newRequest.songName} by ${newRequest.artists} was succesfully queued!`
                        })                    
                    }
                    
                }
            })
            .catch(err => {
                console.log(err)
            })
        
    })
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
                        const { songId } = r
                        for (let j = 0; j < requests.length; j++) {
                            if (requests[j].songId === songId) {
                                requests.splice(j, 1)
                            }
                        }
                        setRequests([...requests])
                        break
                    }
                }           
            })
            .catch((err) => {
                if (err.response) {
                    if (err.response.data) {
                        if (err.response.data.err && err.response.data.err === 'no queue') {
                            return notification['error']({
                                message: 'No queue found',
                                description: 'Please make sure your queue is active'
                            })
                        }
                    }
                }
                errorHandle(err)
            })
            .finally(() => {
                loading.splice(elementId, 1)
                setLoading([...loading])
            })
    }
    const approveRejectAll = accepted => {
        axios.post(`${getURL()}/service-all`, { accepted }, { withCredentials: true})
            .then(() => {
                setRequests([])
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data) {
                        if (err.response.data.err) {
                            if (err.response.data.err === 'no queue') {
                                return notification['error']({
                                    message: 'No queue found',
                                    description: 'Please make sure your queue is active'
                                })
                            }
                        }
                    }
                }
                errorHandle(err)
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
            case 'votes':
                sortComparator = (r1, r2) => {
                    return r2.votes - r1.votes
                }
                break
            default:
                sortComparator = () => 0
        }
        return sortComparator
    }
    const sortBy = sortKey => {
        const sortComparator = getSortComparator(sortKey)
        const newRequests = formatRequests(requestsRef.current).sort(sortComparator)
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
                        avatar={
                            <img 
                                alt='album art' 
                                src={track.albumArt} 
                                className={albumArt}
                        />}
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
                        icon={<CheckOutlined />}
                    />
                    <Button 
                        className={rejectButton}
                        danger 
                        onClick={() => approveReject(requestId, false)}
                        id={`${requestId}_reject`}
                        loading={loading.includes(`${requestId}_reject`)}
                        icon={<CloseOutlined />}
                    />
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
                    <div>
                        <div>
                            <CopyToClipboard 
                                text={`${window.location.protocol}//${window.location.hostname}${window.location.hostname === 'localhost' ? `:${window.location.port}` : ''}/queue/${userId}`}
                                onCopy={() => showCopyNotification()}
                            >
                                <Button shape='round' ghost icon={<CopyOutlined />}>Copy Link</Button>
                            </CopyToClipboard>
                        </div>
                        {turnOnCode ? <p className={queueActivatedText}>{queueActivated ? `Code: ${code}` : `Queue Disabled`}</p> : ''}
                    </div>
                ]}
            />
            <div className={optionsContainer}>
                <div className={optionContainer}>
                    Queue Active:
                    <Switch 
                        checked={queueActivated} 
                        className={checkButton} 
                        onChange={onCheckedButtonChange} 
                    />
                </div>
                <div className={optionContainer}>
                    Auto Accept:
                    <Switch
                        checked={autoAccept}
                        onChange={onAutoAcceptChange}
                    />
                </div>

                <div className={serviceAllContainer}>
                    <div 
                        className={approveRejectAllContainer}
                        style={isMobile ? { marginRight : '0rem' } : {}}
                    >
                        <Button 
                            className={approveButton} 
                            onClick={() => approveRejectAll(true)}
                            loading={loading.includes('approve_all')}
                            style={isMobile ? { padding :'4px 10px'} : {}}
                        >
                            Approve All
                        </Button>
                    </div>
                    <div className={approveRejectAllContainer}>
                        <Button 
                            className={rejectButton}
                            danger 
                            onClick={() => approveRejectAll(false)}
                            loading={loading.includes('reject_all')}
                            style={isMobile ? { padding :'4px 10px' } : { }}
                        >
                            Reject All
                        </Button>
                    </div>
                </div>
            </div>
            <div className={sortContainer}>
                <span className={sortByText}>Sort By:</span>
                <Radio.Group value={sortKey} onChange={e => setSortKey(e.target.value)} className={radioButtons}>
                    <Radio.Button value='oldest'>Oldest</Radio.Button>
                    <Radio.Button value='newest'>Newest</Radio.Button>
                    <Radio.Button value='title'>Title</Radio.Button>
                    <Radio.Button value='artists'>Artists</Radio.Button>
                    <Radio.Button value='votes'>Votes</Radio.Button>
                </Radio.Group>
            </div>
            <Table columns={columns} dataSource={generateData()} />
        </div>
    )
}

export default Home
