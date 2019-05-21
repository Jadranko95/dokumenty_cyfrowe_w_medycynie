import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/Document.css";
import FileSaver from "file-saver";

class Document extends Component {
  state = {
    documents: [],
    patients: []
  };

  async componentDidMount() {
    await fetch("https://medical-documentation.herokuapp.com/documentation")
      .then(result => result.json())
      .then(data => this.setState({ documents: data }));
    await fetch("https://medical-documentation.herokuapp.com/patient")
      .then(result => result.json())
      .then(data => this.setState({ patients: data }));
  }

  render() {
    if (this.state.documents.length && this.state.patients) {
      let currentDocument;
      this.state.documents.forEach(document => {
        if (document._id === this.props.match.params.documentId) {
          currentDocument = document;
        }
      });

      let currentPatient;
      currentPatient = this.state.patients;
      /*this.state.patients.forEach(document => {
		  alert(document.patientID + " " + currentDocument.patientID);
        if (document.patientID === currentDocument.patientID) {
          currentPatient = document;
        }
      });*/

      console.log(currentDocument);
      return (
        <div className="container document-container">
          <Link to="/documentation" className="backButton">
            <button>Powrót</button>
          </Link>
          <p style={{ fontWeight: "700" }}>{currentDocument.title}</p>
          {!currentDocument.title.includes("Badanie krwi") && (
            <div className="result-info">
              <p>Data: {currentDocument.testDate}</p>
              <p>ID skierowania: {currentDocument.referralID}</p>
              <p>Lekarz zlecający: {currentDocument.orderingDoctor}</p>
              <p>Lekarz wykonujący: {currentDocument.performingDoctor}</p>
              <p>Lekarz opisujący: {currentDocument.describingDoctor}</p>
              <p>
                <br />
                {currentDocument.content}
              </p>
            </div>
          )}
          {currentDocument.title.includes("Badanie krwi") && (
            <div className="table">
              <div className="result-info">
                <p>Data pobrania: {currentDocument.testDate} </p>
                <p>Data wydania: {currentDocument.issueDate}</p>
                <p>Lekarz zlecający: {currentDocument.orderingDoctor}</p>
                <p>Laborant: {currentDocument.labTechnician}</p>
              </div>
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
                {currentDocument.results.map((item, i) => {
                  return (
                    <tbody key={i}>
                      <tr>
                        <td className="mobile-out">{i + 1}</td>
                        <td>{currentDocument.results[i].name}</td>
                        <td>{currentDocument.results[i].value}</td>
                        <td>{currentDocument.results[i].range}</td>
                        <td>{currentDocument.results[i].unit}</td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
          )}

          <a target="_blank"
             href={'https://medical-documentation.herokuapp.com/examination-pdf?id=' + this.props.match.params.documentId}>
            <button>
              Zapisz do PDF
            </button>
          </a>
        </div>
      );
    }
    return null;
  }

}

export default Document;
