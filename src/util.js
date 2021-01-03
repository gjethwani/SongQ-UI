const getEnv = () => {
    if (window.location.hostname === 'localhost') {
        return 'local'
    }
    if (window.location.hostname === 'songq.io' || window.location.hostname === 'www.songq.io') {
        return 'production'
    }
}

const getURL = () => {
    if (getEnv() === 'production') {
        return `${window.location.protocol}//songq-backend.herokuapp.com`
    } else {
        return `${window.location.protocol}//localhost:5000`
    }
}

module.exports = {
    getURL
}