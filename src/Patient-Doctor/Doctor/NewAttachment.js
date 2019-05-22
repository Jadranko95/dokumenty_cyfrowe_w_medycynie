import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../css/NewAttachment.css";
import { today, threeDaysAgo } from "../../DateParser";

class NewAttachment extends Component {
  state = {
    startDate: "",
    activeUser: JSON.parse(sessionStorage.getItem("user")) || [],
  };

  submitAttachment = async e => {
    e.preventDefault();

    let attachedDocument = {};
    const { date, startDate } = e.target;
    switch (this.props.documentType) {
      case "prescription":
        const { medicine, payment } = e.target;
        attachedDocument = {
          patientID: this.props.patientID,
          title: `Recepta ${medicine.value}`,
          medicine: medicine.value,
          payment: payment.value,
          issueDate: date.value,
          startDate: startDate.value,
          type: "recepta",
          doctor: this.state.activeUser.name
        };
        break;
      case "sickleave":
        const { placeOfWork, endDate } = e.target;
        attachedDocument = {
          patientID: this.props.patientID,
          title: `Zwolnienie ${startDate.value}-${endDate.value}`,
          issueDate: date.value,
          placeOfWork: placeOfWork.value,
          startDate: startDate.value,
          endDate: endDate.value,
          type: "zwolnienie",
          doctor: this.state.activeUser.name
        };
        break;

      case "referral":
        const { place, examination, diagnosis, aim } = e.target;
        attachedDocument = {
          patientID: this.props.patientID,
          title: `Skierowanie na ${examination.value} ${date.value}`,
          issueDate: date.value,
          place: place.value,
          examination: examination.value,
          diagnosis: diagnosis.value,
          aim: aim.value,
          type: "skierowanie",
          doctor: this.state.activeUser.name
        };
        break;
      case "lab-order":
        const checkboxes = [...e.target.test];
        const labTests = checkboxes
          .filter(checkbox => checkbox.checked === true)
          .map(checkbox => checkbox.value);

        console.log(labTests);
        attachedDocument = {
          patientID: this.props.patientID,
          title: `Zlecenie badań laboratoryjnych ${date.value}`,
          date: date.value,
          labTests: labTests,
          type: "zlecenie badań",
          doctor: this.state.activeUser.name
        };
        break;
      default:
        return;
    }

    await fetch(" https://medical-documentation.herokuapp.com/attach-document", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attachedDocument)
    })
      .then(result => result.json())
      .then(data => (attachedDocument.id = data));
    console.log(attachedDocument.id);
    let attachments = JSON.parse(sessionStorage.getItem("attachments")) || [];
    attachments.push(attachedDocument);
    sessionStorage.setItem("attachments", JSON.stringify(attachments));
    this.props.history.push("/recommendations/create-new");
  };

  setStartDate = e => {
    this.setState({ startDate: e.target.value });
  };

  render() {
    const documentType = this.props.documentType;

    return (
      <div className="container">
        <Link to="/recommendations/create-new" className="backButton">
          <button>Powrót</button>
        </Link>
        {documentType === "prescription" && (
          <div>
            <h2>Nowa recepta</h2>
            <form className="attachment-form" onSubmit={this.submitAttachment}>
              <label>
                Data:
                <input
                  type="date"
                  name="date"
                  min={threeDaysAgo}
                  max={today}
                  defaultValue={today}
                />
              </label>
              <label>
                Informacje o leku:{" "}
                <input
                  type="text"
                  placeholder="Nazwa, ilość, dawkowanie"
                  name="medicine"
                  required
                />
              </label>
              <label>
                Odpłatność:{" "}
                <input type="text" name="payment" required placeholder=" " />
              </label>
              <label>
                Data od dnia: <input type="date" name="startDate" />
              </label>
              <input type="submit" value="Dodaj" />
            </form>
          </div>
        )}

        {documentType === "sickleave" && (
          <div>
            <h2>Nowe zwolnienie lekarskie</h2>
            <form className="attachment-form" onSubmit={this.submitAttachment}>
              <label>
                Data:
                <input
                  type="date"
                  name="date"
                  min={threeDaysAgo}
                  max={today}
                  defaultValue={today}
                />
              </label>
              <label>
                Miejsce pracy:{" "}
                <input
                  type="text"
                  name="placeOfWork"
                  required
                  placeholder=" "
                />
              </label>
              <label>
                od:{" "}
                <input
                  type="date"
                  name="startDate"
                  min={threeDaysAgo}
                  required
                  id="startDate"
                  onChange={this.setStartDate}
                />
              </label>
              <label>
                do:{" "}
                <input
                  type="date"
                  name="endDate"
                  required
                  min={this.state.startDate}
                />
              </label>
              <input type="submit" value="Dodaj" />
            </form>
          </div>
        )}

        {documentType === "referral" && (
          <div>
            <h2>Nowe skierowanie</h2>
            <form className="attachment-form" onSubmit={this.submitAttachment}>
              <label>
                Data:
                <input
                  type="date"
                  name="date"
                  min={threeDaysAgo}
                  max={today}
                  defaultValue={today}
                />
              </label>
              <label>
                Skierowanie do:{" "}
                <input
                  type="text"
                  name="place"
                  placeholder="poradni specjalistycznej, pracowni diagnostycznej"
                  required
                />
              </label>
              <label>
                Badanie:{" "}
                <input
                  type="text"
                  name="examination"
                  placeholder="konsultacja, badanie USG"
                  required
                />
              </label>
              <label>
                Rozpoznanie:{" "}
                <input type="text" name="diagnosis" required placeholder=" " />
              </label>
              <label>
                Cel: <input type="text" name="aim" required placeholder=" " />
              </label>
              <input type="submit" value="Dodaj" />
            </form>
          </div>
        )}

        {documentType === "lab-order" && (
          <div>
            <h2>Nowe zlecenie na badanie</h2>
            <form className="lab-order-form" onSubmit={this.submitAttachment}>
              <label className="date-label">
                Data:
                <input
                  type="date"
                  name="date"
                  min={threeDaysAgo}
                  max={today}
                  defaultValue={today}
                />
              </label>

              <div className="tests">
                <label>
                  <input type="checkbox" name="test" value="Morfologia" />
                  Morfologia
                </label>
                <label>
                  <input type="checkbox" name="test" value="LDL" />
                  LDL
                </label>
                <label>
                  <input type="checkbox" name="test" value="HDL" />
                  HDL
                </label>
                <label>
                  <input type="checkbox" name="test" value="TC" />
                  TC
                </label>
                <label>
                  <input type="checkbox" name="test" value="Glukoza" />
                  Glukoza
                </label>

                <label>
                  <input type="checkbox" name="test" value="TG" />
                  Trójglicerydy
                </label>

                <label>
                  <input type="checkbox" name="test" value="Kwas moczowy" />
                  Keas moczowy
                </label>

                <label>
                  <input type="checkbox" name="test" value="TP" />
                  TP
                </label>

                <label>
                  <input type="checkbox" name="test" value="TBIL" />
                  TBIL
                </label>
                <label>
                  <input type="checkbox" name="test" value="Magnez" />
                  Magnez
                </label>
                <label>
                  <input type="checkbox" name="test" value="Sód" />
                  Sód
                </label>
                <label>
                  <input type="checkbox" name="test" value="Potas" />
                  Potas
                </label>
                <label>
                  <input type="checkbox" name="test" value="Żelazo" />
                  Żelazo
                </label>
                <label>
                  <input type="checkbox" name="test" value="Wapń" />
                  Wapń
                </label>
                <label>
                  <input type="checkbox" name="test" value="ALAT" />
                  ALAT
                </label>
                <label>
                  <input type="checkbox" name="test" value="ASPAT" />
                  ASPAT
                </label>
                <label>
                  <input type="checkbox" name="test" value="TSH" />
                  TSH
                </label>
                <label>
                  <input type="checkbox" name="test" value="FT3" />
                  FT3
                </label>
                <label>
                  <input type="checkbox" name="test" value="FT4" />
                  FT4
                </label>
                <label>
                  <input type="checkbox" name="test" value="OB" />
                  OB
                </label>
              </div>

              <input type="submit" value="Dodaj" />
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default NewAttachment;
