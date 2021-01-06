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
    const { userId } = useParams()
    const albumArtIndex = 0
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
        axios.post(`${getURL()}/search-songs`, { q: query}, { withCredentials: true })
            .then(response => {
                const { items } = response.data.results.tracks
                setTracks(items)
            })
            .catch(err => {
                notification['error']({
                    message: 'Could Not Search',
                    description: 'Error searching for tracks'
                })
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
            document.getElementById(`${track.id}_button`).style.display = 'none'
            document.getElementById(`${track.id}_button`).style.margin = 0
            document.getElementById(`${track.id}_check`).style.display = 'block'
            document.getElementById(`${track.id}_check`).style.marginTop = '1rem'
            document.getElementById(`${track.id}_check`).style.marginBottom = '1rem'
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
                                actions={[
                                    <Button id={`${t.id}_button`} className={cardExtras} style={{ marginBottom: '1rem', marginTop: '1rem'}} onClick={() => makeRequest(t)}>Request</Button>,
                                    <CheckCircleTwoTone id={`${t.id}_check`} className={cardExtras} style={{ display: 'none' }} twoToneColor="#52c41a"/>
                                ]}
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