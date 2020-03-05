import React from "react";
import ReactDOM from "react-dom";
import UnalCanvas from "./js/Components/UnalTemplate/UnalCanvas";
import LoginForm from "./js/Components/Login/Login";
import Home from "./js/Components/Home/Home";
import Edit from "./js/Components/Edit/Edit";
import Contact from "./js/Components/Contact/Contact";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./css/index.css";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem("jwt") != null ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem("jwt") === null ? (
        <Component {...props} />
      ) : (
        <Redirect to="/home" />
      )
    }
  />
);

ReactDOM.render(
  <BrowserRouter basename={"/actas"}>
    <UnalCanvas>
      <Switch>
        <PublicRoute exact path="/" component={LoginForm} />
        <Route exact path="/contact" component={Contact} />
        <PrivateRoute exact path="/home" component={Home} />
        <PrivateRoute exact path="/edit/:id" component={Edit} />
      </Switch>
    </UnalCanvas>
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
