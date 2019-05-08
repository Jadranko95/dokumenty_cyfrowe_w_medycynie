import React, { Component } from "react";
import { HashRouter, Route, NavLink, Switch, Redirect } from "react-router-dom";
import Document from "./Document";
import MedicalProcess from "./MedicalProcess";
import Documentation from "./Documentation";
import Recommendations from "./Recommendations";
import SideBar from "./SideBar";
import "../css/PatientDoctorPage.css";
import Report from "./Report";

class PatientPage extends Component {
  state = {
    patientID: "",
    tasks: []
  };

  componentDidMount() {
    fetch("https://medical-documentation.herokuapp.com/medical-process")
      .then(result => result.json())
      .then(data => this.setState({ tasks: data }));
  }

  editTask = async id => {
    await fetch("https://medical-documentation.herokuapp.com/edit-task", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: document.querySelector("#title").value,
        details: document.querySelector("#details").value,
        date: document.querySelector("#date").value,
        id: id
      })
    })
      .then(result => result.json())
      .then(data => this.setState({ tasks: data }));
  };

  toggleComplete = e => {
    const id = e.target.id;
    let isCompleted = "";
    this.setState({
      tasks: this.state.tasks.map((task, i) => {
        if (task._id === id) {
          task.completed = !task.completed;
          isCompleted = task.completed;
        }
        return task;
      })
    });
    //dodanie do bazy
    fetch("https://medical-documentation.herokuapp.com/complete-task", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, completed: isCompleted })
    })
      .then(response => response.json())
      .then(data => this.setState({ tasks: data }));
  };

  render() {
    return (
      <div>
        <SideBar tasks={this.state.tasks} />

        <HashRouter>
          <nav>
            <NavLink to="/documentation" activeClassName="active">
              Dokumentacja
            </NavLink>
            <NavLink to="/recommendations" activeClassName="active">
              Zalecenia
            </NavLink>
            <NavLink to="/medical-process" activeClassName="active">
              Proces medyczny
            </NavLink>
          </nav>
          <Switch>
            <Route exact path="/documentation" component={Documentation} />
            <Route exact path="/recommendations" component={Recommendations} />
            <Route
              path="/medical-process"
              render={props => (
                <MedicalProcess
                  {...props}
                  tasks={this.state.tasks}
                  editTask={this.editTask}
                />
              )}
            />
            <Route exact path="/documentation/report" component={Report} />}
            <Route
              exact
              path="/documentation/document:documentId"
              component={Document}
            />
            <Redirect from="/" to="/documentation" />
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default PatientPage;
