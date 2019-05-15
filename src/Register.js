import React, { Component } from "react";
/* import { withRouter } from 'react-router-dom'; */
//import { history } from 'react-router-dom';

class Register extends Component {
  state = {
    accountType: "patient",
    generatedLogin: ""
  };

  chooseAccountType = e => {
    this.setState({ accountType: e.target.value });
  };

  goBack = () => {
    this.props.history.push("/");
  };

  validatePassword = () => {
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirm-password");

    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity("Hasła nie są jednakowe");
    } else {
      confirmPassword.setCustomValidity("");
    }
  };

  registerUser = async e => {
    e.preventDefault();
    if (this.state.accountType === "doctor") {
      await fetch("https://medical-documentation.herokuapp.com/register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType: this.state.accountType,
          name: e.target.name.value,
          surname: e.target.surname.value,
          PWZ: e.target.PWZ.value,
          specialization: e.target.specialization.value,
          password: e.target.password.value
        })
      })
        .then(result => result.json())
        .then(data => {
          this.setState({ generatedLogin: data.login });
        });
      await sessionStorage.setItem("generatedLogin", this.state.generatedLogin);
    } else if (this.state.accountType === "patient") {
      await fetch("https://medical-documentation.herokuapp.com/register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType: this.state.accountType,
          name: e.target.name.value,
          surname: e.target.surname.value,
          pesel: e.target.pesel.value,
          dob: e.target.dob.value,
          sex: e.target.sex.value,
          address: e.target.address.value,
          telephone: e.target.telephone.value,
          password: e.target.password.value
        })
      })
        .then(result => result.json())
        .then(data => {
          this.setState({ generatedLogin: data.login });
        });
      await sessionStorage.setItem("generatedLogin", this.state.generatedLogin);
    } else {
      await fetch("https://medical-documentation.herokuapp.com/register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType: this.state.accountType,
          name: e.target.name.value,
          surname: e.target.surname.value,
          password: e.target.password.value
        })
      })
        .then(result => result.json())
        .then(data => {
          this.setState({ generatedLogin: data.login });
        });
      await sessionStorage.setItem("generatedLogin", this.state.generatedLogin);
    }
    this.props.history.push("/");
  };
  render() {
    return (
      <div className="register-container">
        <button className="backButton" onClick={this.goBack}>
          Powrót do logowania
        </button>
        <h2>Zarejestruj się</h2>

        <form onSubmit={this.registerUser}>
          <span>
            <label>Typ konta: </label>
            <select name="accountType" onChange={this.chooseAccountType}>
              <option value="patient">Pacjent</option>
              <option value="doctor">Lekarz</option>
              <option value="lab">Laborant</option>
            </select>
          </span>
          <span>
            <label htmlFor="name">Imię </label>
            <input type="text" name="name" required placeholder=" " pattern="[A-Za-z]{3,}"/>
          </span>
          <span>
            <label htmlFor="surname">Nazwisko </label>
            <input type="text" name="surname" required placeholder=" " pattern="[A-Za-z]{3,}"/>
          </span>

          {this.state.accountType === "patient" && (
            <>
              <span>
                <label htmlFor="dob">Data urodzenia </label>
                <input type="date" name="dob" required />
              </span>
              <span>
                <label htmlFor="surname">Adres </label>
                <input type="text" name="address" required placeholder=" "/>
              </span>
              <span>
                <label htmlFor="surname">Telefon </label>
                <input
                  type="text"
                  name="telephone"
                  required
                  pattern="[0-9]{9}"
                  placeholder=" "
                />
              </span>
              <span>
                <label htmlFor="pesel">PESEL </label>
                <input
                  type="text"
                  name="pesel"
                  id="pesel"
                  required
                  pattern="[0-9]{11}"
                  placeholder=" "
                />
              </span>
              <span>
                <label htmlFor="surname">Płeć </label>
                <select name="sex" defaultValue="" required>
                  <option value="" disabled>Wybierz płeć</option>
                  <option value="K">Kobieta</option>
                  <option value="M">Mężczyzna</option>
                </select>
               
              </span>
            </>
          )}

          {this.state.accountType === "doctor" && (
            <>
              {" "}
              <span>
                <label>Numer PWZ</label>
                <input type="text" name="PWZ" required />
              </span>
              <span>
                <label>Specjalizacja</label>
                <input type="text" name="specialization" required />
              </span>
            </>
          )}

          <span>
            <label htmlFor="password">Hasło </label>
            <input
              type="password"
              required
              id="password"
              
              //pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$"
            />
          </span>
          <span>
            <label htmlFor="password">Powtórz hasło </label>
            <input
              type="password"
              required
              id="confirm-password"
              //pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$"
              onChange={this.validatePassword}
            />
          </span>
          <input type="submit" value="Zarejestruj się" />
        </form>
      </div>
    );
  }
}

export default Register;
