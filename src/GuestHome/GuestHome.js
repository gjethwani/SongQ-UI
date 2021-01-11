import { PageHeader, Card, Button, notification } from 'antd'
import Input from 'muicss/lib/react/input'
import { header, trackContainer, track, cardExtras, searchBox, inactive } from './GuestHome.module.css'
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
    const { userId } = useParams()
    const albumArtIndex = 0
    let CancelToken = axios.CancelToken
    let cancel
    useEffect(() => {
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
        axios.post(`${getURL()}/guest-login`, {}, { withCredentials: true })
            .catch(err => {
                notification['error']({
                    message: 'Server Error',
                    description: 'Cannot connect to Spotify'
                })
                console.log(err)
            })
        axios.get(`${getURL()}/get-user-name?userId=${userId}`)
            .then(response => {
                const { name } = response.data
                if (name) {
                    setUserName(name)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    const onSearchChanged = query => {
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
            songName: track.name,
            artists: joinArtists(track.artists),
            album: track.album.name,
            albumArt: track.album.images[albumArtIndex].url
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
    return (
        <div>
            <PageHeader
                title={userName !== '' ? `Welcome to ${userName}'s queue!` : `Welcome to the queue!`}
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
                <div className={trackContainer}>
                    {
                        tracks.map(t => 
                            <Card 
                                hoverable
                                className={track}
                                key={t.id}
                                actions={
                                    requested.includes(t.id) ? 
                                        [<CheckCircleTwoTone className={cardExtras} twoToneColor="#52c41a"/>] :
                                        [<Button className={cardExtras} style={{ marginBottom: '1rem', marginTop: '1rem'}} onClick={() => makeRequest(t)}>Request</Button>]
                                }
                                cover={<img alt="albumArt" src={t.album.images[albumArtIndex].url} />}
                            >
                                <Card.Meta 
                                    title={t.name}
                                    description={joinArtists(t.artists)}
                                />
                            </Card>
                        )
                    }
                </div>
            </div>}
        </div>
    )
}



export default GuestHome