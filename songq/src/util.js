const getHostname = function() {
    if (window.location.hostname === 'localhost') {
        return 'localhost:3000'
    } else {
        return ''
    }
    // return window.location.href === 'http://localhost' || window.location.href === 'localhost'
}

module.exports = {
    getHostname
}