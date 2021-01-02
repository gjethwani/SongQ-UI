import { useEffect } from 'react'
import {
    extraContainer,
    checkButton
} from './Home.module.css'
import { PageHeader, Switch, List } from 'antd'
import 'antd/dist/antd.css'
import axios from 'axios'
import { useState } from 'react'

const Home = () => {
    const [userId, setUserId] = useState(null)
    const [queueActivated, setQueueActivated] = useState(false)
    const [code, setCode] = useState('')
    useEffect(() => {
        axios.get('http://localhost:5000/get-user-details', { withCredentials: true })
            .then(response => {
                const { user } = response.data
                setQueueActivated(user.queueActivated)
                setCode(user.code)
                setUserId(user.userId)
            })
            .catch(err => {
                console.log(err)
            })
    })
    const onCheckedButtonChange = activated => {
        axios.patch('http://localhost:5000/change-queue-activation', { userId, activated }, { withCredentials: true })
            .then(() => {
                setQueueActivated(activated)
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div>
            <PageHeader
                title='Welcome!'
                extra={[
                    <div className={extraContainer}>
                        <p>{queueActivated ? `Code: ${code}` : `Queue Disabled`}</p>
                        <Switch 
                            checked={queueActivated} 
                            className={checkButton} 
                            onChange={onCheckedButtonChange} />
                    </div>
                ]}
            />
        </div>
    )
}

export default Home
