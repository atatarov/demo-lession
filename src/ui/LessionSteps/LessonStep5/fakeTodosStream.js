// fakeTodosStream.js — имитация внешнего асинхронного источника
let todos = [{ id: 1, text: "Первая задача" }];
let listeners = [];
let intervalId = null;

function notify() {
  listeners.forEach((l) => l());
}

export function addTodo(text) {
  setTimeout(() => {
    todos = [...todos, { id: Date.now(), text }];
    notify();
  }, Math.random() * 1000 + 300); // задержка 300–1300 мс
}

export function removeTodo(id) {
  setTimeout(() => {
    todos = todos.filter((t) => t.id !== id);
    notify();
  }, Math.random() * 1000 + 300);
}

export function getTodos() {
  return todos;
}

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

// --- управление автоматическим "стримом"
export function startAutoStream() {
  if (intervalId) return; // уже запущен
  intervalId = setInterval(() => {
    todos = [...todos, { id: Date.now(), text: "Автоматическая задача" }];
    notify();
  }, 3000);
}

export function stopAutoStream() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
