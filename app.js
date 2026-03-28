import { StorageManager } from "./storage.js";

const title = document.getElementById("to-do-title");
const toDoTasks = document.getElementById("to-do-tasks");
const completedTasks = document.getElementById("completed-tasks");
const btnAddTask = document.getElementById("add-task");

title.textContent = "To Do App";

function changeTaskStatus(e) {
  const id = e.target.id;
  const status = e.target.checked;
  const node = e.target.parentElement;

  StorageManager.changeTaskStatus(id, status);
  node.remove();

  const section = status ? completedTasks : toDoTasks;
  section.appendChild(node);
}

function renderTask({ id, isCompleted, name }) {
  const li = document.createElement("li");
  li.classList.add("list-tasks");

  const checkBox = document.createElement("input");
  checkBox.id = id;
  checkBox.type = "checkbox";
  checkBox.checked = isCompleted;

  checkBox.addEventListener("change", (e) => changeTaskStatus(e));

  const nameInput = document.createElement("input");
  nameInput.value = name;

  li.append(checkBox, nameInput);

  return li;
}

function loadTasks() {
  for (let task of StorageManager.filterByStatus(false)) {
    toDoTasks.prepend(renderTask(task));
  }

  for (let task of StorageManager.filterByStatus(true)) {
    completedTasks.prepend(renderTask(task));
  }
}

loadTasks();

function newTask({ name }) {
  const task = StorageManager.createTask({ name });
  toDoTasks.prepend(renderTask(task));
}

btnAddTask.addEventListener("click", (e) => newTask({ name: "new Task" }));
