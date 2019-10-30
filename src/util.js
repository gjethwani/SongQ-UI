const getHostname = () => {
    if (window.location.hostname === 'localhost') {
        return 'localhost:3000'
    } else {
        return 'songq-ui.herokuapp.com'
    }
}

const joinArtists = (artists) => {
    var artistsJoined = ''
    artists.forEach((artist, i) => {
        artistsJoined += artist.name
        if (i !== artists.length - 1) {
            artistsJoined += ', '
        }
    })
    return artistsJoined
}

const authenticateSpotify = (refresh) => {
    var url = `${process.env.REACT_APP_BACK_END_URI}`
    if (refresh) {
        url += '/spotify-refresh-token'
    } else {
        url += '/spotify-login'
    }
    window.location.href = url
}

const dndTypes = {
    REQUEST: 'request',
}

module.exports = {
    getHostname,
    joinArtists,
    authenticateSpotify,
    dndTypes
}