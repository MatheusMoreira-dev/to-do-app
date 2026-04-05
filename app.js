import { StorageManager } from "./storage.js";

const title = document.getElementById("to-do-title");
const listTasks = document.getElementById("list-tasks");

// Listener de editar título no storage
title.textContent = StorageManager.getTitle();
title.addEventListener("blur", (e) =>
  StorageManager.setTitle(e.target.textContent),
);

let toDoTasks;
let completedTasks;

// Busca os itens no storage
function fetchTasks() {
  toDoTasks = StorageManager.filterByStatus(false);
  completedTasks = StorageManager.filterByStatus(true);
}

fetchTasks();

const spanTotalToDoTasks = document.getElementById("total-to-do");
const spanTotalCompletedTasks = document.getElementById("total-completed");

// Atualiza o total de tasks
function updateTotalTasks() {
  spanTotalToDoTasks.textContent = `(${toDoTasks.length})`;
  spanTotalCompletedTasks.textContent = `(${completedTasks.length})`;
}

// Função para mudar o Status de uma Task
function changeTaskStatus(e) {
  const id = e.target.id;
  const status = e.target.checked;
  const node = e.target.parentElement;

  StorageManager.changeTaskStatus(id, status);
  node.remove();
  fetchTasks();
  updateTotalTasks();
}

// Renderização de uma Task
function renderTask({ id, isCompleted, name }) {
  // Container
  const li = document.createElement("li");
  li.classList.add("task");

  // Checkbox
  const checkBox = document.createElement("input");
  checkBox.classList.add("checkbox");
  checkBox.id = id;
  checkBox.type = "checkbox";
  checkBox.checked = isCompleted;

  checkBox.addEventListener("change", (e) => changeTaskStatus(e));

  // Nome
  const nameInput = document.createElement("div");
  nameInput.contentEditable = true;
  nameInput.classList.add("name-task");
  nameInput.textContent = name;

  nameInput.addEventListener("blur", (e) => {
    StorageManager.editTask(id, { name: e.target.value });
    nameInput.scrollTop = 0;
  });

  // Deletar
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    StorageManager.deleteTask(id);
    li.remove();
    fetchTasks();
    updateTotalTasks();
  });

  const deleteIcon = document.createElement("span");
  deleteIcon.classList.add("material-symbols-outlined", "trash-icon");
  deleteIcon.textContent = "delete";

  deleteButton.appendChild(deleteIcon);

  // Adiciona ao container
  li.append(checkBox, nameInput, deleteButton);

  return li;
}

// Função para carregar as Tasks Salvas
function renderTasksByStatus(isCompleted) {
  listTasks.innerHTML = "";

  const tasks = isCompleted ? completedTasks : toDoTasks;

  for (let task of tasks) {
    listTasks.prepend(renderTask(task));
  }

  updateTotalTasks();
}

// Função para a criação de novas Tasks
function newTask({ name }) {
  const task = StorageManager.createTask({ name });
  listTasks.prepend(renderTask(task));

  fetchTasks();
  updateTotalTasks();
}

// Listener de adicionar uma nova Task
const btnAddTask = document.getElementById("add-task");
btnAddTask.addEventListener("click", (e) => newTask({ name: "Novo Item" }));

// Listener de filtrar as tarefas pendentes
const tabToDo = document.getElementById("tab-to-do");
tabToDo.addEventListener("click", () => {
  btnAddTask.style.display = "block";
  renderTasksByStatus(false);
});

// Listener de filtrar as tarefas concluídas
const tabCompleted = document.getElementById("tab-completed");
tabCompleted.addEventListener("click", () => {
  btnAddTask.style.display = "none";
  renderTasksByStatus(true);
});

renderTasksByStatus(false);
