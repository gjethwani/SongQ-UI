import Login from './Login'
import Home from './Home'
import GuestLogin from './GuestLogin'
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

const App = () => {
  return (
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
          <Route exact path='/code'>
            <GuestLogin />
          </Route>
          <Route exact path='/queue/:userId'>
            <GuestHome />
          </Route>
        </Switch>
    </Router>
  );
}

export default App
