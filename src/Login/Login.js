import { 
    loginContainer,
    flexContainer,
    welcome
} from './Login.module.css'
import { Button } from 'antd'
import { getURL } from '../util'
import 'antd/dist/antd.css'

const Login = () => {
    const login = () => {
        window.location.href = `${getURL()}/spotify-login`
    }
    return (
        <div className={loginContainer}>
            <div className={flexContainer}>
                <h1 className={welcome}>Welcome to SongQ</h1>
                <Button ghost shape="round" onClick={login}>LOGIN</Button>
            </div>
        </div>
    )
}

export default Login
