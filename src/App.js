import React, { Component } from "react";

import { Route, Switch } from "react-router-dom";
import Register from "./Register";

import Main from "./Main";

import "./css/App.css";

class App extends Component {
  async componentWillMount() {
    if (!sessionStorage.getItem("account")) {
      console.log("no account");
      const text = "";
      await sessionStorage.setItem("account", JSON.stringify(text));
    }
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/" component={Main} />
        </Switch>
      </div>
    );
  }
}

export default App;
