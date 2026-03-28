import { StorageManager } from "./storage.js";

const title = document.getElementById("to-do-title");
const toDoTasks = document.getElementById("to-do-tasks");
const completedTasks = document.getElementById("completed-tasks");
const btnAddTask = document.getElementById("add-task");

title.textContent = "To Do App";

function moveTaskByStatus(node, isCompleted) {
  node.remove();

  if (isCompleted) {
    completedTasks.appendChild(node);
  } else {
    toDoTasks.appendChild(node);
  }
}

function newTask({ isCompleted, name }) {
  StorageManager.createToDo({ isCompleted, name });
  toDoTasks.prepend(renderTask({ isCompleted, name }));
}

btnAddTask.addEventListener("click", (e) =>
  newTask({ name: "new Task", isCompleted: false }),
);

function renderTask({ isCompleted, name }) {
  const li = document.createElement("li");
  li.classList.add("list-tasks");

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.checked = isCompleted;

  checkBox.addEventListener("change", (e) => {
    moveTaskByStatus(e.target.parentElement, e.target.checked);
  });

  const nameInput = document.createElement("input");
  nameInput.value = name;

  li.append(checkBox, nameInput);

  return li;
}
