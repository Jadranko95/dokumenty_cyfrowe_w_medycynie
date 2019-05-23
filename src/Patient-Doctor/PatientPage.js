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
    tasks: []
  };

  componentDidMount() {
    fetch(
      `https://medical-documentation.herokuapp.com/medical-process?patientID=${
        this.props.patientID
      }`
    )
      .then(result => result.json())
      .then(data => this.setState({ tasks: data.sort(this.compare) }));
  }

  editTask = async id => {
    const title = document.querySelector("#title").value;
    const details = document.querySelector("#details").value;
    const date = document.querySelector("#date");

    await fetch(" https://medical-documentation.herokuapp.com/edit-task", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientID: this.props.patientID,
        title,
        details,
        date: date.value,
        previousTaskId: document.querySelector("#previous-task").value,
        id: id
      })
    })
      .then(result => result.json())
      .then(data => this.setState({ tasks: data.sort(this.compare) }));
  };

  setCompleted = e => {
    const id = e.target.id;
    this.setState({
      tasks: this.state.tasks.map((task, i) => {
        if (task._id === id) {
          task.completed = true;
        }
        return task;
      })
    });

    fetch(" https://medical-documentation.herokuapp.com/complete-task", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, completed: true })
    });
  };

  toggleComplete = async e => {
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
    await fetch(" https://medical-documentation.herokuapp.com/complete-task", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, completed: isCompleted })
    });
  };

  compare = (a, b) => {
    const dateA =
      parseInt(
        a.date
          .split(" ")[0]
          .split("-")
          .join("")
      ) || 0;
    const dateB =
      parseInt(
        b.date
          .split(" ")[0]
          .split("-")
          .join("")
      ) || 0;
    console.log(dateA);
    console.log(dateB);
    return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
  };

  render() {
    const patientID = this.props.patientID;
    return (
      <div>
        <SideBar tasks={this.state.tasks} patientID={patientID} />

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
            <Route
              exact
              path="/documentation"
              render={props => (
                <Documentation {...props} patientID={patientID} />
              )}
            />
            <Route
              exact
              path="/recommendations"
              render={props => (
                <Recommendations {...props} patientID={patientID} />
              )}
            />
            <Route
              path="/medical-process"
              render={props => (
                <MedicalProcess
                  {...props}
                  tasks={this.state.tasks}
                  editTask={this.editTask}
                  setCompleted={this.setCompleted}
                />
              )}
            />
            <Route
              exact
              path="/documentation/report"
              render={props => <Report {...props} patientID={patientID} />}
            />
            }
            <Route
              exact
              path="/documentation/document:documentId"
              render={props => <Document {...props} patientID={patientID} />}
            />
            <Redirect from="/" to="/documentation" />
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default PatientPage;
