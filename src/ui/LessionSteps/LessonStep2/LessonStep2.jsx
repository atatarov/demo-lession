import { useState, useEffect, memo } from "react";

// 🔹 Дочерний компонент
const Child = ({ value }) => {
  console.log("🔄 Child перерендерился");
  return <div style={{ padding: "6px" }}>Child value: {value}</div>;
};

// 🔹 Мемоизированный ребёнок
const MemoChild = memo(Child);

export const LessonStep2 = () => {
  const [count, setCount] = useState(0);
  const [effectLog, setEffectLog] = useState([]);
  const [time, setTime] = useState(Date.now());
  const [intervalId, setIntervalId] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // эффект без зависимостей
  useEffect(() => {
    setEffectLog((logs) => [
      ...logs,
      "🔹 useEffect [] → вызвался один раз при mount",
    ]);
  }, []);

  // эффект с зависимостью
  useEffect(() => {
    setEffectLog((logs) => [...logs, `🔹 useEffect [count] → count=${count}`]);
  }, [count]);

  // запуск и остановка таймера
  const startTimer = () => {
    if (!intervalId) {
      const id = window.setInterval(() => {
        setTime(Date.now());
      }, 1000);
      setIntervalId(id);
    }
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
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

  return (
    <div>
      <h2>2. Мини-интерактив: рендеринг</h2>
      {/* Пример 1 */}
      <h3>Пример 1. Как работает setState</h3>
      <p>
        <code>setState</code> не обновляет состояние сразу. React может
        откладывать и объединять обновления (батчинг). Поэтому если вызвать
        несколько обновлений подряд, использование <code>count + 1</code> даст
        неожиданный результат.
      </p>
      <p>
        <b>Count:</b> {count}
      </p>
      <button
        onClick={() => {
          setCount(count + 1);
          setCount(count + 1);
          setCount(count + 1);
        }}
      >
        Увеличить на 3 (через count)
      </button>{" "}
      <button
        onClick={() => {
          setCount((prev) => prev + 1);
          setCount((prev) => prev + 1);
          setCount((prev) => prev + 1);
        }}
      >
        Увеличить на 3 (через prev)
      </button>
      <pre style={codeStyle}>{`
// Плохо: каждый вызов берёт "устаревшее" значение count
setCount(count + 1);
setCount(count + 1);
setCount(count + 1); // результат → +1, а не +3

// Хорошо: каждый вызов получает актуальное предыдущее значение
setCount(prev => prev + 1);
setCount(prev => prev + 1);
setCount(prev => prev + 1); // результат → +3
      `}</pre>
      <hr />
      {/* Пример 2 */}
      <h3>Пример 2. useEffect</h3>
      <p>
        Эффекты выполняются <b>после рендера</b>. Если указать в зависимостях пустой массив <code>[]</code> —
        сработает только один раз при mount. Если указать <code>[count]</code> —
        при каждом изменении count.
      </p>
      <pre style={codeStyle}>{`
useEffect(() => {
  console.log("Вызов один раз после mount");
}, []);

useEffect(() => {
  console.log("Сработал при изменении count");
}, [count]);
      `}</pre>
      <div
        style={{ background: "#eef4ff", padding: "10px", borderRadius: "6px" }}
      >
        {effectLog.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
      <hr />
      {/* Пример 3 */}
      <h3>Пример 3. Внешний источник (setInterval)</h3>
      <p>
        Здесь мы можем подписаться на внешний источник данных — например, на{" "}
        <code>setInterval</code>. Каждый тик вызывает <code>setState</code> →
        новый ререндер.
      </p>
      <p>
        <b>Текущее время:</b> {new Date(time).toLocaleTimeString()}
      </p>
      <button onClick={startTimer} disabled={!!intervalId}>
        Запустить таймер
      </button>{" "}
      <button onClick={stopTimer} disabled={!intervalId}>
        Остановить
      </button>
      <pre style={codeStyle}>{`
useEffect(() => {
  const interval = setInterval(() => {
    setTime(Date.now()); // каждый тик → ререндер
  }, 1000);
  return () => clearInterval(interval);
}, []);
      `}</pre>
      <p
        style={{ background: "#fff8e1", padding: "10px", borderRadius: "6px" }}
      >
        ⚡ Такой код работает, но если несколько компонентов подпишутся на один
        и тот же источник, можно получить лишние ререндеры или рассинхронизацию.
        К решению этой проблемы мы вернёмся позже.
      </p>
      <hr />
      {/* Пример 4 */}
      <h3>Пример 4. Оптимизация ререндеров</h3>
      <p>
        Посмотрите в консоль: когда изменяется <b>родительский count</b>,
        обычный ребёнок всегда перерендеривается. Но если обернуть его в{" "}
        <code>React.memo</code>, то он ререндерится только при изменении своих
        пропсов.
      </p>
      <button onClick={() => setCount((prev) => prev + 1)}>+1 к count</button>
      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        <div>
          <p>Обычный ребёнок:</p>
          <Child value={0} />
        </div>
        <div>
          <p>Мемоизированный ребёнок:</p>
          <MemoChild value={0} />
        </div>
      </div>
      <pre style={codeStyle}>{`
// Обычный ребёнок
const Child = ({ value }) => {
  console.log("Child перерендерился");
  return <div>{value}</div>;
};

// Мемоизированный
const MemoChild = React.memo(Child);
      `}</pre>
      <hr />
      {/* Вопрос */}
      <h3>Вопрос для самопроверки</h3>
      <p>Подумайте, что произойдёт в этом примере?</p>
      <pre style={codeStyle}>{`
const Example = () => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(value + 1);
  }, []);

  return <div>{value}</div>;
};
      `}</pre>
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        style={{
          marginTop: "6px",
          background: "royalblue",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "6px 10px",
          cursor: "pointer",
        }}
      >
        {showAnswer ? "Скрыть ответ" : "Показать ответ"}
      </button>
      {showAnswer && (
        <div
          style={{
            marginTop: "8px",
            padding: "10px",
            background: "#eef4ff",
            border: "1px solid #c7d8ff",
            borderRadius: "6px",
          }}
        >
          Такой код приведёт к <b>бесконечному циклу</b>. Эффект выполнится один
          раз после mount, внутри вызовется <code>setState</code> → это вызовет
          новый рендер → снова выполнится эффект. React будет пытаться обновлять
          компонент бесконечно.
        </div>
      )}
    </div>
  );
};
