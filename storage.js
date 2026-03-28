export class StorageManager {
  static setTitle(title) {
    localStorage.setItem("title", title);
  }

  static getTitle() {
    const title = localStorage.getItem("title");
    return title ? title : "To Do Title";
  }

  static getTasks(isCompleted = false) {
    const key = isCompleted ? "completed" : "to-do";
    const items = localStorage.getItem(key);

    return items ? JSON.parse(items) : [];
  }

  static updateTasks(isCompleted, newList) {
    const key = isCompleted ? "completed" : "to-do";

    localStorage.setItem(key, JSON.stringify(newList));
    return newList;
  }

  static createTask({ name }) {
    const tasks = this.getTasks();

    tasks.push({ id: crypto.randomUUID(), name });
    this.updateTasks(false, tasks);
  }

  static getTaskIndex(id, isCompleted) {
    return this.getTasks(isCompleted).findIndex((v) => v.id == id);
  }

  static getTaskById(id, isCompleted) {
    return this.getTasks(isCompleted).find((v) => v.id == id);
  }

  static moveTask(id, newStatus) {
    const index = this.getTaskIndex(id, !newStatus);

    if (index != -1) {
      const previousList = this.getTasks(!newStatus);

      const newList = this.getTasks(newStatus);
      newList.push(previousList.splice(index, 1));

      this.updateTasks(!newStatus, previousList);
      this.updateTasks(newStatus, newList);
    }
  }

  // Atualiza os campos de um to-do
  static patchToDo(id, payload) {
    const items = this.getTasks();
    const foundIndex = items.findIndex((v) => v.id == id);

    if (foundIndex != -1) {
      for (let key in payload) items[foundIndex][key] = payload[key];
      this.commitChanges(items);
    }

    return items[foundIndex];
  }

  // Deleta o To Do
  static deleteToDo(id) {
    const items = this.getTasks();
    const foundIndex = items.findIndex((v) => v.id == id);

    if (foundIndex != -1) {
      const item = items[foundIndex];

      items.splice(foundIndex, 1);
      this.commitChanges(items);

      return item;
    }
  }
}
