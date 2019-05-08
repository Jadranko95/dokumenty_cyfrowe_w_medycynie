import React, { Component } from "react";

import "../css/MedicalProcess.css";
import "../css/App.css";

class MedicalProcess extends Component {
  state = {
    tasks: [],
    editMode: []
  };

  editMode = async e => {
    const id = e.target.id;
    if (!this.state.editMode.includes(id)) {
      const editMode = [...this.state.editMode, id];
      await this.setState({ editMode });
    } else {
      //dodanie do bazy
      this.props.editTask(id);
      //usunięcie z tablicy editMode
      let editMode = [...this.state.editMode];
      const index = editMode.indexOf(id);
      delete editMode[index];
      await this.setState({ editMode });
    }
  };

  render() {
    return (
      <div className="container medical-process-container">
        {this.props.activeAccount === "doctor" && (
          <form onSubmit={this.props.addTask}>
            <input type="text" placeholder="Tytuł" name="title" required />
            <select name="completed">
              <option value="done">Wykonane</option>
              <option value="todo">Do zrobienia</option>
            </select>
            <p>Data:</p>
            <input type="datetime-local" name="date" placeholder="date" />
            <textarea placeholder="Szczegóły" name="details" required />
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
                    <span className="task-header">
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
                        style={{fontFamily: "Wingdings"}}>
                      
                        &#33;
                      </button>
                    </span>

                    <div className="task-info">
                      {this.state.editMode.includes(task._id) ? (
                        <input
                          type="text"
                          name="details"
                          id="details"
                          defaultValue={task.details}
                          placeholder="Szczegóły"
                        />
                      ) : (
                        <p>{task.details}</p>
                      )}

                      {this.state.editMode.includes(task._id) ? (
                        <input
                          type="text"
                          name="date"
                          id="date"
                          defaultValue={task.date}
                          placeholder="Data"
                        />
                      ) : (
                        <p>{task.date}</p>
                      )}
                    </div>
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
                    <span className="task-header">
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
                        style={{fontFamily: "Wingdings"}}>
                      
                        &#33;
                      </button>
                    </span>

                    <div className="task-info">
                      {this.state.editMode.includes(task._id) ? (
                        <input
                          type="text"
                          name="details"
                          id="details"
                          defaultValue={task.details}
                          placeholder="Szczegóły"
                        />
                      ) : (
                        <p>{task.details}</p>
                      )}

                      {this.state.editMode.includes(task._id) ? (
                        <input
                          type="text"
                          name="date"
                          id="date"
                          defaultValue={task.date}
                          placeholder="Data"
                        />
                      ) : (
                        <p>{task.date}</p>
                      )}
                    </div>
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
