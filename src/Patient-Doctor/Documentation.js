import React, { Component } from "react";
import "../css/Documentation.css";
import { Link } from "react-router-dom";

class Documentation extends Component {
  state = {
    documents: []
  };

  async componentDidMount() {
    await fetch("https://medical-documentation.herokuapp.com/documentation")
      .then(result => result.json())
      .then(data => this.setState({ documents: data.sort(this.compare) }));
  }

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

  filterResults = async e => {
    e.preventDefault();
    const fromDate =
      parseInt(e.target.fromDate.value.split("-").join("")) || null;
    const toDate = parseInt(e.target.toDate.value.split("-").join("")) || null;
    const tag = e.target.tags.value;
    await fetch("https://medical-documentation.herokuapp.com/documentation")
      .then(result => result.json())
      .then(data => this.setState({ documents: data }));

    console.log(fromDate, toDate);
    const filtered = this.state.documents
      .filter(document => {
        if (tag !== "all") {
          return document.documentType === tag;
        } else {
          return true;
        }
      })
      .filter(document => {
        if (fromDate && toDate) {
          return (
            parseInt(
              document.testDate
                .split(" ")[0]
                .split("-")
                .join("")
            ) >= fromDate &&
            parseInt(
              document.testDate
                .split(" ")[0]
                .split("-")
                .join("")
            ) <= toDate
          );
        } else {
          return true;
        }
      });

    this.setState({ documents: filtered });
  };

  render() {
    fetch("https://medical-documentation.herokuapp.com/documentation")
      .then(result => result.json())
      .then(data => this.setState({ documents: data.sort(this.compare) }));
    //const height = this.props.activeAccount === "doctor" ? "41vh" : "55vh";
    return (
      <div className="container documentation-container">
        <div className="buttons">
          {this.props.activeAccount === "doctor" && (
            <Link to="documentation/create-new">
              <button>Dodaj wynik badania</button>
            </Link>
          )}
          <Link to="documentation/report">
            <button>Wygeneruj raport</button>
          </Link>
        </div>
        <form className="filterForm" onSubmit={this.filterResults}>
          <label>
            Filtruj po tagu:{" "}
            <select name="tags">
              <option value="all">Wszystko</option>
              <option value="Badanie krwi">Badanie krwi</option>
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
          <label id="dateFilter">
            <p>Filtruj po dacie: </p>

            <p>
              {" "}
              od
              <input type="date" name="fromDate" /> do
              <input type="date" name="toDate" />
            </p>
          </label>
          <input type="submit" value="Filtruj" />
        </form>
        <div className="documents content" style={{ height: "41vh" }}>
          <ul>
            {this.state.documents.map((document, i) => {
              return (
                <li key={i}>
                  <Link
                    style={{ fontWeight: "600", textDecoration: "underline" }}
                    to={`/documentation/document${document._id}`}
                  >
                    {document.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Documentation;
