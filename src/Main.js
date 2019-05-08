import React, { Component } from "react";
import { Link } from "react-router-dom";
import PatientPage from "./Patient-Doctor/PatientPage";
import DoctorPage from "./Patient-Doctor/Doctor/DoctorPage";
import LabTechnicianPage from "./LabTechnician/LabTechnicianPage";

class Main extends Component {
  state = {
    activeAccount: JSON.parse(sessionStorage.getItem("account"))
      ? JSON.parse(sessionStorage.getItem("account"))
      : "",
    isLoggedIn: JSON.parse(sessionStorage.getItem("isLoggedIn")) || "false",
    activeUser: JSON.parse(sessionStorage.getItem("user")) || []
  };

  componentDidUpdate() {
    //because setState is asynchronous
    sessionStorage.setItem("isLoggedIn", JSON.stringify(this.state.isLoggedIn));
    sessionStorage.setItem("account", JSON.stringify(this.state.activeAccount));
    sessionStorage.setItem("user", JSON.stringify(this.state.activeUser));
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
            isLoggedIn: "true",
            activeUser: data
          });
        }
      });
  };

  logOut = async () => {
    this.setState({ activeAccount: "", isLoggedIn: "false" });
    //await sessionStorage.setItem("isLoggedIn", false);
    this.props.history.push("/");
  };

  render() {
    let infoText;
    if (sessionStorage.getItem("generatedLogin")) {
      infoText = `Twój wygenerowany login: ${sessionStorage.getItem(
        "generatedLogin"
      )}`;
      sessionStorage.removeItem("generatedLogin");
    } else {
      infoText = <br />;
    }
    return (
      <div>
        {this.state.isLoggedIn === "false" ? (
          <div className="login-container">
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
          <div>
            <header>
              {/*<div className="radio-buttons">
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
        </div>*/}
              <p className="login-info">
                Zalogowano jako: {this.state.activeUser.name}
              </p>

              <button className="log-out" onClick={this.logOut}>
                Wyloguj się
              </button>
            </header>

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
