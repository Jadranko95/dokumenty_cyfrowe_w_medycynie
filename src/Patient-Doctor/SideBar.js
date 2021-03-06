import React, { Component } from "react";
import "../css/SideBar.css";

class SideBar extends Component {
  state = {
    patient: [],
    tasks: [],
    editMode: false
  };

  async componentDidMount() {
    await fetch(
      ` https://medical-documentation.herokuapp.com/patient?patientID=${
        this.props.patientID
      }`
    ).then(result => {
      if (result.status === 400) {
        alert("Nie ma takiego pacjenta");
      } else {
        result.json().then(data => this.setState({ patient: data }));
      }
    });
  }

  editData = async e => {
    if (!this.state.editMode) {
      this.setState({ editMode: true });
    } else {
      //sent to db
      const name = document.querySelector("#name");
      const sex = document.querySelector("#sex");
      const PESEL = document.querySelector("#PESEL");
      const telephone = document.querySelector("#telephone");
      const address = document.querySelector("#address");
      if (
        name.checkValidity() &&
        sex.checkValidity() &&
        PESEL.checkValidity() &&
        telephone.checkValidity() &&
        address.checkValidity()
      ) {
        await fetch(
          "https://medical-documentation.herokuapp.com/edit-patient-data",
          {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              patientID: this.props.patientID,
              name: document.querySelector("#name").value,
              sex: document.querySelector("#sex").value,
              PESEL: document.querySelector("#PESEL").value,
              telephone: document.querySelector("#telephone").value,
              address: document.querySelector("#address").value,
              icd10: document.querySelector("#icd10").value
            })
          }
        )
          .then(result => result.json())
          .then(data => this.setState({ patient: data }));
        this.setState({ editMode: false });
      }
    }
  };

  expandPatientInfo = e => {
    console.log("CLick");
    document.querySelector(".mobile-out.patient").classList.toggle("active");
    e.target.classList.toggle("active");
  };

  expandTasks = e => {
    document.querySelector(".mobile-out.tasks").classList.toggle("active");
    e.target.classList.toggle("active");
  };

  render() {
    const patient = this.state.patient;
    const name = `${patient.name} ${patient.surname}`;
    return (
      <div className="side-bar">
        <div className="patient-info">
          <p className="mobile-info">Pacjent: {name}</p>
          <h3 className="expandable" onClick={this.expandPatientInfo}>
            Dane osobowe
          </h3>
          <div className="mobile-out patient">
            <table>
              <tbody>
                <tr>
                  <td>Imię i nazwisko: </td>
                  <td>
                    {this.state.editMode ? (
                      <input
                        type="text"
                        defaultValue={name}
                        id="name"
                        required
                        pattern="[A-Za-z\s]{5,17}"
                      />
                    ) : (
                      <p>{name}</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Płeć: </td>
                  <td>
                    {this.state.editMode ? (
                      <input
                        type="text"
                        defaultValue={patient.sex}
                        id="sex"
                        required
                        pattern="[MK]"
                      />
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
                        required
                        pattern="[0-9]{11}"
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
                        required
                        pattern="[A-Za-z0-9\s]{5,20}"
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
                        required
                        pattern="[0-9]{9}"
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
        </div>
        <div className="todo-list">
          <h3 className="expandable" onClick={this.expandTasks}>
            Zadania do wykonania
          </h3>
          <div className="mobile-out tasks">
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
                  required
                />
                <input type="submit" value="Dodaj" />
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default SideBar;
