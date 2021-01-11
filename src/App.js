import Login from './Login'
import Home from './Home'
import GuestHome from './GuestHome'
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
          </Switch>
      </Router>
    </HttpsRedirect>
  );
}

export default App
