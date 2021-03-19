import { Modal, Input, Rate, notification } from 'antd'
import axios from 'axios'
import { getURL } from '../util'
import { useState } from 'react'

const { TextArea } = Input

const FeedbackModal = props => {
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
                props.hideFeedback()
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
        <Modal
            visible={props.feedbackVisible}
            title={'Feedback'}
            onCancel={() => props.hideFeedback()}
            onOk={() => submitFeedback()}
        >
            <div style={{ marginBottom: '1rem' }}>
                How would you rate SongQ?
                <Rate allowHalf onChange={rating => setRating(rating)}/>
            </div>
            <TextArea onChange={e => setFeedback(e.target.value)}/>
        </Modal>
    )
}

export default FeedbackModal