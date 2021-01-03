const getURL = () => {
    return `${window.location.protocol}//${window.location.hostname}:5000`
}

module.exports = {
    getURL
}