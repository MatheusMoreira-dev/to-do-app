import { StorageManager } from "./storage.js";

const title = document.getElementById("to-do-title");
const listTasks = document.getElementById("list-tasks");
const titleSectionTasks = document.getElementById("tasks-section-title");
const totalTasks = document.getElementById("total-tasks");

// Listener de editar título no storage
title.textContent = StorageManager.getTitle();
title.addEventListener("blur", (e) =>
  StorageManager.setTitle(e.target.textContent),
);

// Atualiza o total de tasks
const updateTotalTasks = () =>
  (totalTasks.textContent = `(${listTasks.childElementCount})`);

// Função para mudar o Status de uma Task
function changeTaskStatus(e) {
  const id = e.target.id;
  const status = e.target.checked;
  const node = e.target.parentElement;

  StorageManager.changeTaskStatus(id, status);
  node.remove();
  updateTotalTasks();
}

// Renderização de uma Task
function renderTask({ id, isCompleted, name }) {
  // Container
  const li = document.createElement("li");
  li.classList.add("list-tasks");

  // Checkbox
  const checkBox = document.createElement("input");
  checkBox.id = id;
  checkBox.type = "checkbox";
  checkBox.checked = isCompleted;

  checkBox.addEventListener("change", (e) => changeTaskStatus(e));

  // Nome
  const nameInput = document.createElement("input");
  nameInput.value = name;

  nameInput.addEventListener("blur", (e) =>
    StorageManager.editTask(id, { name: e.target.value }),
  );

  // Deletar
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    StorageManager.deleteTask(id);
    li.remove();
    updateTotalTasks();
  });

  // Adiciona ao container
  li.append(checkBox, nameInput, deleteButton);

  return li;
}

// Função para carregar as Tasks Salvas
function loadTasks(isCompleted) {
  listTasks.innerHTML = "";
  titleSectionTasks.textContent = isCompleted ? "Concluídas" : "Pendentes";

  const tasks = StorageManager.filterByStatus(isCompleted);

  for (let task of tasks) {
    listTasks.prepend(renderTask(task));
  }

  updateTotalTasks();
}

// Função para a criação de novas Tasks
function newTask({ name }) {
  const task = StorageManager.createTask({ name });
  listTasks.prepend(renderTask(task));
  updateTotalTasks();
}

// Listener de adicionar uma nova Task
const btnAddTask = document.getElementById("add-task");
btnAddTask.addEventListener("click", (e) => newTask({ name: "new Task" }));

// Listener de filtrar as tarefas pendentes
const tabToDo = document.getElementById("tab-to-do");
tabToDo.addEventListener("click", () => {
  btnAddTask.style.display = "block";
  loadTasks(false);
});

// Listener de filtrar as tarefas concluídas
const tabCompleted = document.getElementById("tab-completed");
tabCompleted.addEventListener("click", () => {
  btnAddTask.style.display = "none";
  loadTasks(true);
});

loadTasks(false);
