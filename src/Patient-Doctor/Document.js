import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/Document.css";

class Document extends Component {
  state = {
    document: {},
    images: [],
    documents: []
  };

  async componentDidMount() {
    await fetch(
      ` https://medical-documentation.herokuapp.com/documentation?patientID=${
        this.props.patientID
      }`
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({ documents: data });
      });

    await fetch(
      "https://res.cloudinary.com/mickanie/image/list/medical_documentation.json"
    )
      .then(result => result.json())
      .then(data =>
        this.setState({
          images: data.resources.filter(image =>
            image.public_id.includes(this.props.match.params.documentId)
          )
        })
      );
  }

  render() {
    if (this.state.documents.length) {
      let currentDocument;
      this.state.documents.forEach(document => {
        if (document._id === this.props.match.params.documentId) {
          currentDocument = document;
        }
      });

      console.log(currentDocument);

      return (
        <div className="container document-container">
          <Link to="/documentation" className="backButton">
            <button>Powrót</button>
          </Link>

          <div>
            <p style={{ fontWeight: "700" }}>{currentDocument.title}</p>
            {!currentDocument.title.includes("Badanie krwi") && (
              <div className="result-info">
                <p>Data: {currentDocument.testDate}</p>
                <p>ID skierowania: {currentDocument.referral}</p>
                <p>Lekarz zlecający: {currentDocument.orderingDoctor}</p>
                <p>Lekarz wykonujący: {currentDocument.performingDoctor}</p>
                <p>Lekarz opisujący: {currentDocument.describingDoctor}</p>
                <p>
                  <br />
                  {currentDocument.content}
                </p>
                <div>
                  {this.state.images.map((file, i) => {
                    const filePath = `https://res.cloudinary.com/mickanie/image/upload/v${
                      file.version
                    }/${file.public_id}.jpg`;
                    return <img key={i} src={filePath} />;
                  })}
                </div>
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

            <a
              target="_blank"
              href={
                " https://medical-documentation.herokuapp.com/examination-pdf?id=" +
                this.props.match.params.documentId
              }
            >
              <button>Zapisz do PDF</button>
            </a>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default Document;
