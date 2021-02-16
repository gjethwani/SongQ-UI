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
    // <HttpsRedirect>
      <Router className={container}>
          <Switch>
            <Route exact path='/home'>
              <Home />
            </Route>
            <Route exact path='/queue/:userId'>
              <GuestHome />
            </Route>
            <Route exact path='/terms-and-condition.html' onEnter={() => window.location.reload()} />
            <Route exact path='/index.html' onEnter={() => window.location.reload()} />
            <Route exact path='/privacy-policy.html' onEnter={() => window.location.reload()} />
          </Switch>
      </Router>
    {/* </HttpsRedirect> */}
  );
}

export default App
