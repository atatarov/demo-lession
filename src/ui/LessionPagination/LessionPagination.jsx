// components/LessonPagination.jsx
export const LessonPagination = ({ steps, currentStep, onNext, onPrev }) => {
  const currentTitle = steps[currentStep].title;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "black",
        color: "white", // 👈 белый текст
        boxShadow: "0 -2px 6px rgba(0,0,0,0.3)",
        zIndex: 1000,
        padding: "12px 20px",
      }}
    >
      {/* заголовок + шаги */}
      <div
        style={{
          marginBottom: "8px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "0.95rem",
        }}
      >
        Тема:{" "}
        <span style={{ color: "royalblue" }}>{currentTitle}</span> →
        {` шаг ${currentStep + 1} из ${steps.length}`}
      </div>

      {/* полоски прогресса */}
      <div
        style={{
          display: "flex",
          gap: "5px",
          margin: "0 auto 10px",
          maxWidth: "400px",
        }}
      >
        {steps.map((_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: "8px",
              borderRadius: "4px",
              background: index <= currentStep ? "royalblue" : "#444", // серый для незаполненных
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      {/* кнопки управления */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          style={{
            background: "transparent",
            border: "1px solid royalblue",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            opacity: currentStep === 0 ? 0.5 : 1,
          }}
        >
          ⬅ К предыдущему шагу
        </button>
        <button
          onClick={onNext}
          disabled={currentStep === steps.length - 1}
          style={{
            background: "royalblue",
            border: "none",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            opacity: currentStep === steps.length - 1 ? 0.5 : 1,
          }}
        >
          Далее ➡
        </button>
      </div>
    </div>
  );
};
