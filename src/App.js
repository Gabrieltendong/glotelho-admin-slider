import React from "react";
import { Router, Route, Redirect, Switch } from "react-router-dom";
import { connect } from 'react-redux'

import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Login from "./views/Login";
import { DefaultLayout } from "./layouts";
import Tables from "./views/Tables";
import { createBrowserHistory } from 'history';
let history = createBrowserHistory();



const App = (props) => {
  const isLogin = props.user
  return(
    <Router history = {history}>
    <Switch>
      <Route exact path = '/login'>
        <Login />
      </Route>
      <Route exact path = '/admin/slider'>
        {
          isLogin?
            <DefaultLayout>
              <Tables />
            </DefaultLayout>
          :
          <Redirect to = '/login'  />
        }
      </Route>
      <Route path = "*" component = {Login} />
    </Switch>
  </Router>
  )
};

const mapStateToProps = state => {
  return {
    user: state.userReducer.user
  }
}

export default connect(mapStateToProps)(App)
