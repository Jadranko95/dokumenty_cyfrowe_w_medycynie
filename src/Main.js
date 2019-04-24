import React, { Component } from "react";
import { Link } from "react-router-dom";
import PatientPage from "./Patient-Doctor/PatientPage";
import DoctorPage from "./Patient-Doctor/Doctor/DoctorPage";
import LabTechnicianPage from "./LabTechnician/LabTechnicianPage";

class Main extends Component {
  state = {
    activeAccount: JSON.parse(localStorage.getItem("account")) || "",
    isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || "false"
  };

  componentDidUpdate() {
    //because setState is asynchronous
    localStorage.setItem("isLoggedIn", JSON.stringify(this.state.isLoggedIn));
    localStorage.setItem("account", JSON.stringify(this.state.activeAccount));
  }

  changeAccount = e => {
    this.setState({ activeAccount: e.target.value });
  };

  logIn = async e => {
    e.preventDefault();
    await fetch("https://medical-documentation.herokuapp.com/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: e.target.login.value,
        password: e.target.password.value
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data === "FAIL") {
          document.querySelector("#login-info").innerHTML =
            "Niepoprawny login i hasło";
        } else {
          this.setState({
            activeAccount: data.accountType,
            isLoggedIn: "true"
          });
        }
      });
  };

  logOut = async () => {
    this.setState({ activeAccount: "", isLoggedIn: "false" });
    //await localStorage.setItem("isLoggedIn", false);
    this.props.history.push("/");
  };

  render() {
    let infoText;
    if (localStorage.getItem("generatedLogin")) {
      infoText = `Twój wygenerowany login: ${localStorage.getItem(
        "generatedLogin"
      )}`;
      localStorage.removeItem("generatedLogin");
    } else {
      infoText = <br />;
    }
    return (
      <div>
        {this.state.isLoggedIn === "false" ? (
          <div className="container login-container">
            <h2>Zaloguj się</h2>
            <p id="login-info">{infoText}</p>
            <form onSubmit={this.logIn}>
              <label htmlFor="login">Użytkownik: </label>
              <input
                type="text"
                name="login"
                pattern="[PDL]\d{5}"
                placeholder="np. P12345, D12345, L12345"
                required
              />
              <label htmlFor="password">Hasło: </label>
              <input type="password" name="password" required />
              <input type="submit" value="Zaloguj" />
            </form>
            <p>Nie masz konta?</p>
            <Link to="/register">
              <button>Zarejestruj się</button>
            </Link>
          </div>
        ) : (
          <div className="header">
            <div className="radio-buttons">
              <label>
                <input
                  type="radio"
                  name="account"
                  id="Patient"
                  value="patient"
                  checked={this.state.activeAccount === "patient"}
                  onChange={this.changeAccount}
                />{" "}
                Pacjent
              </label>
              <label>
                <input
                  type="radio"
                  name="account"
                  id="Doctor"
                  value="doctor"
                  checked={this.state.activeAccount === "doctor"}
                  onChange={this.changeAccount}
                />{" "}
                Lekarz
              </label>
              <label>
                <input
                  type="radio"
                  name="account"
                  id="Lab"
                  value="lab"
                  checked={this.state.activeAccount === "lab"}
                  onChange={this.changeAccount}
                />{" "}
                Laborant
              </label>
            </div>

            <button className="log-out" onClick={this.logOut}>
              Wyloguj się
            </button>

            {this.state.activeAccount === "patient" ? (
              <PatientPage />
            ) : this.state.activeAccount === "doctor" ? (
              <DoctorPage />
            ) : (
              <LabTechnicianPage />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Main;
