"use client";

import { Html } from "@react-three/drei";

export function OverlayFader() {
  return (
    <Html fullscreen zIndexRange={[0, 0]}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          background:
            "radial-gradient(circle at 25% 15%, rgba(255, 226, 177, 0.35), transparent 55%)",
          pointerEvents: "none",
          mixBlendMode: "screen",
          opacity: 0.9
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(7, 17, 30, 0) 55%, rgba(16, 29, 46, 0.7) 100%)",
          pointerEvents: "none"
        }}
      />
    </Html>
  );
}
