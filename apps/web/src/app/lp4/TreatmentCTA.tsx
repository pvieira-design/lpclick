"use client";

export default function TreatmentCTA() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("treatment:open"));
  };

  return (
    <section className="bg-white pb-16 sm:pb-24">
      <div className="mx-auto w-full max-w-xl px-5">
        <button
          type="button"
          onClick={handleClick}
          className="w-full rounded-xl py-4 text-base font-bold text-white transition-all duration-150 ease-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a7a4f] focus-visible:ring-offset-2 active:scale-[0.98] sm:text-lg"
          style={{ backgroundColor: "#3D8F4A" }}
        >
          Iniciar meu Tratamento
        </button>
      </div>
    </section>
  );
}
