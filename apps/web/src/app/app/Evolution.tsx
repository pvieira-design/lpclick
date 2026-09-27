"use client";

import { MotionConfig, motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import "./evolution.css";

/*
 * Gráficos ilustrativos da evolução registrada no app: impacto de uma condição
 * (autorrelato 0–10 das últimas 24 h), constância das doses e humor do Diário.
 * Dados fixos e fictícios; o app não avalia o tratamento.
 */

const EASE_OUT = [0.32, 0.72, 0, 1] as const;

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/* ─── Dados ─── */

const NOISE = [0.6, -0.4, 0.9, -0.8, 0.2, 1.1, -0.3, -0.9, 0.5, 0.1, -0.6, 0.8, -0.2, 0.4, -1, 0.7, 0.3, -0.5, 0.9, -0.1, -0.7, 0.6, 0.2, -0.4, 1, -0.8, 0.1, 0.5];
const DAYS = 56;
const IMPACT = Array.from({ length: DAYS }, (_, i) => {
  const trend = 7.2 - 3.8 * (1 - Math.exp(-i / 17));
  return Math.max(0, Math.min(10, Math.round(trend + NOISE[i % NOISE.length] * 1.4)));
});
const AVG = IMPACT.map((_, i) => {
  const win = IMPACT.slice(Math.max(0, i - 6), i + 1);
  return win.reduce((a, b) => a + b, 0) / win.length;
});
const START = new Date(2026, 7, 3); // 3 de agosto de 2026 → 27 de setembro
const dayLabel = (i: number) => {
  const d = new Date(START);
  d.setDate(d.getDate() + i);
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" }).replace(".", "");
};

/* 12 semanas × 7 dias, duas doses por dia; as últimas células são dias futuros. */
const WEEKS = 12;
const PARTIAL = new Set([6, 17, 25, 38, 51, 66]);
const MISSED = new Set([9, 30, 44]);
const ADHERENCE_SEED: number[] = Array.from({ length: WEEKS * 7 }, (_, i) => (MISSED.has(i) ? 0 : PARTIAL.has(i) ? 1 : 2));
const TODAY_INDEX = WEEKS * 7 - 1; // domingo, 27 de setembro

const MOOD_NAMES = ["Péssimo", "Mal", "Ok", "Bem", "Ótimo", "Incrível"] as const;
/* Escala divergente validada (dataviz/validate_palette.js): vizinhos ΔE ≥ 15 em CVD e visão normal. */
const MOOD_COLORS = ["#B4461B", "#E8925A", "#E3E3DE", "#7DBB88", "#3F8E4F", "#1D5A2C"];
const MOODS_BY_WEEK = [
  [2, 3, 5, 3, 1, 0],
  [1, 3, 5, 4, 1, 0],
  [1, 2, 5, 4, 2, 0],
  [0, 2, 4, 5, 3, 0],
  [0, 1, 4, 5, 3, 1],
  [0, 1, 3, 5, 4, 1],
  [0, 1, 2, 6, 4, 1],
  [0, 0, 2, 5, 5, 2],
];

/* ─── Linha: impacto da condição ─── */

function ImpactChart({ play }: { play: boolean }) {
  const [wrap, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const height = width < 520 ? 240 : 300;
  const pad = { top: 16, right: 16, bottom: 30, left: 28 };
  const w = Math.max(0, width - pad.left - pad.right);
  const h = height - pad.top - pad.bottom;
  const x = (i: number) => pad.left + (i / (DAYS - 1)) * w;
  const y = (v: number) => pad.top + (1 - v / 10) * h;

  const { line, area } = useMemo(() => {
    if (!w) return { line: "", area: "" };
    const pts = AVG.map((v, i) => [x(i), y(v)] as const);
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const cx = (x0 + x1) / 2;
      d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
    }
    return { line: d, area: `${d} L${x(DAYS - 1)},${y(0)} L${x(0)},${y(0)} Z` };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h]);

  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / r.width) * (DAYS - 1));
    setHover(Math.max(0, Math.min(DAYS - 1, i)));
  };

  const ticks = width < 520 ? [0, 28, 55] : [0, 14, 28, 42, 55];
  const tip = hover ?? null;

  return (
    <div ref={wrap} className="ev-plot">
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="Impacto da ansiedade nas últimas 24 horas, de 0 a 10, ao longo de 8 semanas: começa em 8 e fica em torno de 3 na última semana.">
          <defs>
            <linearGradient id="ev-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D6937" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#2D6937" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 5, 10].map((v) => (
            <g key={v}>
              <line x1={pad.left} x2={pad.left + w} y1={y(v)} y2={y(v)} className="ev-grid" />
              <text x={pad.left - 10} y={y(v) + 4} textAnchor="end" className="ev-axis">
                {v}
              </text>
            </g>
          ))}
          {ticks.map((i) => (
            <text key={i} x={x(i)} y={height - 8} textAnchor={i === 0 ? "start" : i === DAYS - 1 ? "end" : "middle"} className="ev-axis">
              {dayLabel(i)}
            </text>
          ))}

          {IMPACT.map((v, i) => (
            <circle key={i} cx={x(i)} cy={y(v)} r={2.5} className="ev-raw" />
          ))}

          <motion.path
            d={area}
            fill="url(#ev-area)"
            initial={false}
            animate={{ opacity: play ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke="#2D6937"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: play ? 1 : 0 }}
            transition={{ duration: 1.1, ease: EASE_OUT }}
          />

          <g>
            <circle cx={x(0)} cy={y(AVG[0])} r={5} className="ev-point" />
            <text x={x(0) + 10} y={y(AVG[0]) - 10} className="ev-callout">
              No início · {AVG[0].toFixed(0)}
            </text>
          </g>
          <motion.g initial={false} animate={{ opacity: play ? 1 : 0 }} transition={{ duration: 0.3, delay: 1 }}>
            <circle cx={x(DAYS - 1)} cy={y(AVG[DAYS - 1])} r={5} className="ev-point" />
            <text x={x(DAYS - 1) - 10} y={y(AVG[DAYS - 1]) - 12} textAnchor="end" className="ev-callout">
              Esta semana · {AVG[DAYS - 1].toFixed(1).replace(".", ",")}
            </text>
          </motion.g>

          {tip !== null && (
            <g pointerEvents="none">
              <line x1={x(tip)} x2={x(tip)} y1={pad.top} y2={pad.top + h} className="ev-cross" />
              <circle cx={x(tip)} cy={y(AVG[tip])} r={5} className="ev-point" />
              <circle cx={x(tip)} cy={y(IMPACT[tip])} r={4} className="ev-raw-on" />
            </g>
          )}
          <rect
            x={pad.left}
            y={pad.top}
            width={w}
            height={h}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
      )}
      {tip !== null && width > 0 && (
        <div className="ev-tip" style={{ left: Math.min(Math.max(x(tip), 90), width - 90), top: 0 }}>
          <strong>{dayLabel(tip)}</strong>
          <span>
            Registro do dia <b>{IMPACT[tip]}</b>
          </span>
          <span>
            Média de 7 dias <b>{AVG[tip].toFixed(1).replace(".", ",")}</b>
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Calendário de constância ─── */

const ADHERENCE_COLORS = ["#E6E9E6", "#B7DBBE", "#4C9A5B"]; // 0, 1, 2 doses de 2 (sequencial, um tom)

function AdherenceCalendar() {
  const [hover, setHover] = useState<number | null>(null);
  const weekdays = ["Seg", "", "Qua", "", "Sex", "", "Dom"];
  const cellDate = (i: number) => {
    const d = new Date(2026, 8, 27);
    d.setDate(d.getDate() - (TODAY_INDEX - i));
    return d.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" }).replace(/\./g, "");
  };
  const taken = ADHERENCE_SEED.slice(0, TODAY_INDEX + 1).reduce((a, b) => a + b, 0);
  const total = (TODAY_INDEX + 1) * 2;
  return (
    <div className="ev-cal-wrap">
      <div className="ev-cal" role="img" aria-label={`Doses tomadas nas últimas 12 semanas: ${taken} de ${total}.`}>
        <div className="ev-cal-days">
          {weekdays.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="ev-cal-grid" onPointerLeave={() => setHover(null)}>
          {Array.from({ length: WEEKS * 7 }, (_, i) => {
            const v = ADHERENCE_SEED[i];
            return (
              <span
                key={i}
                className={`ev-cell${hover === i ? " is-on" : ""}`}
                style={{ backgroundColor: ADHERENCE_COLORS[v] }}
                onPointerEnter={() => setHover(i)}
              />
            );
          })}
        </div>
      </div>
      <div className="ev-cal-foot">
        <span className="ev-cal-tip">
          {hover === null ? (
            <>
              <b>{Math.round((taken / total) * 100)}%</b> das doses registradas como tomadas
            </>
          ) : (
            <>
              <b>{cellDate(hover)}</b> · {ADHERENCE_SEED[hover]} de 2 doses
            </>
          )}
        </span>
        <span className="ev-legend">
          <span>
            <i style={{ background: ADHERENCE_COLORS[0] }} />0
          </span>
          <span>
            <i style={{ background: ADHERENCE_COLORS[1] }} />1
          </span>
          <span>
            <i style={{ background: ADHERENCE_COLORS[2] }} />2 doses
          </span>
        </span>
      </div>
    </div>
  );
}

/* ─── Humor por semana (Diário) ─── */

function MoodBars({ play }: { play: boolean }) {
  const [hover, setHover] = useState<{ w: number; m: number } | null>(null);
  return (
    <div className="ev-mood">
      <div className="ev-mood-bars" role="img" aria-label="Humor registrado depois das doses, por semana, ao longo de 8 semanas: registros de Bem, Ótimo e Incrível aumentam.">
        {MOODS_BY_WEEK.map((week, wi) => {
          const total = week.reduce((a, b) => a + b, 0);
          return (
            <div key={wi} className="ev-mood-col">
              <div className="ev-mood-stack">
                {week.map((n, mi) =>
                  n === 0 ? null : (
                    <motion.span
                      key={mi}
                      className={`ev-seg${hover && hover.w === wi && hover.m === mi ? " is-on" : ""}`}
                      style={{ backgroundColor: MOOD_COLORS[mi], flexGrow: n }}
                      initial={false}
                      animate={{ scaleY: play ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT, delay: play ? wi * 0.05 : 0 }}
                      onPointerEnter={() => setHover({ w: wi, m: mi })}
                      onPointerLeave={() => setHover(null)}
                      title={`Semana ${wi + 1}: ${n} de ${total} registros ${MOOD_NAMES[mi]}`}
                    />
                  ),
                )}
              </div>
              <span className="ev-mood-label">S{wi + 1}</span>
            </div>
          );
        })}
      </div>
      <div className="ev-mood-foot">
        <span className="ev-cal-tip">
          {hover ? (
            <>
              <b>Semana {hover.w + 1}</b> · {MOODS_BY_WEEK[hover.w][hover.m]} registros <b>{MOOD_NAMES[hover.m]}</b>
            </>
          ) : (
            <>Humor registrado depois de cada dose</>
          )}
        </span>
        <span className="ev-legend is-wrap">
          {MOOD_NAMES.map((name, i) => (
            <span key={name}>
              <i style={{ background: MOOD_COLORS[i] }} />
              {name}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

export function EvolutionCharts() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className="ev">
        <div className="ev-card ev-main">
          <div className="ev-head">
            <div>
              <span className="ev-eyebrow">Condição acompanhada</span>
              <strong>Ansiedade · impacto nas últimas 24 h</strong>
            </div>
            <div className="ev-stats">
              <div>
                <span>No início</span>
                <strong>{AVG[0].toFixed(0)}</strong>
              </div>
              <div>
                <span>Esta semana</span>
                <strong>{AVG[DAYS - 1].toFixed(1).replace(".", ",")}</strong>
              </div>
              <div className="is-accent">
                <span>Vs. início</span>
                <strong>Impacto menor</strong>
              </div>
            </div>
          </div>
          <ImpactChart play={inView} />
          <div className="ev-key">
            <span>
              <i className="ev-key-line" />
              Média de 7 dias
            </span>
            <span>
              <i className="ev-key-dot" />
              Registro diário (0 = não afetou, 10 = afetou muito)
            </span>
          </div>
        </div>
        <div className="ev-row">
          <div className="ev-card">
            <div className="ev-head is-small">
              <div>
                <span className="ev-eyebrow">Constância</span>
                <strong>Últimas 12 semanas</strong>
              </div>
            </div>
            <AdherenceCalendar />
          </div>
          <div className="ev-card">
            <div className="ev-head is-small">
              <div>
                <span className="ev-eyebrow">Diário</span>
                <strong>Como você se sentiu</strong>
              </div>
            </div>
            <MoodBars play={inView} />
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
