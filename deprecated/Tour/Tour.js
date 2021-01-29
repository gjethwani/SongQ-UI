import { Modal, Steps, Button } from 'antd'
import { currUrl } from '../util'
import { copyLink, requestsImg, modal, tourInstructions } from './Tour.module.css'
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'

const { Step } = Steps

const steps = [
    {
        index: 0,
        title: 'Queue Link',
        content: <div className={tourInstructions}>
            <p>You can use the 'Copy Link' button to get a shareable link where people will be able to request tracks for your queue</p>
            <Button onClick={e => e.preventDefault()} className={copyLink} shape='round'>Copy Link</Button>
        </div>
    },
    {
        index: 1,
        title: 'Requests',
        content: <div className={tourInstructions}>
            <p>Your requests will show up here, where you can see the details about the request andhow many votes it has.</p>
            <p>You can use the green and red buttons to accept or reject the track. On approval, the track will be added to your Spotify queue.</p>
            <img className={requestsImg} src={`${currUrl}/requests.png`} />
        </div>
    },
    {
        index: 2,
        title: 'Extra Actions',
        content: <div className={tourInstructions}>
            <p>You can perform other actions located in the menu</p>
            <p>Enable auto accept to automatically accept any request that comes in</p>
            <p>Use the 'Accept All' and 'Reject All' buttons to service all of your current requests</p>
            <img src={`${currUrl}/extras-menu.png`}/>
        </div>
    }
]

const Tour = props => {
    const [cookies, setCookie] = useCookies()
    const [currStep, setCurrStep] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)
    const { tourShown } = cookies
    useEffect(() => {
        if (!tourShown) {
            setModalVisible(true)
        }
        if (props.showTourClicked) {
            props.setShowTourClicked(false)
            setModalVisible(true)
        }
    })
    const nextStep = () => {
        if (currStep === steps.length-1) {
            setCookie('tourShown', true)
            setModalVisible(false)
        } else {
            setCurrStep(currStep + 1)
        }
    }
    const previousStep = () => {
        if (currStep > 0) {
            setCurrStep(currStep - 1)
        }
    }
    const onModalCancel = () => {
        setModalVisible(false)
        setCookie('tourShown', true)
    }
    const getFooter = () => {
        const footer = [
            <Button key={1} onClick={() => setModalVisible(false)}>Skip Tour</Button>, 
            <Button key={3} type='primary' onClick={() => nextStep()}>{currStep === steps.length-1 ? 'Finish' : 'Next'}</Button>
        ]
        if (currStep > 0) {
            footer.push(<Button key={2} onClick={() => previousStep()}>Previous</Button>)
        }
        footer.sort((f1, f2) => {
            return f1.key - f2.key
        })
        return footer
    }
    return (
        <Modal 
            title='Intro to SongQ' 
            visible={modalVisible} 
            footer={getFooter()}
            className={modal}
            onCancel={() => onModalCancel()}
        >
            <Steps current={currStep} status='wait'>
                {steps.map(item =>{
                    return <Step status={currStep === item.index ? 'process' : (currStep > item.index ? 'finish' : 'wait')} key={item.title} title={item.title} />
                })}
            </Steps>
            <div className='steps-content'>
                {steps[currStep].content}
            </div>
        </Modal>
    )
}

export default Tour