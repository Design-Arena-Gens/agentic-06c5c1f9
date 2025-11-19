"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Environment,
  Sky
} from "@react-three/drei";
import DesertScene from "./desert/DesertScene";
import { OverlayFader } from "./desert/OverlayFader";

export default function SceneCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 3.2, 8], fov: 42, near: 0.1, far: 200 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, toneMappingExposure: 1.2 }}
    >
      <color attach="background" args={["#0d1e2e"]} />
      <fog attach="fog" args={["#13273c", 12, 45]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[12, 8, -2]}
        intensity={2.1}
        color="#ffddaf"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <Suspense fallback={null}>
        <Environment preset="sunset" resolution={1024} />
        <Sky
          distance={450000}
          turbidity={4}
          rayleigh={2.5}
          mieCoefficient={0.009}
          mieDirectionalG={0.7}
          sunPosition={[20, 4, -10]}
          inclination={0.52}
          azimuth={0.2}
        />
        <DesertScene />
      </Suspense>
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <OverlayFader />
    </Canvas>
  );
}
