// ui/LessonStep3.jsx
export const LessonStep3 = () => (
  <div>
    <h2>3. Какие задачи решает useSyncExternalStore</h2>
    <ul>
      <li>Гарантирует согласованность данных в рендере</li>
      <li>Избегает устаревших значений при Concurrent Rendering (React 18+)</li>
      <li>Обновляет компонент только при реальном изменении данных</li>
    </ul>
  </div>
);
