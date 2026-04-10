"use client";

import { useState } from "react";

interface FilterDropdownProps {
  label: string;
}

export function FilterDropdown({ label }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-edu-light bg-white font-lexend font-medium text-sm text-edu-dark hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-colors"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      onClick={() => setIsOpen(!isOpen)}
    >
      {label}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m19 9-7 7-7-7"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
