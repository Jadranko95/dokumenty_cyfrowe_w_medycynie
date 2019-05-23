import React, { Component } from "react";

import "../css/MedicalProcess.css";
import "../css/App.css";

class MedicalProcess extends Component {
  state = {
    tasks: [],
    editMode: "",
    view: "tasks"
  };

  editMode = async e => {
    const id = e.target.id;
    if (this.state.editMode !== id) {
      await this.setState({ editMode: id });
    } else {
      const title = document.querySelector("#title").value;
      const details = document.querySelector("#details").value;
      const date = document.querySelector("#date");
      if (title.trim() && details.trim() && date.checkValidity()) {
        //dodanie do bazy
        this.props.editTask(id);
        //usunięcie z tablicy editMode

        await this.setState({ editMode: "" });
      }
    }
  };

  changeView = async e => {
    console.log(e.target.value);
    this.setState({ view: e.target.value });
  };

  toggleActive = e => {
    console.log("click");
    e.target.parentElement.classList.toggle("active");
  };

  render() {
    return (
      <div className="container medical-process-container">
        <div className="change-view">
          <input
            type="radio"
            name="view"
            id="tasks"
            value="tasks"
            checked={this.state.view === "tasks"}
            onChange={this.changeView}
          />
          <label className="tasks-label" htmlFor="tasks">
            Widok zadań
          </label>
          <input
            type="radio"
            name="view"
            id="process"
            value="process"
            onChange={this.changeView}
          />
          <label className="process-label" htmlFor="process">
            Widok procesu
          </label>
        </div>
        {this.state.view === "tasks" && (
          <div className="task-view">
            {this.props.activeAccount === "doctor" && (
              <form onSubmit={this.props.addTask}>
                <span>
                  <input
                    type="text"
                    placeholder="Tytuł"
                    name="title"
                    required
                  />
                  <select name="completed">
                    <option value="done">Wykonane</option>
                    <option value="todo">Do zrobienia</option>
                  </select>
                  <textarea placeholder="Szczegóły" name="details" required />
                </span>
                <span>
                  <label>
                    Data:{" "}
                    <input
                      type="datetime-local"
                      name="date"
                      placeholder="date"
                    />
                  </label>

                  <label>
                    Zadanie poprzedzające:
                    <select className="previous-task" name="previousTask">
                      <option value="">Brak</option>
                      {this.props.tasks.map((task, i) => {
                        return (
                          <option key={i} value={task._id}>
                            {task.title}
                          </option>
                        );
                      })}
                    </select>
                  </label>
                  <input type="submit" value="Dodaj zadanie" />
                </span>
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
                                required
                                defaultValue={task.title}
                              />
                            ) : (
                              task.title
                            )}
                          </strong>
                    
                            <button
                              className="set-done"
                              id={task._id}
                              onClick={this.props.setCompleted}
                            >
                              ✓
                            </button>
                        

                          <button
                            className="edit"
                            onClick={this.editMode}
                            id={task._id}
                          />
                        </span>

                        <div className="task-info">
                          {this.state.editMode === task._id ? (
                            <input
                              type="text"
                              name="details"
                              id="details"
                              required
                              defaultValue={task.details}
                              placeholder="Szczegóły"
                            />
                          ) : (
                            <p>{task.details}</p>
                          )}

                          {this.state.editMode === task._id ? (
                            <input
                              type="text"
                              name="date"
                              id="date"
                              defaultValue={task.date}
                              placeholder="Data"
                              pattern="\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]){0,1}"
                            />
                          ) : (
                            <p>{task.date}</p>
                          )}
                        </div>
                        {this.state.editMode === task._id && (
                          <label className="previous-task-label">
                            Zadanie poprzedzające:
                            <select
                              className="previous-task"
                              id="previous-task"
                              defaultValue={task.previousTask}
                            >
                              <option value="">Brak</option>
                              {this.props.tasks.map((task, i) => {
                                return (
                                  <option key={i} value={task._id}>
                                    {task.title}
                                  </option>
                                );
                              })}
                            </select>
                          </label>
                        )}
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
                            {this.state.editMode === task._id ? (
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
                          />
                        </span>

                        <div className="task-info">
                          {this.state.editMode === task._id ? (
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

                          {this.state.editMode === task._id ? (
                            <input
                              type="text"
                              name="date"
                              id="date"
                              defaultValue={task.date}
                              placeholder="Data"
                              pattern="\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])"
                            />
                          ) : (
                            <p>{task.date}</p>
                          )}
                        </div>
                        {this.state.editMode === task._id && (
                          <label className="previous-task-label">
                            Zadanie poprzedzające:
                            <select
                              className="previous-task"
                              defaultValue={task.previousTask}
                              id="previous-task"
                            >
                              <option value="">Brak</option>
                              {this.props.tasks.map((task, i) => {
                                return (
                                  <option key={i} value={task._id}>
                                    {task.title}
                                  </option>
                                );
                              })}
                            </select>
                          </label>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        )}
        {this.state.view === "process" && (
          <div className="process-view">
            {this.props.tasks
              .filter(task => task.previousTask === "")
              .map((task, i) => {
                const color = task.completed
                  ? "rgb(218, 203, 169)"
                  : "rgb(206, 206, 193)";
                return (
                  <div className="process-task-list-item" key={i}>
                    <div
                      className="process-task"
                      style={{ background: color }}
                      onClick={this.toggleActive}
                    >
                      {" "}
                      <h4>{task.title}</h4>
                      <p className="date-process-task">{task.date}</p>
                      <p>{task.details}</p>{" "}
                    </div>

                    {task.nextTasks.length > 0 && (
                      <ul className="next-tasks">
                        <Task
                          task={task}
                          tasks={this.props.tasks}
                          toggleActive={this.toggleActive}
                        />
                      </ul>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }
}

export default MedicalProcess;

const Task = props => {
  console.log(props.tasks);
  return props.task.nextTasks.map((nextTaskId, i) => {
    const nextTask = props.tasks.filter(task => task._id === nextTaskId)[0];
    const color = nextTask.completed
      ? "rgb(218, 203, 169)"
      : "rgb(206, 206, 193)";
    return (
      <li className="next-task" key={i}>
        <div
          className="process-task  "
          style={{ background: color }}
          onClick={props.toggleActive}
        >
          {" "}
          <h4>{nextTask.title}</h4>
          <p className="date-process-task">{nextTask.date}</p>
          <p>{nextTask.details}</p>{" "}
        </div>

        {nextTask.nextTasks.length > 0 && (
          <ul className="next-tasks">
            <Task
              task={nextTask}
              tasks={props.tasks}
              toggleActive={props.toggleActive}
            />
          </ul>
        )}
      </li>
    );
  });
};
