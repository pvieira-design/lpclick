"use client";

import { useState } from "react";

const ANSWERS = ["Sim", "Não"] as const;
type Answer = (typeof ANSWERS)[number];

// Por enquanto só marca a resposta; o próximo passo do fluxo ainda vai ser definido.
export default function AnswerButtons() {
  const [answer, setAnswer] = useState<Answer | null>(null);

  return (
    <div className="lp18-answers" role="group" aria-label="Sua resposta">
      {ANSWERS.map((a, i) => (
        <button
          key={a}
          type="button"
          className="lp18-answer"
          aria-pressed={answer === a}
          onClick={() => setAnswer(a)}
          style={{ "--i": i } as React.CSSProperties}
        >
          {a}
        </button>
      ))}
    </div>
  );
}
