import React, { Component } from "react";
import "../css/LabTechnicianPage.css";
import { today } from "../DateParser";

class LabTechnicianPage extends Component {
  state = {
    resultType: "",
    results: [],
    parameters: [],
    labOrders: [],
    patientID: ""
  };

  componentDidMount() {
    fetch("https://medical-documentation.herokuapp.com/lab-data")
      .then(result => result.json())
      .then(data => this.setState({ parameters: data }));
  }

  chooseResultType = e => {
    console.log(e.target.value);
    this.setState({ resultType: e.target.value });
  };

  addParameter = e => {
    e.preventDefault();
    let name = document.querySelector("#parameter").value;
    let value = document.querySelector("#result").value;
    let range = this.state.parameters.find(parameter => parameter.name === name)
      .range;
    let unit = this.state.parameters.find(parameter => parameter.name === name)
      .unit;
    if (/^[0-9.,]{1,7}$/.test(value)) {
      const newParameter = {
        name,
        value,
        type: this.state.resultType,
        range,
        unit
      };
      this.setState({ results: [...this.state.results, newParameter] });
      document.querySelector("#result").value = "";
    }
  };

  submitResult = e => {
    e.preventDefault();
    const collectionDate = e.target.collectionDate.value.split("T");
    const title = `Badanie krwi ${collectionDate[0]}`;
    const issueDate = today;

    fetch("https://medical-documentation.herokuapp.com/lab-result", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        labPatientID: e.target.patientID.value,
        labOrder: e.target.labOrder.value,
        orderingDoctor: e.target.orderingDoctor.value,
        title,
        testDate: collectionDate.join(" "),
        issueDate,

        results: this.state.results
      })
    });
    this.setState({ resultType: "", results: [] });
    window.location.reload();
  };

  choosePatient = async e => {
    let patientID = e.target.value;
    if (patientID.match(/[0-9]{5}/)) {
      await fetch(
        "https://medical-documentation.herokuapp.com/get-patient-data",
        {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientID })
        }
      ).then(result => {
        if (result.status === 400) {
          alert("Nie ma takiego pacjenta");
        } else {
          result.json().then(data => this.setState({ patientID: data }));
        }
      });

      await fetch(
        "https://medical-documentation.herokuapp.com/attached-documents"
      )
        .then(result => result.json())
        .then(data =>
          this.setState({
            labOrders: data.filter(
              document => document.type === "zlecenie badań"
            )
          })
        );
    } else {
      await fetch(
        "https://medical-documentation.herokuapp.com/get-patient-data",
        {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientID: "" })
        }
      );
      this.setState({ patientID: "" });
    }
  };

  render() {
    return (
      <div className="container lab-container">
        <h2>Dodaj wynik badania krwi</h2>
        <form className="form" onSubmit={this.submitResult}>
          <label htmlFor="patientID" className="mainLabel">
            ID pacjenta{" "}
            <input
              name="patientID"
              type="text"
              required
              pattern="[0-9]{5}"
              placeholder=" "
              onChange={this.choosePatient}
            />
          </label>

          <label className="mainLabel">
            Zlecenie:{" "}
            <select
              className="lab-orders"
              name="labOrder"
              defaultValue=""
              disabled={!this.state.patientID}
            >
              <option value="" disabled>
                Wybierz zlecenie
              </option>
              {this.state.labOrders.map((labOrder, i) => {
                return (
                  <option key={i} value={labOrder._id}>
                    {labOrder.title}
                  </option>
                );
              })}
            </select>
          </label>
          <label htmlFor="orderingDoctor" className="mainLabel">
            Lekarz zlecający{" "}
            <input
              name="orderingDoctor"
              type="text"
              required
              placeholder=" "
              disabled={!this.state.patientID}
            />
          </label>
          <label htmlFor="collectionDate" className="mainLabel">
            Data pobrania{" "}
            <input
              name="collectionDate"
              type="datetime-local"
              disabled={!this.state.patientID}
            />
          </label>

          <label className="mainLabel">
            Typ badania
            <select
              disabled={!this.state.patientID}
              name="result-type"
              onChange={this.chooseResultType}
              defaultValue="default"
            >
              <option value="default" disabled={true}>
                Wybierz typ badania
              </option>
              <option value="Morfologia">Morfologia krwi</option>
              <option value="Biochemia">Biochemia krwi</option>
              <option value="Immunochemia">Immunochemia</option>
              <option value="OB">OB</option>
            </select>
          </label>

          {this.state.resultType && (
            <div className="result-display">
              <div className="inner-form">
                <label>
                  Wybierz parametr
                  {this.state.resultType === "Morfologia" && (
                    <select name="parameter" id="parameter">
                      {this.state.parameters
                        .filter(
                          parameter => parameter.testType === "Morfologia"
                        )
                        .map((parameter, i) => {
                          return (
                            <option key={i} value={parameter.name}>
                              {parameter.name}
                            </option>
                          );
                        })}
                    </select>
                  )}
                  {this.state.resultType === "Biochemia" && (
                    <select name="parameter" id="parameter">
                      {this.state.parameters
                        .filter(parameter => parameter.testType === "Biochemia")
                        .map((parameter, i) => {
                          return (
                            <option key={i} value={parameter.name}>
                              {parameter.name}
                            </option>
                          );
                        })}
                    </select>
                  )}
                  {this.state.resultType === "Immunochemia" && (
                    <select name="parameter" id="parameter">
                      {this.state.parameters
                        .filter(
                          parameter => parameter.testType === "Immunochemia"
                        )
                        .map((parameter, i) => {
                          return (
                            <option key={i} value={parameter.name}>
                              {parameter.name}
                            </option>
                          );
                        })}
                    </select>
                  )}
                  {this.state.resultType === "OB" && (
                    <select name="parameter" id="parameter">
                      <option value="OB">OB</option>
                    </select>
                  )}
                </label>
                <label>
                  Wartość
                  <input
                    type="text"
                    name="result"
                    id="result"
                    pattern="[0-9.,]{1,7}"
                    
                  />
                </label>
                <input
                  type="submit"
                  value="Dodaj parametr"
                  onClick={this.addParameter}
                />
              </div>

              {this.state.results.length > 0 && (
                <div className="table">
                  <table border="1">
                    <thead>
                      <tr>
                        <th className="mobile-out">Lp.</th>
                        <th>Parametr</th>
                        <th>Wartość</th>
                        <th>Zakres</th>
                        <th>Jednostka</th>
                      </tr>
                    </thead>
                    {this.state.results.map((item, i) => {
                      return (
                        <tbody key={i}>
                          <tr>
                            <td className="mobile-out">{i + 1}</td>
                            <td>{this.state.results[i].name}</td>
                            <td>{this.state.results[i].value}</td>
                            <td>{this.state.results[i].range}</td>
                            <td>{this.state.results[i].unit}</td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                  <input type="submit" value="Zapisz i prześlij" />
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default LabTechnicianPage;
