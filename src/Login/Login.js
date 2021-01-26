import { 
    loginContainer,
    flexContainer,
    welcome,
    logo
} from './Login.module.css'
import { useEffect } from 'react'
import { Button, notification } from 'antd'
import { getURL, logoUrl } from '../util'
import 'antd/dist/antd.css'

const Login = () => {
    const getQuery = () => {
        return new URLSearchParams(window.location.search)
    }
    useEffect(() => {
        document.title = 'Welcome to SongQ!'
        const query = getQuery()
        const err = query.get('err')
        if (err === 'nopremium') {
            notification['error']({
                message: 'Cannot Login',
                description: 'You need Spotify Premium to use SongQ'
            })
        }
    })
    const login = () => {
        window.location.href = `${getURL()}/spotify-login`
    }
    return (
        <div className={loginContainer}>
            <div className={flexContainer}>
                {/* <h1 className={welcome}>Welcome to SongQ</h1> */}
                <img src={logoUrl} className={logo} />
                <Button ghost shape="round" onClick={login}>Sign in with Spotify</Button>
                <p className={welcome}>Sign in with your Spotify account to access your queue</p>
            </div>
        </div>
    )
}

export default Login
