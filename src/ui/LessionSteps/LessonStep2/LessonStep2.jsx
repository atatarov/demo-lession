// ui/LessonStep2.jsx
import { useState } from "react";

export const LessonStep2 = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>2. Мини-интерактив: рендеринг</h2>
      <p>
        Каждый клик по кнопке вызывает <code>setCount</code>, и React перерендеривает компонент.
      </p>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
};
