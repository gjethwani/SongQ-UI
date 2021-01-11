import { Layout } from 'antd'
import { 
    footer,
    footerElem
} from './Footer.module.css'

const { Footer } = Layout

const FooterComponent = () => {
    return(
        <Footer className={footer}>
            <a href='/terms-and-conditions.html' target='_blank' className={footerElem} style={{ marginLeft: '1rem'}}>Terms and Conditions</a>
            <a href='/privacy-policy.html' target='_blank' className={footerElem}>Privacy Policy</a>
        </Footer>
    )
}

export default FooterComponent