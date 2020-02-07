import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import LoginForm from "./Components/Login/Login";
import Contact from "./Components/Contact/Contact";
import Home from "./Components/Home/Home";
import Edit from "./Components/Edit/Edit";

import { ProtectedRoute } from "./ProtectedRoute";
import { LoginRoute } from "./LoginRoute";
import auth from "../auth";

export default props => (
  <Switch>
    <LoginRoute exact path="/" component={LoginForm} />
    <LoginRoute exact path="/contact" component={Contact} />
    <ProtectedRoute exact path="/home" component={Home} />
    <ProtectedRoute exact path="/edit/:id" component={Edit} />
    <Route path="*" component={() => "404 NOT FOUND"}>
      {auth.isAuthenticated ? <Redirect to="/home" /> : <Redirect to="/" />}
    </Route>{" "}
    />
  </Switch>
);
