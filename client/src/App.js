import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
//  App Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'

import Routes from './components/routing/Routes'

//  Redux
import { Provider } from 'react-redux'
import store from './store'
//  App State Management
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'

import './App.css';

if (localStorage.devConnectToken) {
  setAuthToken(localStorage.devConnectToken)
}

const App = () => {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
          <Route exact path="/" component={Landing} />
          <Route component={Routes}/>
          </Switch>
          <Footer/>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App;
