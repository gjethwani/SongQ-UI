import {
    guestLoginContainer,
    flexContainer
} from './GuestLogin.module.css'
import { Input, Button } from 'antd'
import 'antd/dist/antd.css'
import { useState } from 'react'
import { getURL } from '../util'
import axios from 'axios'

const GuestLogin = () => {
    const [code, setCode] = useState('')
    const submitCode = () => {
        axios.get(`${getURL()}/get-queue-by-code?code=${code}`)
            .then(response => {
                const { userId } = response.data
                window.location.href = `/queue/${userId}`
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div className={guestLoginContainer}>
            <div className={flexContainer}>
                <Input placeholder='ENTER CODE' value={code} onChange={e => setCode(e.target.value)} />
                <Button onClick={submitCode}>SUBMIT</Button>
            </div>
        </div>
    )
}

export default GuestLogin
