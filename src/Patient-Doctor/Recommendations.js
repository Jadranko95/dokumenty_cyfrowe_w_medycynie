import React, { Component } from "react";
import "../css/Recommendations.css";
import { Link } from "react-router-dom";

class Recommendations extends Component {
  state = {
    recommendations: [],
    activeUser: []
  };
  /*https://medical-documentation.herokuapp.com*/
  async componentWillMount() {
    await fetch("https://medical-documentation.herokuapp.com/recommendations")
      .then(result => result.json())
      .then(data =>
        this.setState({ recommendations: data.sort(this.compare) })
      );

    fetch("https://medical-documentation.herokuapp.com/active-user")
      .then(result => result.json())
      .then(data => this.setState({ activeUser: data }));
  }

  async componentDidUpdate(prevProps, prevState) {
    // console.log(prevProps.location.pathname);
    //console.log(this.props.location.pathname);
    if (prevProps.location.pathname !== this.props.location.pathname) {
      console.log("CHANGE");
      await fetch("https://medical-documentation.herokuapp.com/recommendations")
        .then(result => result.json())
        .then(data =>
          this.setState({ recommendations: data.sort(this.compare) })
        );
    }
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
    fetch("https://medical-documentation.herokuapp.com/recommendations")
      .then(result => result.json())
      .then(data =>
        this.setState({ recommendations: data.sort(this.compare) })
      );
    //const height = this.props.activeAccount === "doctor" ? "50vh" : "65vh";
    return (
      <div className="container recommendations-container">
        {this.props.activeAccount === "doctor" && (
          <Link to="/recommendations/create-new">
            <button>Dodaj zalecenie</button>
          </Link>
        )}

        <div className="content" /*style={{ height: height }}*/>
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
                <p className="attached-documents">
                  Załączone dokumenty:{" "}
                  {recommendation.attachedDocuments.map((attachment, i) => (
                    <a
                      key={i}
                      target="_blank"
                      style={{
                        margin: "10px",
                        textDecoration: "underline",
                        color: "white"
                      }}
                      href={
                        "https://medical-documentation.herokuapp.com/attachment-pdf?id=" +
                        attachment.id
                      }
                    >
                      {attachment.title}
                    </a>
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
