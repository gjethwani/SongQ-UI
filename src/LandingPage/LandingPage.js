import { PageHeader, Button } from 'antd'
import { isMobile } from 'react-device-detect'
import { logoUrl } from '../util'
import { welcomeContainer, logo, header } from '../Home/Home.module.css'

const LandingPage = () => {
    return (
        <div>
            <PageHeader
                title={
                    <div className={welcomeContainer}>
                        <img className={logo} src={logoUrl} style={isMobile ? { width: '40%'} : {}}/>
                    </div>}
                    className={header}
                    extra={[ <Button shape='round' ghost>Get Started</Button>]}
                />
        </div>
    )
}

export default LandingPage