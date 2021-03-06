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

const currUrl = `${window.location.protocol}//${window.location.hostname}${window.location.hostname === 'localhost' ? `:${window.location.port}` : ''}`

const logoUrl = `${currUrl}/logo.png`

const featureFlags = {
    turnOnCodeFeatureEnabled: false
}

module.exports = {
    getURL,
    logoUrl,
    featureFlags,
    currUrl,
}