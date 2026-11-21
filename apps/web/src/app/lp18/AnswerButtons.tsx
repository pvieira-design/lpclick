"use client";

import { useState } from "react";
import { useAnswer } from "./Lp18Shell";

const ANSWERS = ["Sim", "Não"] as const;
type Answer = (typeof ANSWERS)[number];

// A resposta acende o botão e abre os passos do formulário (ver Lp18Shell).
export default function AnswerButtons() {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const responder = useAnswer();

  return (
    <div className="lp18-answers" role="group" aria-label="Sua resposta">
      {ANSWERS.map((a, i) => (
        <button
          key={a}
          type="button"
          className="lp18-answer"
          aria-pressed={answer === a}
          onClick={() => {
            setAnswer(a);
            responder(a === "Sim");
          }}
          style={{ "--i": i } as React.CSSProperties}
        >
          {a}
        </button>
      ))}
    </div>
  );
}
