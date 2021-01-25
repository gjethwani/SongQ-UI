import { useEffect } from 'react'
import {
    header,
    queueActivatedText,
    approveButton,
    rejectButton,
    albumArt,
    menuItem,
    activeButton,
    requestsTable,
    sortByText,
    inactiveText,
    logo,
    welcomeContainer
} from './Home.module.css'
import { isMobile } from 'react-device-detect'
import { 
    PageHeader, 
    Switch, 
    Table, 
    List, 
    Button, 
    notification, 
    Drawer,
    Dropdown,
    Menu,
    Spin
} from 'antd'
import { 
    CheckOutlined, 
    CloseOutlined, 
    SettingOutlined,
    DownOutlined,
    UpOutlined,
    LoadingOutlined
} from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import 'antd/dist/antd.css'
import axios from 'axios'
import { getURL, logoUrl } from '../util'
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
    const [pageLoading, setPageLoading] = useState(true)
    const [autoAcceptLoading, setAutoAcceptLoading] = useState(false)
    const [approveAllLoading, setApproveAllLoading] = useState(false)
    const [rejectAllLoading, setRejectAllLoading] = useState(false)
    const [autoAccept, setAutoAccept] = useState(false)
    const [menuVisible, setMenuVisible] = useState(false)
    const [dropdownVisible, setDropdownVisible] = useState(false)
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
        setPageLoading(true)
        document.title = 'Welcome to SongQ!'
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
            .finally(() => {
                setPageLoading(false)
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
                        axios.get(`${getURL()}/get-requests`, { withCredentials: true })
                            .then(response => {
                                const { requests } = response.data
                                setRequests(formatRequests(requests).sort(getSortComparator(sortKeyRef.current)))
                            })
                            .catch(err => {
                                console.log(err)
                                setRequests(formatRequests([...requestsRef.current, newRequest]).sort(getSortComparator(sortKeyRef.current)))
                            })
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
        if (accepted) {
            setApproveAllLoading(true)
        } else {
            setRejectAllLoading(true)
        }
        axios.post(`${getURL()}/service-all`, { accepted }, { withCredentials: true})
            .then(() => {
                setPageLoading(false)
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
            .finally(() => {
                if (accepted) {
                    setApproveAllLoading(false)
                } else {
                    setRejectAllLoading(false)
                }
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
        setAutoAcceptLoading(true)
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
            .finally(() => {
                setAutoAcceptLoading(false)
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
    const menu = (
        <Menu>
            <Menu.Item onClick={() => setSortKey('oldest')}>
                Oldest
            </Menu.Item>
            <Menu.Item onClick={() => setSortKey('newest')}>
                Newest
            </Menu.Item>
            <Menu.Item onClick={() => setSortKey('title')}>
                Title
            </Menu.Item>
            <Menu.Item onClick={() => setSortKey('artists')}>
                Artists
            </Menu.Item>
            <Menu.Item onClick={() => setSortKey('votes')}>
                Votes
            </Menu.Item>
        </Menu>
    )
    return (
        <div>
            <Spin spinning={pageLoading} indicator={<LoadingOutlined spin />}>
                <Drawer 
                    visible={menuVisible}
                    title="Menu"
                    onClose={() => setMenuVisible(false)}
                >
                    <div className={menuItem}>
                        Auto Accept:
                        <Switch
                            checked={autoAccept}
                            onChange={onAutoAcceptChange}
                            style={{ marginLeft: '5px', marginRight: '5px'}}
                            loading={autoAcceptLoading}
                        />
                    </div>
                    <div className={menuItem}>
                        <Button
                            className={approveButton} 
                            onClick={() => approveRejectAll(true)}
                            loading={approveAllLoading}
                            style={isMobile ? { padding :'4px 10px'} : {}}
                            disabled={autoAccept}
                        >
                            Approve All
                        </Button>
                    </div>
                    <div className={menuItem}>
                        <Button 
                            className={rejectButton}
                            danger 
                            onClick={() => approveRejectAll(false)}
                            loading={rejectAllLoading}
                            style={isMobile ? { padding :'4px 10px' } : {}}
                            disabled={autoAccept}
                        >
                            Reject All
                        </Button>
                    </div>
                </Drawer>
                <PageHeader
                    title={
                    <div className={welcomeContainer}>
                        <img className={logo} src={logoUrl}/>
                        <span>{(userName !== '' && userName !== undefined) ? `Welcome, ${userName}!` : `Welcome!`}</span>
                    </div>}
                    className={header}
                    extra={[
                        <div>
                            <div>
                                <Button
                                    ghost={!queueActivated}
                                    className={!queueActivated ? '' : activeButton}
                                    shape='round'
                                    onClick={() => onCheckedButtonChange(!queueActivated)}
                                    style={{ marginRight: '0.5rem'}}
                                >
                                    {queueActivated ? 'Active' : 'Inactive'}
                                </Button>
                                <CopyToClipboard 
                                    text={`${window.location.protocol}//${window.location.hostname}${window.location.hostname === 'localhost' ? `:${window.location.port}` : ''}/queue/${userId}`}
                                    onCopy={() => showCopyNotification()}
                                >
                                    <Button shape='round' ghost>Copy Link</Button>
                                </CopyToClipboard>
                                <Button 
                                    ghost 
                                    icon={<SettingOutlined />} 
                                    style={{border: 'none'}} 
                                    onClick={() => setMenuVisible(!menuVisible)} 
                                />
                            </div>
                            {turnOnCode ? <p className={queueActivatedText}>{queueActivated ? `Code: ${code}` : `Queue Disabled`}</p> : ''}
                        </div>,
                    ]}
                />
                {queueActivated ? <div>
                    <Dropdown overlay={menu} trigger={'click'} onVisibleChange={visible => setDropdownVisible(visible)}>
                        <span className={sortByText}>Sort by {dropdownVisible ? <UpOutlined /> : <DownOutlined />}</span>
                    </Dropdown>
                </div> : ''}
                {queueActivated ? 
                    <Table columns={columns} dataSource={generateData()} className={requestsTable}/> : 
                    <p className={inactiveText}>Activate your queue by clicking the 'Inactive' button above to see requests</p>}
            </Spin>
        </div>
    )
}

export default Home
