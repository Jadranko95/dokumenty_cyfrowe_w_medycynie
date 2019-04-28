import React, { Component } from "react";
import "../css/SideBar.css";

class SideBar extends Component {
  state = {
    patient: [],
    tasks: [],
    editMode: false
  };

  async componentDidMount() {
    await fetch("https://medical-documentation.herokuapp.com/patient")
      .then(result => result.json())
      .then(data => this.setState({ patient: data }));
  }

  editData = async e => {
    if (!this.state.editMode) {
      this.setState({ editMode: true });
    } else {
      //sent to db
      await fetch(
        "https://medical-documentation.herokuapp.com/edit-patient-data",
        {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: document.querySelector("#name").value,
            sex: document.querySelector("#sex").value,
            PESEL: document.querySelector("#PESEL").value,
            telephone: document.querySelector("#telephone").value,
            address: document.querySelector("#address").value,
            icd10: document.querySelector("#icd10").value
          })
        }
      ).then(result => result.json())
      .then(data => this.setState({ patient: data }));
      this.setState({ editMode: false });
    }
  };

  render() {
    const patient = this.state.patient;
    const name = `${patient.name} ${patient.surname}`;
    return (
      <div className="side-bar">
        <div className="patient-info">
          <h3>Dane osobowe</h3>

          <table>
            <tbody>
              <tr>
                <td>Imię i nazwisko: </td>
                <td>
                  {this.state.editMode ? (
                    <input type="text" defaultValue={name} id="name" />
                  ) : (
                    <p>{name}</p>
                  )}
                </td>
              </tr>
              <tr>
                <td>Płeć: </td>
                <td>
                  {this.state.editMode ? (
                    <input type="text" defaultValue={patient.sex} id="sex" />
                  ) : (
                    <p>{patient.sex}</p>
                  )}
                </td>
              </tr>
              <tr>
                <td>Wiek: </td>
                <td> {patient.age} </td>
              </tr>
              <tr>
                <td>PESEL: </td>
                <td>
                  {" "}
                  {this.state.editMode ? (
                    <input
                      type="text"
                      defaultValue={patient.PESEL}
                      id="PESEL"
                    />
                  ) : (
                    <p>{patient.PESEL}</p>
                  )}{" "}
                </td>
              </tr>
              <tr>
                <td>Data urodzenia: </td>
                <td> {patient.dateOfBirth} </td>
              </tr>
              <tr>
                <td>Adres: </td>
                <td>
                  {this.state.editMode ? (
                    <input
                      type="text"
                      defaultValue={patient.address}
                      id="address"
                    />
                  ) : (
                    <p>{patient.address}</p>
                  )}
                </td>
              </tr>
              <tr>
                <td>Telefon: </td>
                <td>
                  {" "}
                  {this.state.editMode ? (
                    <input
                      type="text"
                      defaultValue={patient.telephone}
                      id="telephone"
                    />
                  ) : (
                    <p>{patient.telephone}</p>
                  )}
                </td>
              </tr>
              <tr>
                <td>ICD10: </td>
                <td>
                  {" "}
                  {this.state.editMode ? (
                    <input
                      type="text"
                      defaultValue={patient.icd10}
                      id="icd10"
                    />
                  ) : (
                    <p>{patient.icd10}</p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {this.props.activeAccount === "doctor" && (
            <button onClick={this.editData}>
              {this.state.editMode ? "Zapisz" : "Edytuj"}
            </button>
          )}
        </div>
        <div className="todo-list">
          <h3>Zadania do wykonania</h3>
          <ul>
            {this.props.tasks.map((task, i) => {
              return (
                <li key={i}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={this.props.toggleComplete}
                    id={task._id}
                    disabled={this.props.activeAccount !== "doctor"}
                  />{" "}
                  {task.title}
                </li>
              );
            })}
          </ul>
          {this.props.activeAccount === "doctor" && (
            <form onSubmit={this.props.addTask}>
              <input
                type="text"
                placeholder="Wpisz nowe zadanie"
                name="title"
              />
              <input type="submit" value="Dodaj" />
            </form>
          )}
        </div>
      </div>
    );
  }
}

export default SideBar;
