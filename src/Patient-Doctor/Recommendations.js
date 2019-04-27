import React, { Component } from "react";
import "../css/Recommendations.css";
import { Link } from "react-router-dom";

class Recommendations extends Component {
  state = {
    recommendations: [],
    activeUser: []
  };
  /*https://medical-documentation.herokuapp.com*/
  componentWillMount() {
    fetch("https://medical-documentation.herokuapp.com/recommendations")
      .then(result => result.json())
      .then(data =>
        this.setState({ recommendations: data.sort(this.compare) })
      );

    fetch("https://medical-documentation.herokuapp.com/active-user")
      .then(result => result.json())
      .then(data => this.setState({ activeUser: data }));
  }

  compare = (a, b) => {
    const dateA = parseInt(
      a.date
        .split(" ")[0]
        .split("-")
        .join("")
    );
    const dateB = parseInt(
      b.date
        .split(" ")[0]
        .split("-")
        .join("")
    );
    return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
  };
  render() {
    return (
      <div className="container recommendations-container">
        {this.props.activeAccount === "doctor" && (
          <Link to="/recommendations/create-new">
            <button>Dodaj zalecenie</button>
          </Link>
        )}

        <div className="content">
          {this.state.recommendations.map((recommendation, i) => {
            const color =
              recommendation.doctor === this.state.activeUser.name
                ? "rgb(138, 159, 138)"
                : "grey";
            return (
              <div
                className="recommendation"
                key={i}
                style={{ background: color }}
              >
                <p>Data: {recommendation.date} </p>
                <p>Lekarz: {recommendation.doctor} </p>
                <p>Treść: {recommendation.content}</p>
                <p>
                  Załączone dokumenty:{" "}
                  {recommendation.attachedDocuments.map((attachment, i) => (
                    <Link
                      key={i}
                      style={{
                        margin: "10px",
                        color: "white",
                        textDecoration: "underline"
                      }}
                      to={`/recommendations/attached-document-:${
                        attachment.id
                      }`}
                    >
                      {attachment.title}
                    </Link>
                  ))}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Recommendations;
