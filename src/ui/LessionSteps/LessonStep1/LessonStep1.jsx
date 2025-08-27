import { useState } from "react";

export const LessonStep1 = () => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div>
      <h2>1. Как устроен процесс рендеринга в React</h2>

      <p>
        Рендеринг в React — это процесс вычисления того, что должно быть
        показано на экране. Каждый раз, когда меняются <i>state</i> или{" "}
        <i>props</i>, функция-компонент вызывается заново и возвращает JSX.
      </p>

      <h3>Во что превращается JSX?</h3>
      <pre style={codeStyle}>{`
const SomeComponent = () => (
  <div>
    <h1>Hello</h1>
  </div>
);
      `}</pre>

      <p>
        На самом деле JSX не «понимается» браузером напрямую. Babel превращает
        его в вызовы функции <code>React.createElement</code>:
      </p>

      <pre style={codeStyle}>{`
const SomeComponent = React.createElement(
  "div",
  null,
  React.createElement("h1", null, "Hello")
);
      `}</pre>

      <p>
        Поэтому компонент всегда должен возвращать{" "}
        <b>ровно один корневой элемент</b>. Если элементов несколько, их нужно
        обернуть в <code>&lt;div&gt;</code> или{" "}
        <code>&lt;React.Fragment&gt;</code>.
      </p>

      {/* Фазы обновления */}
      <h3>Фазы обновления React</h3>
      <pre style={{ ...codeStyle, textAlign: "center" }}>{`
Render → Reconciliation (diff) → Commit
      `}</pre>
      <ul>
        <li>
          <b>Render</b> — вызов компонента, построение Virtual DOM.
        </li>
        <li>
          <b>Reconciliation</b> — сравнение нового дерева с предыдущим
          (diffing).
        </li>
        <li>
          <b>Commit</b> — обновление реального DOM.
        </li>
      </ul>

      {/* Что происходит в браузере */}
      <h3>Что происходит в браузере?</h3>
      <pre style={{ ...codeStyle, textAlign: "center" }}>{`
DOM изменился →
  Reflow (пересчёт размеров и положения элементов)
    →
  Repaint (перерисовка изменённых частей экрана)
      `}</pre>
      <ul>
        <li>
          <b>Reflow</b> — браузер пересчитывает размеры и положение элементов,
          чтобы понять, как они должны отображаться.
        </li>
        <li>
          <b>Repaint</b> — отрисовка элементов на экране после пересчёта.
        </li>
      </ul>
      <p>
        Эти операции дорогие, поэтому React старается минимизировать количество
        изменений и обновлять только то, что реально изменилось.
      </p>

      {/* Жизненный цикл */}
      <h3>Жизненный цикл компонента</h3>
      <pre style={{ ...codeStyle, textAlign: "center" }}>{`
Mount → Update → Unmount
      `}</pre>
      <ul>
        <li>
          <b>Mount</b> — первый рендер и вставка в DOM.
        </li>
        <li>
          <b>Update</b> — повторный рендер при изменении пропсов или состояния.
        </li>
        <li>
          <b>Unmount</b> — удаление компонента и очистка ресурсов.
        </li>
      </ul>

      {/* Оптимизация */}
      <h3>Как оптимизировать ререндеры?</h3>
      <p>
        При каждом изменении <i>state</i> или <i>props</i> React вызывает
        функцию-компонент заново. Это нормально, но иногда приводит к лишним
        пересчётам и ререндерам дочерних компонентов. Чтобы этого избежать,
        используют приёмы мемоизации:
      </p>
      <ul>
        <li>
          <code>React.memo</code> — оборачивает компонент и предотвращает его
          повторный рендер, если <b>пропсы не изменились</b>. Работает как
          «защитный слой» над целым компонентом.
        </li>
        <li>
          <code>useMemo</code> — кеширует результат вычислений внутри
          компонента. Полезно, если функция возвращает «тяжёлое» значение
          (например, фильтрация или сортировка данных). Вычисление повторится
          только при изменении зависимостей.
        </li>
        <li>
          <code>useCallback</code> — кеширует саму функцию. Это важно, если
          функция передаётся в дочерние компоненты как проп. Без мемоизации при
          каждом ререндере будет создаваться новая ссылка, что приведёт к лишним
          рендерам дочернего компонента.
        </li>
      </ul>

      <pre style={codeStyle}>{`
// React.memo
const Child = React.memo(({ value }) => <div>{value}</div>);

// useMemo
const filtered = useMemo(() => heavyFilter(items), [items]);

// useCallback
const handleClick = useCallback(() => {
  console.log("Clicked");
}, []);
      `}</pre>

      {/* Вопрос */}
      <h3>Вопрос для самопроверки:</h3>
      <ol>
        <li>
          Что произойдёт в результате, если написать компонент так?
          <pre style={codeStyle}>{`
const WrongComponent = () => (
  <div>Hello</div>
  <div>World</div>
);
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
              JSX всегда должен возвращать <b>один корневой элемент</b>. В
              примере выше JSX содержит два тега <code>&lt;div&gt;</code> на
              одном уровне. Babel при компиляции превратит это в два вызова{" "}
              <code>React.createElement</code>, а React ожидает только один. В
              итоге будет ошибка:{" "}
              <i>"Adjacent JSX elements must be wrapped in an enclosing tag"</i>
              . Решение: обернуть элементы в <code>&lt;div&gt;</code> или{" "}
              <code>&lt;React.Fragment&gt;</code>.
            </div>
          )}
        </li>
      </ol>
    </div>
  );
};

const codeStyle = {
  background: "#f5f5f5",
  padding: "12px",
  borderRadius: "6px",
  overflowX: "auto",
  fontSize: "14px",
  lineHeight: "1.4",
};
