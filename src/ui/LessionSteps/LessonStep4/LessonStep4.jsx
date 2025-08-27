import { useState } from "react";
import { UserProfileBroken } from "./ui/UserProfileBroken/UserProfileBroken";
import { UserProfileFixed } from "./ui/UserProfileFixed/UserProfileFixed";

export const LessonStep4 = () => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div>
      <h2>4. Решение: useSyncExternalStore</h2>

      <p>
        Чтобы исправить проблему с устаревшими данными в Concurrent Rendering,
        React 18 представил хук{" "}
        <code>useSyncExternalStore</code>. Он создан специально для работы с{" "}
        <b>внешними источниками данных</b>.
      </p>

      <h3>Как работает хук?</h3>
      <ul>
        <li>
          <b>subscribe</b> — функция подписки и отписки от изменений;
        </li>
        <li>
          <b>getSnapshot</b> — функция, которая возвращает актуальные данные
          прямо сейчас.
        </li>
      </ul>

      <pre style={codeStyle}>{`
const value = useSyncExternalStore(subscribe, getSnapshot);
      `}</pre>

      <h3>Сравним два варианта</h3>

      <h4>Без useSyncExternalStore</h4>
      <pre style={codeStyle}>{`
// Компонент без useSyncExternalStore
function UserProfileBroken() {
  const [currentUser, setCurrentUser] = useState(getUser());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setCurrentUser(getUser()); // может "отстать"
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <p>User: {currentUser.name}</p>
      <button onClick={() =>
        setUser({ name: currentUser.name === "Alice" ? "Bob" : "Alice" })
      }>
        Switch User
      </button>
    </div>
  );
}
      `}</pre>
      <UserProfileBroken />

      <h4>С useSyncExternalStore</h4>
      <pre style={codeStyle}>{`
// Компонент с useSyncExternalStore
function UserProfileFixed() {
  const user = useSyncExternalStore(subscribe, getUser);

  return (
    <div>
      <p>User: {user.name}</p>
      <button onClick={() =>
        setUser({ name: user.name === "Alice" ? "Bob" : "Alice" })
      }>
        Switch User
      </button>
    </div>
  );
}
      `}</pre>
      <UserProfileFixed />

      <h3>Разберем, что изменилось</h3>
      <p>
        Чтобы исправить компонент, нужно заменить <code>useState</code> +{" "}
        <code>useEffect</code> на <code>useSyncExternalStore</code>. Вот ключевые шаги:
      </p>
      <ol>
        <li>
          <b>Убрать локальный стейт</b>:<br />
          В Broken мы писали{" "}
          <code>
            const [currentUser, setCurrentUser] = useState(getUser());
          </code>
          . Это не нужно, потому что <code>useSyncExternalStore</code> сам хранит
          актуальное значение.
        </li>
        <li>
          <b>Убрать useEffect</b>:<br />
          В Broken мы подписывались на стор в <code>useEffect</code> и вручную
          обновляли стейт. В Fixed подписка и обновления происходят
          автоматически внутри <code>useSyncExternalStore</code>.
        </li>
        <li>
          <b>Подключить useSyncExternalStore</b>:<br />
          Вместо стейта используем:{" "}
          <code>const user = useSyncExternalStore(subscribe, getUser);</code>
        </li>
        <li>
          <b>Использовать user напрямую</b>:<br />
          Теперь компонент сразу рендерит <code>user.name</code>, без промежуточного{" "}
          <code>setState</code>.
        </li>
      </ol>

      <pre style={codeStyle}>{`// Было
const [currentUser, setCurrentUser] = useState(getUser());
useEffect(() => {
  const unsubscribe = subscribe(() => setCurrentUser(getUser()));
  return unsubscribe;
}, []);

// Стало
const user = useSyncExternalStore(subscribe, getUser);
      `}</pre>

      <h3>Чем отличается useSyncExternalStore от useEffect?</h3>
      <p>Главное отличие в том, <b>когда</b> React получает данные:</p>

      <pre style={codeStyle}>{`
useEffect:
  1. Компонент отрендерился.
  2. React вызвал useEffect → обновили state.
  3. Компонент перерендерился ещё раз.

useSyncExternalStore:
  1. React вызывает getSnapshot ПРЯМО во время рендера.
  2. Компонент сразу получает актуальные данные.
  3. Если данные изменились — React запускает новый рендер синхронно.
      `}</pre>

      <ul>
        <li>
          В <code>useEffect</code> данные приходят <b>после</b> рендера — UI
          может на миг показать устаревшее состояние.
        </li>
        <li>
          В <code>useSyncExternalStore</code> данные берутся <b>синхронно</b> во
          время рендера — компонент никогда не увидит «старое» значение.
        </li>
      </ul>

      <h3>Схема сравнения</h3>
      <pre style={{ ...codeStyle, textAlign: "center" }}>{`
useEffect → render → (устаревшие данные) → эффект → setState → render

useSyncExternalStore → render → getSnapshot (актуальные данные) → UI сразу правильный
      `}</pre>

      <h3>Вопрос для самопроверки</h3>
      <p>
        Взгляните на этот код. Что будет происходить с компонентом{" "}
        <code>Profile</code> при кликах?
      </p>

      <pre style={codeStyle}>{`
// Имитация стора
let user = { name: "Alice" };
let listeners = [];

function setUser(newUser) {
  user = newUser;
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return { ...user }; // всегда новый объект
}

function Profile() {
  const u = useSyncExternalStore(subscribe, getSnapshot);
  console.log("render:", u.name);
  return <p>User: {u.name}</p>;
}
      `}</pre>

      <button onClick={() => setShowAnswer(!showAnswer)} style={buttonStyle}>
        {showAnswer ? "Скрыть ответ" : "Показать ответ"}
      </button>

      {showAnswer && (
        <div style={answerStyle}>
          <p>
            Компонент <code>Profile</code> будет{" "}
            <b>перерендериваться при каждом уведомлении</b>, даже если имя
            пользователя не изменилось.
          </p>
          <p>
            Причина: <code>getSnapshot</code> всегда создаёт{" "}
            <b>новый объект</b> <code>{`{ ...user }`}</code>. React сравнивает
            ссылки и думает, что состояние изменилось.
          </p>
          <p>
            Правильно: возвращать одну и ту же ссылку, если данные не
            менялись:
          </p>
          <pre style={codeStyle}>{`
function getSnapshot() {
  return user; // возвращаем ту же ссылку
}
          `}</pre>
        </div>
      )}
    </div>
  );
};

// ---- стили ----
const codeStyle = {
  background: "#f5f5f5",
  padding: "12px",
  borderRadius: "6px",
  overflowX: "auto",
  fontSize: "14px",
  lineHeight: "1.4",
  margin: "8px 0",
};

const buttonStyle = {
  marginTop: "6px",
  background: "royalblue",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "6px 10px",
  cursor: "pointer",
};

const answerStyle = {
  marginTop: "8px",
  padding: "10px",
  background: "#eef4ff",
  border: "1px solid #c7d8ff",
  borderRadius: "6px",
};
