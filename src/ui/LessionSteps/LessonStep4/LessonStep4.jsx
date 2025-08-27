import { UserProfileBroken } from "./ui/UserProfileBroken//UserProfileBroken";
import { UserProfileFixed } from "./ui/UserProfileFixed/UserProfileFixed";

export const LessonStep4 = () => (
  <div>
    <h2>4. Пример использования</h2>
    <p>
      Сравните две версии компонента. В красной ❌ возможны устаревшие данные,
      в зелёной ✅ всегда актуальное состояние.
    </p>
    <UserProfileBroken />
    <UserProfileFixed />
  </div>
);
