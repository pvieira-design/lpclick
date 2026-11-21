// Clico, o mascote da Click, na pose padrão. É o rig oficial do aidesignclick
// (brand/mascote/mascote-01-padrao.svg): origem (0,0) = centro do corpo, três
// cores chapadas. Só o ângulo do braço direito é animado (o "tchau"), o que o
// guia do mascote permite; as formas não são alteradas.
const RAY = (len: number) =>
  `M0 -82 L${len} -82 A82 82 0 0 1 ${len} 82 L0 82 A82 82 0 0 1 0 -82 Z`;

export default function Clico({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-660 -560 1280 1280" aria-hidden="true">
      <defs>
        <path
          id="lp18-perna"
          d="M-66 0 L-86 555 A75 75 0 0 0 -11 630 L222 630 A81 81 0 0 0 249 472.6 L101.8 420.6 A25 25 0 0 1 85.2 398.2 L66 0 Z"
        />
        <g id="lp18-olho">
          <ellipse rx="79.5" ry="49.6" fill="#EBEDC2" />
          <circle cx="36.2" cy="-16.6" r="41.8" fill="#00A819" />
        </g>
        <clipPath id="lp18-recorte-boca">
          <use href="#lp18-perna" transform="translate(-45 -27) rotate(33) scale(-1 1)" />
          <use href="#lp18-perna" transform="translate(75 35) rotate(0)" />
        </clipPath>
      </defs>

      <g fill="#00A819">
        <use href="#lp18-perna" transform="translate(-45 -27) rotate(33) scale(-1 1)" />
        <use href="#lp18-perna" transform="translate(75 35) rotate(0)" />
      </g>
      <g clipPath="url(#lp18-recorte-boca)" fill="#10392D">
        <path transform="translate(19.8 -66.3) rotate(19.1)" d="M51.6 116.9 A181 68 0 0 0 413.6 116.9 Z" />
      </g>
      <g fill="#00A819">
        <path transform="rotate(-121)" d={RAY(495)} />
        <path transform="rotate(-74)" d={RAY(455)} />
        <path transform="rotate(-23)" d={RAY(465)} />
        {/* braço direito: gira em torno do centro do corpo */}
        <g className="lp18-clico-arm">
          <path transform="rotate(19)" d={RAY(523)} />
        </g>
        <path transform="rotate(200)" d={RAY(529)} />
        <path d="M-171 -141 L-293.1 -185.4 L-290.4 -193 A38 38 0 0 0 -244.8 -248.2 L-238 -252.4 Z" />
        <path d="M-23.7 -180.1 L-78.7 -274.7 L-71.9 -278.8 A38 38 0 0 0 -2.8 -287.9 L4.9 -285.7 Z" />
        <path d="M110.3 -124.7 L140.5 -221.4 L148.2 -219.2 A38 38 0 0 0 199.5 -173.8 L202.7 -166.4 Z" />
        <path d="M204.7 -7.1 L316.7 -54 L319.8 -46.7 A38 38 0 0 0 322.3 24.2 L319.7 31.8 Z" />
      </g>
      <g transform="translate(19.8 -66.3) rotate(19.1)">
        <use href="#lp18-olho" x="-90.7" />
        <use href="#lp18-olho" x="90.7" />
      </g>
    </svg>
  );
}
