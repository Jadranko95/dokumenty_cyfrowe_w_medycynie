import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/Report.css";

class Raport extends Component {
  state = {
    parameters: [],
    chosenParameter: "",
    documents: [],
    filteredResults: []
  };

  componentDidMount() {
    fetch("https://medical-documentation.herokuapp.com/lab-data")
      .then(result => result.json())
      .then(data => this.setState({ parameters: data }));

    fetch("https://medical-documentation.herokuapp.com/documentation")
      .then(result => result.json())
      .then(data => this.setState({ documents: data.sort(this.compare) }));
  }

  chooseResultType = async e => {
    let filteredResults;

    filteredResults = this.state.documents
      .filter(document => document.title.includes("Badanie krwi"))
      .filter(labResult =>
        labResult.results.some(result => result.name === e.target.value)
      );
    await this.setState({ chosenParameter: e.target.value, filteredResults });
  };

  compare = (a, b) => {
    const dateA = parseInt(
      a.testDate
        .split(" ")[0]
        .split("-")
        .join("")
    );
    const dateB = parseInt(
      b.testDate
        .split(" ")[0]
        .split("-")
        .join("")
    );
    return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
  };

  render() {
    return (
      <div className="container ">
        <Link to="/documentation" className="backButton">
          <button>Powrót</button>
        </Link>
        <h2>Raport z badań laboratoryjnych</h2>
        <div className="raport-content">
          <label>
            Wybierz parametr do porównania
            <select
              name="parameters"
              onChange={this.chooseResultType}
              defaultValue="default"
            >
              <option value="default" disabled={true}>
                Parametr
              </option>
              {this.state.parameters.map((parameter, i) => (
                <option key={i} value={parameter.name}>
                  {parameter.name}
                </option>
              ))}
            </select>
          </label>
          {this.state.filteredResults.length > 0 && (
            <div>
              <table border="1">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Wartość {this.state.chosenParameter}</th>
                    <th>Zakres</th>
                    <th>Jednostka</th>
                    <th>Lekarz zlecający</th>
                    <th>Laborant</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.filteredResults.map((result, i) => {
                    return (
                      <tr key={i}>
                        <td>{ result.testDate } </td>
                        <td>{ result.results.find(item => item.name === this.state.chosenParameter).value }</td>
                        <td>{ result.results.find(item => item.name === this.state.chosenParameter).range }</td>
                        <td>{ result.results.find(item => item.name === this.state.chosenParameter).unit }</td>
                        <td>{ result.orderingDoctor }</td>
                        <td>{ result.labTechnician }</td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button>Zapisz do PDF</button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Raport;
