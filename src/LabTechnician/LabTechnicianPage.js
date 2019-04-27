import React, { Component } from "react";
import "../css/LabTechnicianPage.css";
import { today } from "../DateParser";

class LabTechnicianPage extends Component {
  state = {
    resultType: "",
    results: [],
    parameters: []
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
    let range = this.state.parameters.find(parameter => parameter.name === name).range;
    let unit = this.state.parameters.find(parameter => parameter.name === name).unit;
    if (value) {
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



  render() {
   
    return (
      <div className="container lab-container">
        <h2>Dodaj wynik badania krwi</h2>
        <form className="form" onSubmit={this.submitResult}>
          <label htmlFor="patientID" className="mainLabel">
            ID pacjenta{" "}
            <input name="patientID" type="text" required pattern="[0-9]{5}" />
          </label>
          <label htmlFor="orderingDoctor" className="mainLabel">
            Lekarz zlecający{" "}
            <input name="orderingDoctor" type="text" required />
          </label>
          <label htmlFor="collectionDate" className="mainLabel">
            Data pobrania <input name="collectionDate" type="datetime-local" />
          </label>

          <label className="mainLabel">
            Typ badania
            <select
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
            <div>
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
                  <input type="text" name="result" id="result" />
                </label>
                <input
                  type="submit"
                  value="Dodaj parametr"
                  onClick={this.addParameter}
                />
              </div>

              {this.state.results.length > 0 && (
                <div className="table">
                  <table>
                    <thead>
                      <tr>
                        <th>Lp</th>
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
                            <td>{i + 1}</td>
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
