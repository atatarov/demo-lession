import { useState, useEffect } from "react";
import { 
  getTodos, subscribe, addTodo, removeTodo, 
  startAutoStream, stopAutoStream 
} from "./fakeTodosStream";

export const LessonStep5 = () => (
  <div>
    <h2>5. Практика: подключаем внешний источник через useSyncExternalStore</h2>

    <p>
      Мы подготовили модуль <code>fakeTodosStream.js</code>. 
      Это <b>не настоящий WebSocket</b>, а учебная имитация внешнего асинхронного
      источника данных: задачи в нём обновляются с задержками и могут 
      поступать автоматически при включении потока. Такое поведение похоже на работу 
      глобального стора или реального стрима событий.
    </p>

    <h3>📄 Код модуля fakeTodosStream.js</h3>
    <p>
      Скопируйте этот код в новый файл <code>src/fakeTodosStream.js</code> вашего проекта:
    </p>

    <pre style={codeStyle}>{`// fakeTodosStream.js — имитация внешнего асинхронного источника
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
  }, Math.random() * 1000 + 300);
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

// управление автоматическим "стримом"
export function startAutoStream() {
  if (intervalId) return;
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
`}</pre>

    <h3>❌ Демонстрация проблемы</h3>
    <p>
      Ниже пример <b>BrokenTodos</b>, который подписывается на стор через{" "}
      <code>useEffect</code>. Из-за задержек и автоматических событий данные в
      разных местах интерфейса могут быть <b>несогласованными</b>.
    </p>

    <BrokenTodos />

    <h3>📝 Задание</h3>
    <p>
      Реализуйте компоненты <code>TodoList</code> и <code>TodoCounter</code>,
      которые читают данные из <code>fakeTodosStream.js</code>{" "}
      <b>с помощью useSyncExternalStore</b>.
    </p>

    <ul>
      <li>
        <code>TodoList</code> — отображает список задач и позволяет их удалять.
      </li>
      <li>
        <code>TodoCounter</code> — показывает количество задач.
      </li>
      <li>
        Оба компонента должны обновляться <b>синхронно</b>, даже если изменения
        приходят с задержкой или автоматически.
      </li>
    </ul>

    <p>
      Попробуйте сначала реализовать через <code>useEffect</code> и убедитесь,
      что данные рассинхронизируются. Затем исправьте код, подключив{" "}
      <code>useSyncExternalStore</code>.
    </p>
  </div>
);

// ---- ❌ broken demo ----
function BrokenTodos() {
  const [todos, setTodos] = useState(getTodos());
  const [count, setCount] = useState(getTodos().length);

  useEffect(() => {
    const unsub = subscribe(() => {
      // список обновляем сразу
      setTodos(getTodos());
      // имитируем "запаздывающий" подсчёт
      setTimeout(() => setCount(getTodos().length), 500);
    });
    return unsub;
  }, []);

  return (
    <div style={demoBox}>
      <p><b>BrokenTodos</b></p>
      <button onClick={() => addTodo("Новая задача")}>Добавить задачу</button>
      <button onClick={() => removeTodo(todos[0]?.id)}>Удалить первую</button>
      <button onClick={startAutoStream}>▶ Запустить поток</button>
      <button onClick={stopAutoStream}>⏹ Остановить поток</button>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>{t.text}</li>
        ))}
      </ul>
      <p>
        Список задач: {todos.length} <br />❌ Счётчик (может отставать): {count}
      </p>
    </div>
  );
}

// ---- стили ----
const demoBox = {
  background: "#f9f9f9",
  border: "1px solid #ddd",
  padding: "12px",
  borderRadius: "6px",
  maxWidth: "420px",
  marginTop: "12px",
};

const codeStyle = {
  background: "#f5f5f5",
  padding: "12px",
  borderRadius: "6px",
  overflowX: "auto",
  fontSize: "14px",
  lineHeight: "1.4",
  margin: "8px 0",
};
