import { useState, useTransition } from "react";

export const LessonStep3 = () => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  // --- Интерактив: Concurrent Rendering в действии ---
  const handleClick = () => {
    setCount((c) => c + 1); // синхронно

    startTransition(() => {
      heavyCalculation(); // выполняется "в фоне"
    });
  };

  return (
    <div>
      <h2>3. Что такое Concurrent Rendering</h2>

      <p>
        В React 18 появился <b>Concurrent Rendering</b> — новый режим рендера,
        при котором React может <b>приостанавливать</b> и <b>возобновлять</b>{" "}
        рендеринг без блокировки интерфейса.
      </p>

      <h3>Зачем он нужен?</h3>
      <ul>
        <li>
          Чтобы можно было откладывать неважные обновления с помощью{" "}
          <code>startTransition</code>.
        </li>
        <li>
          Чтобы React мог прерывать рендер «тяжёлых» компонентов и приоритетно
          отрисовывать важное.
        </li>
      </ul>

      <h3>Как это работает</h3>
      <pre style={codeStyle}>{`
React 17:
  Рендер идёт целиком →
    UI блокируется →
      потом обновляется весь DOM.

React 18:
  Рендер может приостановиться →
    в это время пользователь кликает или стор меняется →
      потом рендер возобновляется с учётом новых данных.
      `}</pre>

      <h3>Интерактив: отложенные обновления</h3>
      <p>
        Нажмите кнопку: счётчик обновится сразу, а тяжёлая операция выполнится{" "}
        <b>отложенно</b> через <code>startTransition</code>. Интерфейс при этом
        не зависает.
      </p>
      <button onClick={handleClick}>+1 к count</button>
      <p>Count: {count}</p>
      {isPending && (
        <p style={{ color: "orange" }}>⏳ Идёт тяжёлая работа...</p>
      )}

      <h4>Имитация тяжелого расчета: код из примера</h4>
      <pre style={codeStyle}>{`
function heavyCalculation() {
  let total = 0;
  for (let i = 0; i < 500000000; i++) {
    total += i;
  }
  console.log("Heavy calc done:", total);
}
      `}</pre>
      <pre style={codeStyle}>{`
// Пример с startTransition
const [count, setCount] = useState(0);
const [isPending, startTransition] = useTransition();

const handleClick = () => {
  setCount(c => c + 1); // синхронно
  startTransition(() => {
    heavyCalculation(); // отложено
  });
};
      `}</pre>

      <h3>Проблема с внешними источниками</h3>
      <p>
        Если данные приходят из <b>внешнего источника</b> (например, глобального
        стора или WebSocket), возникает риск: во время приостановки рендера
        данные могут измениться, и компонент отобразит{" "}
        <b>устаревшее состояние</b>.
      </p>
      <pre style={codeStyle}>{`
// Подписка через useEffect
function UserProfileBroken() {
  const [currentUser, setCurrentUser] = useState(getUser());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setCurrentUser(getUser()); // может "отстать" в Concurrent Mode
    });
    return unsubscribe;
  }, []);

  return <div>User: {currentUser.name}</div>;
}
      `}</pre>
      <p>решение этой проблемы мы рассмотрим в следующей главе.</p>

      <h3>Вопрос для самопроверки</h3>
      <p>Что произойдёт в этом примере?</p>

      <pre style={codeStyle}>{`
// Имитация внешнего стора
let user = { name: "Alice" };
let listeners = [];

function getUser() {
  return user;
}
function setUser(newUser) {
  user = newUser;
  listeners.forEach(l => l());
}
function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

// Компонент
function Example() {
  const [currentUser, setCurrentUser] = useState(getUser());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setCurrentUser(getUser());
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <p>User: {currentUser.name}</p>
      <button onClick={() => setUser({ name: currentUser.name === "Alice" ? "Bob" : "Alice" })}>
        Switch User
      </button>
    </div>
  );
}
      `}</pre>

      <button onClick={() => setShowAnswer(!showAnswer)} style={buttonStyle}>
        {showAnswer ? "Скрыть ответ" : "Показать ответ"}
      </button>

      {showAnswer && (
        <div style={answerStyle}>
          В обычном режиме React компонент будет обновляться корректно. Но в{" "}
          <b>Concurrent Mode</b>, если рендер приостановлен и в этот момент
          вызовется <code>setUser</code>, то <code>useEffect</code> подтянет{" "}
          <b>устаревшее значение</b>. В итоге на экране можно увидеть
          неактуальное имя пользователя.
        </div>
      )}
    </div>
  );
};

// ---- вспомогательная "тяжёлая" функция ----
function heavyCalculation() {
  let total = 0;
  for (let i = 0; i < 500000000; i++) {
    total += i;
  }
  console.log("Heavy calc done:", total);
}

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
