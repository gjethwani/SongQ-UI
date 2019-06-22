const getHostname = () => {
    if (window.location.hostname === 'localhost') {
        return 'localhost:3000'
    } else {
        return ''
    }
    // return window.location.href === 'http://localhost' || window.location.href === 'localhost'
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

const dndTypes = {
    REQUEST: 'request',
}

module.exports = {
    getHostname,
    joinArtists,
    dndTypes
}