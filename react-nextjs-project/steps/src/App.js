import { useState } from "react";
const messages = [
  "Learn React*",
  "Apply for jobs 💼",
  "Invest your new income 💵",
];
export default function App() {
  const [step, setStep] = useState(1);
  const [close, setClose] = useState(false);
  function handlePrev() {
    if (step > 1) setStep((step) => step - 1);
  }
  function handleNext() {
    if (step < 3) setStep((step) => step + 1);
  }
  function handleClose() {
    setClose(!close);
  }
  return (
    <>
      <button className="close" onClick={handleClose}>
        &times;
      </button>
      {!close && (
        <div className="steps">
          <div className="numbers">
            <div className={step >= 1 && "active"}>1</div>
            <div className={step >= 2 && "active"}>2</div>
            <div className={step >= 3 && "active"}>3</div>
          </div>

          <page className="message">{messages[step - 1]}</page>
          <div className="buttons">
            <button
              style={{ backgroundColor: "#7950f2", color: "#fff" }}
              onClick={handlePrev}
            >
              Previous
            </button>
            <button
              style={{ backgroundColor: "#7950f2", color: "#fff" }}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
