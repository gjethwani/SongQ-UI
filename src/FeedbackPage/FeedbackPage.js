import { getURL } from '../util'
import { useState } from 'react'
import { notification, Button, Rate, Input } from 'antd'
import axios from 'axios'
import { container } from './FeedbackPage.module.css'

const { TextArea } = Input

const FeedbackPage = () => {
    const [rating, setRating] = useState(0)
    const [feedback, setFeedback] = useState('')
    const submitFeedback = () => {
        if (!feedback) {
            notification['error']({
                message: 'Feedback empty',
                description: 'Feedback cannot be empty'
            })
            return
        }
        axios.post(`${getURL()}/submit-feedback`, 
            { 
                feedback, 
                rating 
            }, 
            { 
                withCredentials: true 
            }
        )
            .then(() => {
                window.location.href = '/'
            })
            .catch(err => {
                console.log(err)
                notification['error']({
                    message: 'Server Error',
                    description: 'Please try again later'
                })
            })
    }
    return (
        <div className={container}>
            <h2>Feedback</h2>
            <div style={{ marginBottom: '1rem' }}>
                How would you rate SongQ?
                <Rate allowHalf onChange={rating => setRating(rating)}/>
            </div>
            <TextArea onChange={e => setFeedback(e.target.value)} style={{ marginBottom: '1rem' }}/>
            <Button type='primary' onClick={() => submitFeedback()}>Submit</Button>
        </div>
    )
}

export default FeedbackPage