import Login from './Login'
import Home from './Home'
import GuestLogin from './GuestLogin'
import GuestHome from './GuestHome'
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom"
import {
  container
} from './App.module.css'

const App = () => {
  return (
    <Router className={container}>
        <Switch>
            <Route path='/login'>
              <Login />
            </Route>
            <Route path='/home'>
              <Home />
            </Route>
            <Route path='/code'>
              <GuestLogin />
            </Route>
            <Route path='/queue/:userId'>
              <GuestHome />
            </Route>
        </Switch>
    </Router>
  );
}

export default App
