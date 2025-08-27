import { useState } from "react";
import "./App.css";

import { LessonStep1 } from "./ui/LessionSteps/LessonStep1/LessonStep1";
import { LessonStep2 } from "./ui/LessionSteps/LessonStep2/LessonStep2";
import { LessonStep3 } from "./ui/LessionSteps/LessonStep3/LessonStep3";
import { LessonStep4 } from "./ui/LessionSteps/LessonStep4/LessonStep4";
import { LessonStep5 } from "./ui/LessionSteps/LessonStep5/LessonStep5";
import { LessonPagination } from "./ui/LessionPagination/LessionPagination";

const steps = [
  {
    id: 1,
    title: "Как устроен процесс рендеринга в React",
    component: <LessonStep1 />,
  },
  { id: 2, title: "Интерактив: рендеринг", component: <LessonStep2 /> },
  { id: 3, title: "Concurrent Rendering", component: <LessonStep3 /> },
  { id: 4, title: "Пример использования", component: <LessonStep4 /> },
  { id: 5, title: "Пример использования", component: <LessonStep5 /> },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () =>
    setCurrentStep((s) => (s < steps.length - 1 ? s + 1 : s));
  const prevStep = () => setCurrentStep((s) => (s > 0 ? s - 1 : s));

  return (
    <div className="App">
      <LessonPagination
        steps={steps}
        currentStep={currentStep}
        onNext={nextStep}
        onPrev={prevStep}
      />
      <div className="lesson-step">{steps[currentStep].component}</div>
    </div>
  );
}

export default App;
