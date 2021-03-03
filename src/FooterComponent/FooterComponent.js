import { Layout } from 'antd'
import { 
    footer,
    footerElem,
    footerMobile
} from './Footer.module.css'
import { isMobile } from 'react-device-detect'

const { Footer } = Layout

const FooterComponent = props => {
    const footerStyle = props.transparentBackground ? { background: 'none' } : {}
    const aStyle = props.transparentBackground ? { color: 'black' } : {}
    return(
        <Footer className={isMobile ? footerMobile : footer} style={footerStyle}>
            <a 
                href='/terms-and-conditions.html' 
                target='_blank' 
                className={footerElem} 
                style={{ 
                    marginLeft: '1rem',
                    ...aStyle
                }}
            >
                Terms and Conditions
            </a>
            <a 
                href='/privacy-policy.html' 
                target='_blank' 
                className={footerElem}
                style={{ 
                    marginLeft: '1rem',
                    ...aStyle
                }}
            >
                Privacy Policy
            </a>
            <a
                onClick={() => props.showFeedback()}
                className={footerElem}
                style={aStyle}
            >
                Feedback
            </a>
        </Footer>
    )
}

export default FooterComponent