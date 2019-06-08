import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Playground from '../Playground'

class AppRouter extends Component {
    render() {
        return(
            <Router>
                <Switch>
                    <Route exact path='/' component={ Playground } />
                </Switch>
            </Router>
        )
    }
}

export default AppRouter