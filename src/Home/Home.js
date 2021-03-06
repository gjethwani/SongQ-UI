import { useEffect } from 'react'
import {
    header,
    queueActivatedText,
    approveButton,
    rejectButton,
    albumArt,
    menuItem,
    requestsTable,
    sortByText,
    logo,
    welcomeContainer,
    welcomeText,
    approveButtonCurved,
    recommendButton,
    qrCodeContainer,
    similarity
} from './Home.module.css'
import FeedbackModal from '../FeedbackModal'
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
    Spin,
    Avatar,
    Popover,
    Tag,
    Radio,
    Modal
} from 'antd'
import { 
    CheckOutlined, 
    CloseOutlined, 
    MenuOutlined,
    DownOutlined,
    UpOutlined,
    LoadingOutlined,
    UserOutlined,
    LikeOutlined
} from '@ant-design/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import 'antd/dist/antd.css'
import axios from 'axios'
import { getURL, logoUrl, featureFlags, currUrl } from '../util'
import { useState, useRef } from 'react'
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { useCookies } from 'react-cookie'
import FooterComponent from '../FooterComponent'
import QRCode from 'react-qr-code'

const Home = () => {
    const { turnOnCodeFeatureEnabled } = featureFlags
    const [userId, setUserId] = useState(null)
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
    const [profilePicture, setProfilePicture] = useState('')
    const [cookies, setCookie] = useCookies()
    const [currTourStep, setCurrTourStep] = useState(0)
    const [tourVisible, setTourVisible] = useState(false)
    const [recommendLoading, setRecommendLoading] = useState(false)
    const [feedbackVisible, setFeedbackVisible] = useState(false)
    const [initialRender] = useState(false)
    const [emailPreference, setEmailPreference] = useState("unreadRequests")
    const [emailRadioValue, setEmailRadioValue] = useState(2)
    const [emailPreferenceLoading, setEmailPreferenceLoading] = useState(false)
    const [showQRCodeModal, setShowQRCodeModal] = useState(false)
    const requestsRef = useRef(requests)
    const sortKeyRef = useRef(sortKey)
    const errorHandle = err => {
        if (err.response) {
            if (err.response.status) {
                if (err.response.status === 401) {
                    window.location.href = '/'
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
                setCode(user.code)
                setUserId(user.userId)
                setUserName(user.name)
                setAutoAccept(user.autoAccept)
                setProfilePicture(user.profilePicture)
                setEmailPreference(user.emailPreference)
                if (autoAccept) {
                    approveRejectAll(true)
                }
                const { tourShown } = cookies
                if (!tourShown) {
                    setTourVisible(true)
                    setCookie('tourShown', true)
                }
                if (user.emailPreference ===  "unreadRequests") {
                    axios.post(`${getURL()}/change-should-send-email`,  { shouldSendEmail: true }, { withCredentials: true})
                    setEmailRadioValue(2)
                }
                if (user.emailPreference === "none") {
                    setEmailRadioValue(1)
                }
                if (user.emailPreference === "allRequests") {
                    setEmailRadioValue(3)
                }
                if (user.requests) {
                    user.requests.forEach(request => {
                        let noSimilar = 0
                        request.similar.forEach(s => {
                            if (s.difference < 20) {
                                noSimilar++
                            }
                        })
                        request.isSimilar = request.similar[0].difference !== 0 && noSimilar >= (request.similar.length / 2)
                    })
                    setRequests(user.requests)
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 404) {
                        window.location.href = currUrl
                    }
                } else {
                    errorHandle(err)
                    console.log(err)
                }
            })
            .finally(() => {
                setPageLoading(false)
            })

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
    }, [initialRender])
    useEffect(() => { requestsRef.current = requests }, [requests])
    useEffect(() => { 
        if (currTourStep === 2) {
            setMenuVisible(true)
        } else {
            if (menuVisible) {
                setMenuVisible(false)
            }
        }
        if (tourVisible === false) {
            setMenuVisible(false)
        }
    } , [currTourStep, tourVisible])
    useEffect(() => {
        sortKeyRef.current = sortKey
        sortBy(sortKey) 
    }, [sortKey])
    const nextTourStep = () => {
        if (currTourStep === tourSteps.length-1) {
            setCookie('tourShown', true)
            setTourVisible(false)
        } else {
            setCurrTourStep(currTourStep + 1)
        }
    }
    const previousTourStep = () => {
        if (currTourStep > 0) {
            setCurrTourStep(currTourStep - 1)
        }
    }
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
        formatted.forEach(request => {
            let noSimilar = 0
            request.similar.forEach(s => {
                if (s.difference < 20) {
                    noSimilar++
                }
            })
            request.isSimilar = request.similar[0].difference !== 0 && noSimilar >= (request.similar.length / 2)
        })
        return formatted
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
                    artists: r.artists,
                    recommended: r.recommended,
                    similar: r.similar,
                    isSimilar: r.isSimilar
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
    const getDrawerTitle = () => {
        if (profilePicture === '' || profilePicture === undefined) {
            return <div>
                <Avatar icon={<UserOutlined />} />
                <span className={welcomeText}>{(userName !== '' && userName !== undefined) ? `Welcome, ${userName}!` : `Welcome!`}</span>
            </div>
        } else {
            return <div>
                <Avatar src={profilePicture} />
                <span className={welcomeText}>{(userName !== '' && userName !== undefined) ? `Welcome, ${userName}!` : `Welcome!`}</span>
            </div>
        }
    }
    const getRecommendation = () => {
        setRecommendLoading(true)
        axios.get(`${getURL()}/get-recommendation`, { withCredentials: true })
            .then(response => {
                const { recommendation } = response.data
                requests.push(recommendation)
                setRequests([...requests])
            })
            .catch(() => {
                notification['error']({
                    message: 'Unable to get recommendation',
                    description: 'Please try again later'
                })
            })
            .finally(() => {
                setRecommendLoading(false)
            })
    }
    const changeEmailPreference = preference => {
        setEmailPreferenceLoading(true)
        let preferenceString
        if (preference === 1) {
            preferenceString = "none"
        } else if (preference === 2) {
            preferenceString = "unreadRequests"
        } else if (preference === 3) {
            preferenceString = "allRequests"
        }
        axios.post(`${getURL()}/change-email-preference`, { emailPreference: preferenceString }, { withCredentials: true })
            .then(() => {
                setEmailPreference(preferenceString)
                setEmailRadioValue(preference)
            })
            .catch(() => {
                notification['error']({
                    message: 'Could not change email preference',
                    description: 'Please try again later'
                })
            })
            .finally(() => {
                setEmailPreferenceLoading(false)
            })
    }
    const columns = [
        {
            title: 'Votes',
            dataIndex: 'votes',
            key: 'votes',
            width: '10%',
            render: votes => (
                <p>{`${votes}`}</p>
            )
        },
        {
            title: 'Track',
            dataIndex: 'track',
            key: 'track',
            width: '60%',
            render: track => (
                <div>
                    {track.recommended && <Tag color='purple'>Recommended by SongQ</Tag>}
                    <List.Item>
                        <List.Item.Meta 
                            avatar={
                                <img 
                                    alt='album art' 
                                    src={track.albumArt} 
                                    className={albumArt}
                            />}
                            title={track.songName}
                            description={
                                <div>
                                    <p>{track.artists}</p>
                                    {/* {track.similar && track.similar.difference <= 20 &&
                                        <p className={similarity}>
                                            <LikeOutlined />
                                            {`You may like this based on ${track.similar.name} by ${track.similar.artists} (${Math.round(100 - track.similar.difference)}% similar)`}
                                        </p>} */}
                                    {
                                        track.isSimilar && 
                                        <p className={similarity}>
                                            <LikeOutlined />
                                            {`You may like this based on ${track.similar[0].name} by ${track.similar[0].artists}`}
                                        </p>
                                    }
                                </div>
                            }
                        />
                    </List.Item>
                </div>
            ),
        },
        {
            title: 'Accept Or Reject',
            dataIndex: 'approveOrReject',
            key: 'approveOrReject',
            width: '30%',
            render: requestId => (
                <div style={{ 'display': 'flex' }}>
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
    const tourSteps = [
        {
            index: 0,
            title: 'Queue Link',
            content: <div>
                <p>Use the 'Copy Link' button to get a shareable link for people to request tracks to your queue.</p>
                <Button onClick={() => setTourVisible(false)}>Skip Tour</Button>
                <Button type='primary' onClick={() => nextTourStep()}>Next</Button>
            </div>
        },
        {
            index: 1,
            title: 'Requests',
            content: <div>
                <p>Your requests are here. You can accept or reject them, see details about the track and votes garnered.</p>
                <p>On approval, the track will be added to your Spotify queue.</p>
                <Button onClick={() => setTourVisible(false)}>Skip Tour</Button>
                <Button onClick={() => previousTourStep()}>Previous</Button>
                <Button type='primary' onClick={() => nextTourStep()}>Next</Button>
            </div>
        },
        {
            index: 2,
            title: 'Extra Actions',
            content: <div>
                <p>Use this menu to enable Auto Accept for all current and future requests.</p>
                <p>You can use the 'Accept All' and 'Reject All' buttons to clear your current requests.</p>
                <p>Can't think of what to play? We can recommend you something based on what you've approved.</p>
                <Button onClick={() => previousTourStep()}>Previous</Button>
                <Button type='primary' onClick={() => nextTourStep()}>Finish</Button>
            </div>
        }
    ]
    return (
        <div>
            <Spin spinning={pageLoading} indicator={<LoadingOutlined spin />}>
                <Popover placement='rightBottom' visible={currTourStep === 2 && tourVisible} title={tourSteps[2].title} content={tourSteps[2].content}>
                    <Drawer 
                        visible={menuVisible}
                        title={ getDrawerTitle()}
                        onClose={() => setMenuVisible(false)}
                        footer={
                        <div>
                            <Button 
                                ghost 
                                type='primary'
                                shape='round' 
                                style={{ marginLeft: '14px'}}
                                onClick={() => setTourVisible(true)}
                            >
                                Show Me Around
                            </Button>
                        </div>
                        }
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
                                className={autoAccept ? approveButtonCurved : approveButton} 
                                onClick={() => approveRejectAll(true)}
                                loading={approveAllLoading}
                                style={isMobile ? { padding :'4px 10px'} : {}}
                                disabled={autoAccept}
                            >
                                Accept All
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
                        <div className={menuItem}>
                            <Button
                                onClick={() => getRecommendation()}
                                className={recommendButton}
                                type='primary'
                                ghost
                                loading={recommendLoading}
                            >
                                Recommend Something
                            </Button>
                        </div>
                        <div className={menuItem}>
                            {emailPreferenceLoading && <LoadingOutlined spin />} Email Notification Preferences
                            <Radio.Group 
                                onChange={e => changeEmailPreference(e.target.value)} 
                                value={emailRadioValue}
                            >
                                <Radio value={1}>
                                    No Emails
                                </Radio>
                                <Radio value={2}>
                                    Unread Requests Only
                                </Radio>
                                <Radio value={3}>
                                    All Requests
                                </Radio>
                            </Radio.Group>
                        </div>
                    </Drawer>
                </Popover>
                <PageHeader
                    title={
                    <div className={welcomeContainer}>
                        <img className={logo} src={logoUrl} style={isMobile ? { width: '40%'} : {}}/>
                    </div>}
                    className={header}
                    extra={[
                        <div>
                            <div>
                                <Popover visible={currTourStep === 0 && tourVisible} placement={isMobile ? 'bottom' : 'left'} content={tourSteps[0].content} title={tourSteps[0].title}>
                                    <CopyToClipboard 
                                        text={`${currUrl}/queue/${userId}`}
                                        onCopy={() => showCopyNotification()}
                                    >
                                        <Button shape='round' ghost>Copy Link</Button>
                                    </CopyToClipboard>
                                </Popover>
                                <Button 
                                    onClick={() => setShowQRCodeModal(true)}
                                    shape='round' 
                                    ghost
                                    style={{ marginLeft: '0.5rem'}}
                                >
                                    Show QR Code
                                </Button>
                                <Button 
                                    ghost 
                                    icon={<MenuOutlined />} 
                                    style={isMobile ? { border: 'none', position: 'fixed', top: '0.5rem', right: '0.5rem'} : {border: 'none'}} 
                                    onClick={() => setMenuVisible(!menuVisible)} 
                                />
                            </div>
                            {turnOnCodeFeatureEnabled ? <p className={queueActivatedText}>{`Code: ${code}`}</p> : ''}
                        </div>,
                    ]}
                />
                <div>
                    <Dropdown overlay={menu} trigger={'click'} onVisibleChange={visible => setDropdownVisible(visible)}>
                        <span className={sortByText}>Sort by {dropdownVisible ? <UpOutlined /> : <DownOutlined />}</span>
                    </Dropdown>
                </div>
                <Popover visible={currTourStep === 1 && tourVisible} content={tourSteps[1].content} title={tourSteps[1].title}>
                    <Table 
                        columns={columns} 
                        dataSource={generateData()} 
                        className={requestsTable}
                        locale={{ emptyText: 'No Requests'}}/>
                </Popover>
            </Spin>
            <Modal
                title={`${userName}'s Queue`}
                visible={showQRCodeModal}
                footer={null}
                onCancel={() => setShowQRCodeModal(false)}
            >
                <div className={qrCodeContainer}>
                    <QRCode value={`${currUrl}/queue/${userId}`} />
                </div>
            </Modal>
            <FeedbackModal feedbackVisible={feedbackVisible} hideFeedback={() => setFeedbackVisible(false)}/>
            <FooterComponent transparentBackground showFeedback={() => setFeedbackVisible(true)}/>
        </div>
    )
}

export default Home
