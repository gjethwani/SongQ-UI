import { 
    PageHeader, 
    Button, 
    notification, 
    List, 
    Table 
} from 'antd'
import Input from 'muicss/lib/react/input'
import { 
    header, 
    cardExtras, 
    searchBox, 
    inactive 
} from './GuestHome.module.css'
import { albumArt } from '../Home/Home.module.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { getURL } from '../util'
import 'antd/dist/antd.css'
import 'muicss/dist/css/mui.min.css'

const joinArtists = artistsRaw => {
    let result = ''
    for (let i = 0; i < artistsRaw.length; i++) {
        result += artistsRaw[i].name
        if (i < artistsRaw.length - 1) {
            result += ', '
        }
    }
    return result
}

const GuestHome = () => {
    const [tracks, setTracks] = useState([])
    const [userName, setUserName]  = useState('')
    const [queueActivated, setQueueActivated] = useState(false)
    const [requested, setRequested] = useState([])
    const [recentRequests, setRecentRequests] = useState([])
    const [currQuery, setQuery] = useState('')
    const { userId } = useParams()
    const albumArtIndex = 0
    let CancelToken = axios.CancelToken
    let cancel
    useEffect(() => {
        document.title = 'Welcome to SongQ!'
        axios.post(`${getURL()}/guest-login`, {}, { withCredentials: true })
            .then(() => {
                axios.post(`${getURL()}/is-queue-active`, { userId  }, { withCredentials: true })
                    .then(response => {
                        const { queueActivated } = response.data
                        setQueueActivated(queueActivated)
                    })
                    .catch(err => {
                        notification['error']({
                            message: 'Server Error',
                            description: 'Cannot connect to server'
                        })
                        console.log(err)
                    })
                
                axios.get(`${getURL()}/get-user-name?userId=${userId}`, { withCredentials: true })
                    .then(response => {
                        const { name } = response.data
                        if (name) {
                            setUserName(name)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                axios.get(`${getURL()}/get-recently-approved?userId=${userId}`, { withCredentials: true })
                    .then(response => {
                        const { requests } = response.data
                        setRecentRequests(requests)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                notification['error']({
                    message: 'Server Error',
                    description: 'Cannot connect to Spotify'
                })
                console.log(err)
            })
        
    }, [])
    const onSearchChanged = query => {
        setQuery(query)
        if (query === '') {
            return
        }
        if (cancel !== undefined) {
            cancel()
        }
        axios.post(`${getURL()}/search-songs`, { q: query}, { 
            withCredentials: true,
            cancelToken: new CancelToken(c => {
                cancel = c
            })
        })
            .then(response => {
                const { items } = response.data.results.tracks
                setTracks(items)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const makeRequest = track => {
        axios.post(`${getURL()}/make-request`, {
            userId,
            songId: track.id,
            songName: track.songName,
            artists: track.artists,
            album: track.album,
            albumArt: track.albumArt
        }, {
            withCredentials: true
        })
        .then(() => {
            requested.push(track.id)
            setRequested([...requested])
        })
        .catch(err => {
            notification['error']({
                message: 'Could not make request',
                description: 'Error making request'
            })
            console.log(err)
        })
    }
    const generateData = () => {
        const toReturn = []
        if (currQuery === '') {
            for (let i = 0; i < recentRequests.length; i++) {
                const r = recentRequests[i]
                toReturn.push({
                    key: `${i}`,
                    track: {
                        songName: r.songName,
                        albumArt: r.albumArt,
                        artists: r.artists
                    }
                })
            }
        } else {
            for (let i = 0; i < tracks.length; i++) {
                const t = tracks[i]
                const songInfo = {
                    songName: t.name,
                    albumArt: t.album.images[albumArtIndex].url,
                    artists: joinArtists(t.artists)
                }
                songInfo.id = t.id
                toReturn.push({
                    key: `${i}`,
                    track: songInfo,
                    request: {
                        id: t.id,
                        album: t.album.name,
                        ...songInfo
                    }
                })
            }
        }
        return toReturn
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
        }
    ]
    if (currQuery !== '') {
        columns.push({
            title: 'Request',
            dataIndex: 'request',
            key: 'request',
            width: '30%',
            render: track => (
                requested.includes(track.id) ? 
                    <CheckCircleTwoTone 
                        className={cardExtras} 
                        twoToneColor="#52c41a"/> :
                    <Button 
                        className={cardExtras} 
                        style={{ marginBottom: '1rem', marginTop: '1rem'}} 
                        onClick={() => makeRequest(track)}
                    >
                        Request
                    </Button>
            )
        })
    }
    return (
        <div>
            <PageHeader
                title={userName !== '' ? `${userName}'s queue` : `Welcome to the queue!`}
                className={header}
            />
            {!queueActivated && <h3 className={inactive}>Queue is not active</h3>}
            {queueActivated && 
            <div>
                <Input
                    label='Search for songs'
                    onChange={e => onSearchChanged(e.target.value)}
                    className={searchBox}
                    floatingLabel
                />
                <h2 style={{ textAlign: 'center'}}>
                    {currQuery === '' ? 'Recently Played' : 'Search Results'}
                </h2>
                <Table columns={columns} dataSource={generateData()}/>
            </div>}
        </div>
    )
}



export default GuestHome