import { 
    loginContainer,
    flexContainer,
    welcome
} from './Login.module.css'
import { useEffect } from 'react'
import { Button } from 'antd'
import { getURL } from '../util'
import 'antd/dist/antd.css'

const Login = () => {
    useEffect(() => {
        document.title = 'Welcome to SongQ!'
    })
    const login = () => {
        window.location.href = `${getURL()}/spotify-login`
    }
    return (
        <div className={loginContainer}>
            <div className={flexContainer}>
                <h1 className={welcome}>Welcome to SongQ</h1>
                <Button ghost shape="round" onClick={login}>Sign in with Spotify</Button>
                <p className={welcome}>Sign in with your Spotify account to access your queue</p>
            </div>
        </div>
    )
}

export default Login
