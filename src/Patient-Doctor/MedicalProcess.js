import React, { Component } from "react";

import "../css/MedicalProcess.css";
import "../css/App.css";

class MedicalProcess extends Component {
  state = {
    tasks: [],
    editMode: []
  };

  editMode = e => {
    const id = e.target.id;
    if (!this.state.editMode.includes(id)) {
      const editMode = [...this.state.editMode, id];
      this.setState({ editMode });
    } else {
      //dodanie do bazy
      this.props.editTask(id);
      //usunięcie z tablicy editMode
      let editMode = [...this.state.editMode];
      const index = editMode.indexOf(id);
      delete editMode[index];
      this.setState({ editMode });
    }
  };

  render() {
    return (
      <div className="container medical-process-container">
        {this.props.activeAccount === "doctor" && (
          <form onSubmit={this.props.addTask}>
            <input type="text" placeholder="Tytuł" name="title" />
            <select name="completed">
              <option value="done">Wykonane</option>
              <option value="todo">Do zrobienia</option>
            </select>
            Data: <input type="datetime-local" name="date" />
            <textarea placeholder="Szczegóły" name="details" />
            <input type="submit" value="Dodaj zadanie" />
          </form>
        )}
        <div className="content">
          <h3>Do zrobienia</h3>
          <ul>
            {this.props.tasks
              .filter(task => task.completed === false)
              .map((task, i) => {
                return (
                  <li key={i}>
                    <strong>
                      {this.state.editMode.includes(task._id) ? (
                        <input
                          type="text"
                          name="title"
                          id="title"
                          defaultValue={task.title}
                        />
                      ) : (
                        task.title
                      )}
                    </strong>
                    {this.props.activeAccount === "doctor" && (
                      <button
                        className="set-done"
                        id={task._id}
                        onClick={this.props.setCompleted}
                      >
                        ✓
                      </button>
                    )}

                    <button
                      className="edit"
                      onClick={this.editMode}
                      id={task._id}
                    >
                      🖉
                    </button>

                    <br />
                    {this.state.editMode.includes(task._id) ? (
                      <input
                        type="text"
                        name="details"
                        id="details"
                        defaultValue={task.details}
                        placeholder="Szczegóły"
                      />
                    ) : (
                      task.details
                    )}
                    <span style={{ float: "right" }}>
                      {this.state.editMode.includes(task._id) ? (
                        <input
                          type="text"
                          name="date"
                          id="date"
                          defaultValue={task.date}
                          placeholder="Data"
                        />
                      ) : (
                        task.date
                      )}
                    </span>
                  </li>
                );
              })}
          </ul>
          <hr />
          <h3>Wykonane</h3>
          <ul>
            {this.props.tasks
              .filter(task => task.completed === true)
              .map((task, i) => {
                return (
                  <li key={i}>
                    <strong>
                      {this.state.editMode.includes(task._id) ? (
                        <input
                          type="text"
                          name="title"
                          id="title"
                          defaultValue={task.title}
                        />
                      ) : (
                        task.title
                      )}
                    </strong>
                    <button
                      className="edit"
                      onClick={this.editMode}
                      id={task._id}
                    >
                      🖉
                    </button>

                    <br />
                    {this.state.editMode.includes(task._id) ? (
                      <input
                        type="text"
                        name="details"
                        id="details"
                        defaultValue={task.details}
                        placeholder="Szczegóły"
                      />
                    ) : (
                      task.details
                    )}
                    <span style={{ float: "right" }}>
                      {this.state.editMode.includes(task._id) ? (
                        <input
                          type="text"
                          name="date"
                          id="date"
                          defaultValue={task.date}
                          placeholder="Data"
                        />
                      ) : (
                        task.date
                      )}
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
  }
}

export default MedicalProcess;
