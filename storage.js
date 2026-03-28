export class StorageManager {
  static setTitle(title) {
    localStorage.setItem("title", title);
  }

  static getTitle() {
    const title = localStorage.getItem("title");
    return title ? title : "To Do Title";
  }

  static getTasks() {
    const items = localStorage.getItem("tasks");
    return items ? JSON.parse(items) : [];
  }

  static filterByStatus(isCompleted) {
    return this.getTasks().filter((v) => v.isCompleted == isCompleted);
  }

  static updateStorageTasks(newList) {
    localStorage.setItem("tasks", JSON.stringify(newList));
    return newList;
  }

  static createTask({ name }) {
    const tasks = this.getTasks();
    const newTask = { id: crypto.randomUUID(), name, isCompleted: false };

    tasks.push(newTask);
    this.updateStorageTasks(tasks);

    return newTask;
  }

  static getTaskIndex(id) {
    return this.getTasks().findIndex((v) => v.id == id);
  }

  static getTaskById(id) {
    return this.getTasks().find((v) => v.id == id);
  }

  static changeTaskStatus(id, status) {
    const index = this.getTaskIndex(id);

    if (index != -1) {
      const taskList = this.getTasks();
      const task = taskList[index];

      taskList[index]["isCompleted"] = status;
      this.updateStorageTasks(taskList);

      return task;
    }
  }

  static editTask(id, payload) {
    const items = this.getTasks();
    const foundIndex = this.getTaskIndex(id);

    if (foundIndex != -1) {
      for (let key in payload) items[foundIndex][key] = payload[key];
      this.updateStorageTasks(items);
    }

    return items[foundIndex];
  }

  static deleteTask(id) {
    const items = this.getTasks();
    const foundIndex = this.getTaskIndex(id);

    if (foundIndex != -1) {
      const item = items[foundIndex];

      items.splice(foundIndex, 1);
      this.updateStorageTasks(items);

      return item;
    }
  }
}
