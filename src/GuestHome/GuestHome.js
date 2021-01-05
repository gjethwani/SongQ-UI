import { PageHeader, Input, Card, Button, notification } from 'antd'
import { header, trackContainer, track, cardExtras } from './GuestHome.module.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { getURL } from '../util'
import 'antd/dist/antd.css'

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
    const [query, setQuery] = useState('')
    const [tracks, setTracks] = useState([])
    const { userId } = useParams()
    const albumArtIndex = 0
    useEffect(() => {
        axios.post(`${getURL()}/guest-login`, {}, { withCredentials: true })
            .catch(err => {
                notification['error']({
                    message: 'Server Error',
                    description: 'Cannot connect to Spotify'
                })
                console.log(err)
            })
    })
    const onSearchChanged = query => {
        setQuery(query)
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
                title='Welcome to the queue!'
                className={header}
            />
            <Input 
                placeholder='Search for songs'
                value={query}
                onChange={e => onSearchChanged(e.target.value)}
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
        </div>
    )
}



export default GuestHome