import React, { Component } from "react";
import { Link } from "react-router-dom";
import { today, threeDaysAgo } from "../../DateParser";
import "../../css/NewRecommendation.css";

class NewRecommendation extends Component {
  state = {
    dataSaved: JSON.parse(sessionStorage.getItem("saved")),
    data: JSON.parse(sessionStorage.getItem("recommendationData")) || {},
    attachments: JSON.parse(sessionStorage.getItem("attachments")) || []
  };

  toggleSave = async e => {
    e.preventDefault();

    const { date, content } = e.target.parentElement;
    if (!this.state.dataSaved) {
      await this.setState({
        dataSaved: true,
        data: {
          content: content.value,
          date: date.value
        }
      });
    } else {
      await this.setState({
        dataSaved: false,
        data: {
          content: "",
          date: ""
        }
      });
    }
    await sessionStorage.setItem(
      "recommendationData",
      JSON.stringify(this.state.data)
    );
    await sessionStorage.setItem("saved", JSON.stringify(this.state.dataSaved));
  };

  submitRecommendation = () => {
    fetch("https://medical-documentation.herokuapp.com/new-recommendation", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: document.getElementById("date").value,
        content: document.getElementById("content").value,
        attachments: this.state.attachments
      })
    });
    sessionStorage.removeItem("saved");
    sessionStorage.removeItem("recommendationData");
    sessionStorage.removeItem("attachments");
    this.props.history.push("/recommendations");
  };

  render() {
    return (
      <div className="container form-container">
        <Link to="/recommendations" className="backButton">
          <button>Powrót</button>
        </Link>
        <h2>Nowe zalecenie</h2>

        <form>
          <label>
            Data:
            <input
              type="date"
              disabled={this.state.dataSaved}
              name="date"
              id="date"
              min={threeDaysAgo}
              max={today}
              defaultValue={this.state.data.date || today}
            />
          </label>
          <label>
            Treść:{" "}
            <textarea
              id="content"
              disabled={this.state.dataSaved}
              name="content"
              defaultValue={this.state.data.content || ""}
            />
          </label>

          <input
            type="submit"
            value={this.state.dataSaved ? "Edytuj" : "Zapisz"}
            onClick={this.toggleSave}
          />
        </form>
        {this.state.attachments && (
          <p className="attachments-info">
            Załączniki:
            {this.state.attachments.map((attachment, i) => {
              return (
                <Link
                  key={i}
                  className="attachments"
                  to="/recommendations/attachments/:document"
                >
                  {attachment.title}
                </Link>
              );
            })}
          </p>
        )}
        <section className="attachments-choice">
          Wygeneruj załącznik:{" "}
          <div className="attachment-links">
            <Link to="/recommendations/create-new/generate-prescription">
              <button className="attachment-button">Recepta</button>
            </Link>
            <Link to="/recommendations/create-new/generate-sickleave">
              <button className="attachment-button">Zwolnienie</button>
            </Link>
            <Link to="/recommendations/create-new/generate-referral">
              <button className="attachment-button">Skierowanie</button>
            </Link>
            <Link to="/recommendations/create-new/generate-lab-order">
              <button className="attachment-button">Zlecenie badania</button>
            </Link>
          </div>
        </section>
        <button className="submit-button" onClick={this.submitRecommendation}>
          Dodaj zalecenie
        </button>
      </div>
    );
  }
}

export default NewRecommendation;
