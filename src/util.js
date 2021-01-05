const getEnv = () => {
    if (window.location.hostname === 'localhost') {
        return 'local'
    } else {
        return 'production'
    }
}

const getURL = () => {
    if (getEnv() === 'production') {
        return `${window.location.protocol}//api.songq.io`
    } else {
        return `${window.location.protocol}//localhost:5000`
    }
}

module.exports = {
    getURL
}