import Login from './Login'
import Home from './Home'
import GuestHome from './GuestHome'
import FooterComponent from './FooterComponent'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from "react-router-dom"
import {
  container
} from './App.module.css'
import HttpsRedirect from 'react-https-redirect'

const App = () => {
  return (
    <HttpsRedirect>
      <Router className={container}>
          <Switch>
            <Route exact path='/'>
              <Redirect to='/home' />
            </Route>
            <Route exact path='/login'>
              <Login />
            </Route>
            <Route exact path='/home'>
              <Home />
            </Route>
            <Route exact path='/queue/:userId'>
              <GuestHome />
            </Route>
            <Route exact path='/terms-and-condition.html' onEnter={() => window.location.reload()} />
            <Route exact path='/privacy-policy.html' onEnter={() => window.location.reload()} />
          </Switch>
          {window.location.pathname === '/login' ? <FooterComponent transparentBackground={window.location.pathname === '/login'} /> : ''}
      </Router>
    </HttpsRedirect>
  );
}

export default App
