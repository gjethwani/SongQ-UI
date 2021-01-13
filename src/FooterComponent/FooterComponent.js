import { Layout } from 'antd'
import { 
    footer,
    footerElem
} from './Footer.module.css'

const { Footer } = Layout

const FooterComponent = props => {
    const footerStyle = props.transparentBackground ? { background: 'none' } : {}
    const aStyle = props.transparentBackground ? { color: 'white' } : {}
    return(
        <Footer className={footer} style={footerStyle}>
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
                style={aStyle}
            >
                Privacy Policy
            </a>
        </Footer>
    )
}

export default FooterComponent