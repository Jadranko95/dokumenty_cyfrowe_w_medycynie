import React, { Component } from "react";
import "../../css/NewDocument.css";
import { Link } from "react-router-dom";
import { today, threeDaysAgo } from "../../DateParser";
class NewDocument extends Component {
  state = {
    documentType: "",
    referrals: [],
    files: [],
    activeUser: JSON.parse(sessionStorage.getItem("user")) || []
  };

  componentDidMount() {
    fetch(" https://medical-documentation.herokuapp.com/attached-documents")
      .then(result => result.json())
      .then(data =>
        this.setState({
          referrals: data.filter(document => document.type === "skierowanie")
        })
      );
  }

  chooseDocumentType = e => {
    this.setState({ documentType: e.target.value });
  };

  // *********** Upload file to Cloudinary ******************** //
  uploadFile = file => {
    const cloudName = "mickanie";
    const unsignedUploadPreset = "default";
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        var response = JSON.parse(xhr.responseText);
        console.log(response);
      }
    };

    fd.append("upload_preset", unsignedUploadPreset);
    fd.append("tags", "medical_documentation"); // Optional - add tag for image admin in Cloudinary
    fd.append("file", file);
    xhr.send(fd);
  };

  createDocument = async e => {
    e.preventDefault();
    console.log(e.target.files.files);
    const files = e.target.files.files;
    const title = `${this.state.documentType}: ${
      e.target.region ? e.target.region.value : ""
    }  ${e.target.testDate.value.split("T")[0]}`;

    await fetch(" https://medical-documentation.herokuapp.com/new-document", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientID: this.props.patientID,
        documentType: this.state.documentType,
        title,
        testDate: e.target.testDate.value.split("T").join(" "),
        referralID: e.target.referral.value,
        orderingDoctor: e.target.orderingDoctor.value,
        performingDoctor: e.target.performingDoctor.value,
        describingDoctor: this.state.activeUser.name,
        content: e.target.content.value
      })
    })
      .then(result => result.json())
      .then(data => {
        const documentId = data._id;
        console.log(documentId);

        for (let i = 0; i < files.length; i++) {
          //zmiana nazwy plików
          let blob = files[i].slice(0, files[i].size, "image/jpg");
          const newFile = new File([blob], `${documentId}.jpg`, {
            type: "image/jpg"
          });
          this.uploadFile(newFile);
        }
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
          <label>
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
                />
              </label>
              <label>
                {" "}
                Skierowanie:{" "}
                <select className="referrals" name="referral" defaultValue="">
                  <option value="" disabled>
                    Wybierz skierowanie
                  </option>
                  {this.state.referrals.map((referral, i) => {
                    return (
                      <option key={i} value={referral._id}>
                        {referral.title}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label>
                {" "}
                Lekarz zlecający:{" "}
                <input
                  type="text"
                  name="orderingDoctor"
                  required
                  placeholder="Imię i nazwisko lekarza"
                />
              </label>

              <label>
                {" "}
                Lekarz wykonujący:{" "}
                <input
                  type="text"
                  name="performingDoctor"
                  required
                  placeholder="Imię i nazwisko lekarza"
                />
              </label>
              <label>
                {" "}
                Treść: <textarea required name="content" />
              </label>
              <label>
                {" "}
                Załączniki:{" "}
                <input
                  type="file"
                  multiple="multiple"
                  name="files"
                  accept="image/*"
                />
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
