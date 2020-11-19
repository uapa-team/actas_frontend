import React from "react";
import ReactDOM from "react-dom";
import UnalCanvas from "./js/Basics/UnalCanvas";
import LoginForm from "./js/Components/Login";
import Home from "./js/Components/Home";
import Edit from "./js/Components/Edit";
import Contact from "./js/Components/Contact";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./css/index.css";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
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
    render={(props) =>
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
        <Route path="*" component={() => "404 NOT FOUND"}>
          {localStorage.getItem("jwt") != null ? (
            <Redirect to="/home" />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
      </Switch>
    </UnalCanvas>
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
