import React from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Login from "./views/Login";
import { DefaultLayout } from "./layouts";
import Tables from "./views/Tables";
import UserProfileLite from "./views/UserProfileLite";
const isLogin = true
export default () => (
  <Router basename={process.env.REACT_APP_BASENAME || ""}>
    <Switch>
      <Route path = '/login'>
        <Login />
      </Route>
      <Route path = '/admin/slider'>
        {
          isLogin?
            <DefaultLayout>
              <Tables />
            </DefaultLayout>
          :
          <Redirect to = '/login'  />
        }
      </Route>
      <Route path = '/admin/user'>
        {
          isLogin?
            <DefaultLayout>
              <UserProfileLite />
            </DefaultLayout>
          :
          <Redirect to = '/login'  />
        }
      </Route>
    </Switch>
  </Router>
);
