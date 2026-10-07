// Shared SVG icon set for landing sections
import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const base: React.SVGProps<SVGSVGElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

export const Check = ({ size = 16, ...p }: Props) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

export const Cross = ({ size = 16, ...p }: Props) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ArrowRight = ({ size = 16, ...p }: Props) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export const Play = ({ size = 14, ...p }: Props) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M7 5l12 7-12 7V5z" fill="currentColor" stroke="none" />
  </svg>
);

export const Terminal = ({ size = 16, ...p }: Props) => (
  <svg width={size} height={size} {...base} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 9l3 3-3 3M13 15h4" />
  </svg>
);

export const Flame = ({ size = 16, ...p }: Props) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M12 3s4 4.5 4 8a4 4 0 11-8 0c0-1.8 1.2-3.5 1.2-3.5S12 9 12 3z" />
    <path d="M9 14a3 3 0 005.2-2" />
  </svg>
);

export const Bug = ({ size = 16, ...p }: Props) => (
  <svg width={size} height={size} {...base} {...p}>
    <rect x="8" y="7" width="8" height="11" rx="4" />
    <path d="M9 7V5a3 3 0 016 0v2" />
    <path d="M6 12H4M20 12h-2M6 17l-2 1.5M18 17l2 1.5M6 7L4 5.5M18 7l2-1.5" />
  </svg>
);

export const Sparkle = ({ size = 16, ...p }: Props) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </svg>
);

export const Eye = ({ size = 16, ...p }: Props) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const ChevronDown = ({ size = 18, ...p }: Props) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);