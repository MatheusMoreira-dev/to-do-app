export class ToDoStorage {
  static key = "to-do-list";

  static getAll() {
    const items = localStorage.getItem(ToDoStorage.key);
    return items ? JSON.parse(items) : [];
  }

  static getById(id) {
    return this.getAll().find((t) => t.id == id);
  }

  static refreshStorage(updateList) {
    localStorage.setItem(ToDoStorage.key, JSON.stringify(updateList));
  }

  static create(toDoList) {
    const all = this.getAll();
    toDoList["id"] = crypto.randomUUID();

    all.push(toDoList);
    this.refreshStorage(all);
  }

  static patch(id, payload) {
    const items = this.getAll();
    const foundIndex = items.findIndex((v) => v.id == id);

    if (foundIndex != -1) {
      for (let key in payload) items[foundIndex][key] = payload[key];
      this.refreshStorage(items);
    }

    return items[foundIndex];
  }

  static delete(id) {
    const items = this.getToDoList();
    const foundIndex = items.findIndex((v) => v.id == id);

    if (foundIndex != -1) items.splice(foundIndex, 1);
    this.refreshStorage(items);
  }
}
