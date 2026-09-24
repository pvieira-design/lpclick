"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SectionHeading({
  label,
  title,
  description,
  className = "",
}: {
  label: string;
  title: string;
  description: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className={`grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-8 sm:gap-y-2 ${className}`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <span className="inline-flex w-fit items-center rounded-full bg-[#cde9d1] px-3 py-1 text-xs font-medium text-[#285e31] sm:col-start-2 sm:row-start-1 sm:justify-self-end sm:text-sm">
        {label}
      </span>
      <h2 className="font-display text-[2rem] font-medium leading-[1.05] text-gray-900 sm:col-start-1 sm:row-span-2 sm:row-start-1 sm:text-[3rem]">
        {title}
      </h2>
      <p className="text-xs text-gray-500 sm:col-start-2 sm:row-start-2 sm:text-right sm:text-sm">
        {description}
      </p>
    </motion.header>
  );
}
