"use client";
import { LazyMotion } from "framer-motion";

// Load the full DOM feature set (animations, gestures, layout) lazily,
// after the initial render, so it stays out of the critical-path bundle.
const loadFeatures = () =>
  import("framer-motion").then((mod) => mod.domMax);

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
