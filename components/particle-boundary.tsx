"use client";
import { useEffect } from "react";
import { installParticleListeners } from "@/lib/particle-transition";

/** Mounts the global click listener for `data-particle-target`.
 *  Renders nothing. Safe to render once at the layout root. */
export function ParticleBoundary() {
  useEffect(() => installParticleListeners(), []);
  return null;
}
