import React, { Component } from "react";
import "../../css/NewDocument.css";
import { Link } from "react-router-dom";
import { today, threeDaysAgo } from "../../DateParser";
class NewDocument extends Component {
  state = {
    documentType: ""
  };

  chooseDocumentType = e => {
    this.setState({ documentType: e.target.value });
  };

  createDocument = e => {
    //console.log(e.target);
    e.preventDefault();
    const title = `${this.state.documentType}: ${
      e.target.region ? e.target.region.value : ""
    }  ${e.target.testDate.value.split("T")[0]}`;
    //console.log(title);
    fetch("https://medical-documentation.herokuapp.com/new-document", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentType: this.state.documentType,
        title,
        testDate: e.target.testDate.value.split("T").join(" "),

        orderingDoctor: e.target.orderingDoctor.value,
        performingDoctor: e.target.performingDoctor.value,
        content: e.target.content.value
      })
    });

    this.props.history.push("/documentation");
  };

  render() {
    return (
      <div className="container">
        <Link to="/documentation" className="backButton">
          <button>Powrót</button>
        </Link>
        
        <h2 style={{ textAlign: "center" }}>Nowy dokument</h2>

        <div className="new-document">
          <label style={{ width: "70%", margin: "auto" }}>
            Typ dokumentu:
            <select
              name="documentType"
              onChange={this.chooseDocumentType}
              defaultValue="default"
            >
              <option value="default" disabled>
                Wybierz typ
              </option>
              <option value="Badanie USG">Badanie USG</option>

              <option value="Badanie EKG">Badanie EKG</option>
              <option value="Echokardiografia">Echokardiografia</option>
              <option value="Tomografia komputerowa">
                Tomografia komputerowa
              </option>
              <option value="Rezonans magnetyczny">Rezonans magnetyczny</option>
              <option value="Angiografia">Angiografia / Koronarografia</option>
            </select>
          </label>

          {this.state.documentType && (
            <form className="document-form" onSubmit={this.createDocument}>
              {(this.state.documentType === "Rezonans magnetyczny" ||
                this.state.documentType === "Tomografia komputerowa") && (
                <label>
                  {" "}
                  Badany obszar: <input type="text" name="region" required />
                </label>
              )}

              <label>
                {" "}
                Data badania:{" "}
                <input
                  type="datetime-local"
                  name="testDate"
                  min={threeDaysAgo}
                  max={today}
                  defaultValue={today}
                  required
                />
              </label>

              <label>
                {" "}
                Lekarz zlecający:{" "}
                <input type="text" name="orderingDoctor" required />
              </label>

              <label>
                {" "}
                Lekarz wykonujący:{" "}
                <input type="text" name="performingDoctor" required />
              </label>
              <label>
                {" "}
                Treść: <textarea required name="content" />
              </label>
              <label>
                {" "}
                Załączniki: <input type="file" multiple="multiple" />
              </label>

              <input type="submit" value="Dodaj dokument" />
            </form>
          )}
        </div>
      </div>
    );
  }
}

export default NewDocument;
