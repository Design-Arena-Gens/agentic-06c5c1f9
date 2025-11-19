"use client";

import { useMemo, useRef } from "react";
import { BufferAttribute, Group, Points, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

const lookTarget = new Vector3(0, 1.25, 0);

export default function DesertScene() {
  return (
    <group>
      <CameraRig />
      <SunGlow />
      <DesertGround />
      <DuneCluster />
      <PrayerFigure />
      <FloatingParticles />
      <DustSheen />
    </group>
  );
}

function CameraRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime() * 0.12;
    const radius = 7.4;
    const height = 3 + Math.sin(clock.getElapsedTime() * 0.48) * 0.25;
    camera.position.set(
      Math.cos(t) * radius,
      height,
      Math.sin(t) * radius * 0.92
    );
    camera.lookAt(lookTarget);
  });
  return null;
}

function DesertGround() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80, 128, 128]} />
        <meshStandardMaterial
          color="#d6b58c"
          roughness={0.85}
          metalness={0.05}
          displacementScale={0.35}
          envMapIntensity={0.2}
        />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial
          color="#dcbf9a"
          roughness={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

function DuneCluster() {
  const dunes = useMemo(
    () => [
      { position: [-6.1, 1.2, -4.2], scale: [6.8, 2.4, 6.8], rotation: 0.4 },
      { position: [4.9, 0.6, -5.8], scale: [5.4, 1.8, 5.4], rotation: -0.3 },
      { position: [-3.2, 0.3, 5.4], scale: [4.2, 1.4, 4.8], rotation: 0.62 },
      { position: [6.5, 0.9, 3.8], scale: [6.2, 2.1, 5.6], rotation: -0.52 }
    ],
    []
  );

  return (
    <group>
      {dunes.map((dune, index) => (
        <mesh
          key={`dune-${index}`}
          position={dune.position as [number, number, number]}
          rotation={[0, dune.rotation, 0]}
          scale={dune.scale as [number, number, number]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color="#c79f70" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function PrayerFigure() {
  const figureRef = useRef<Group>(null);
  const clothRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const sine = Math.sin(clock.elapsedTime * 0.8) * 0.02;
    const subtle = Math.sin(clock.elapsedTime * 0.4) * 0.01;
    if (figureRef.current) {
      figureRef.current.position.y = 1.2 + sine;
    }
    if (clothRef.current) {
      clothRef.current.rotation.z = 0.06 + subtle * 2.5;
      clothRef.current.position.x = subtle * 10;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.015}>
        <group ref={figureRef} position={[0, 1.25, 0]} castShadow>
          <Head />
          <Body clothRef={clothRef} />
          <Hands />
        </group>
      </Float>
      <PrayerMat />
    </group>
  );
}

function Head() {
  return (
    <mesh position={[0, 0.95, 0]} castShadow>
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshStandardMaterial
        color="#f0d9c0"
        roughness={0.45}
        emissive="#2e1f12"
        emissiveIntensity={0.02}
      />
    </mesh>
  );
}

function Body({ clothRef }: { clothRef: React.RefObject<Group> }) {
  return (
    <group>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.46, 1.05, 32]} />
        <meshStandardMaterial
          color="#fbf8f1"
          roughness={0.36}
          metalness={0.02}
          emissive="#f0f5ff"
          emissiveIntensity={0.08}
        />
      </mesh>
      <group ref={clothRef} position={[0, 0.3, 0.35]}>
        <mesh scale={[0.3, 0.48, 0.05]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#fefefe"
            roughness={0.3}
            emissive="#fbeac6"
            emissiveIntensity={0.06}
          />
        </mesh>
      </group>
    </group>
  );
}

function Hands() {
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);

  useFrame(({ clock }) => {
    const lift = Math.sin(clock.elapsedTime * 1.2) * 0.015;
    [left.current, right.current].forEach((group, index) => {
      if (group) {
        group.rotation.x = -1.2 + lift;
        group.rotation.z = index === 0 ? 0.22 : -0.22;
      }
    });
  });

  return (
    <group>
      <group ref={left} position={[-0.36, 0.62, 0.24]}>
        <Arm />
      </group>
      <group ref={right} position={[0.36, 0.62, 0.24]}>
        <Arm />
      </group>
    </group>
  );
}

function Arm() {
  return (
    <group castShadow>
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.09, 0.1, 0.45, 20]} />
        <meshStandardMaterial
          color="#fbfbfb"
          roughness={0.4}
          emissive="#fff5dc"
          emissiveIntensity={0.04}
        />
      </mesh>
      <mesh position={[0, -0.52, 0.08]}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial color="#f4dbc2" roughness={0.5} />
      </mesh>
    </group>
  );
}

function PrayerMat() {
  return (
    <group position={[0, 0.01, 0]}>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[1.35, 2.1]} />
        <meshStandardMaterial
          color="#223646"
          roughness={0.6}
          metalness={0.1}
          emissive="#1f2933"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[1.4, 0.008, 2.15]} />
        <meshStandardMaterial
          color="#406178"
          roughness={0.5}
          metalness={0.12}
        />
      </mesh>
      <mesh position={[0, 0.014, 0]}>
        <planeGeometry args={[1.15, 1.8]} />
        <meshStandardMaterial
          color="#2f4e63"
          roughness={0.55}
          metalness={0.05}
          polygonOffset
          polygonOffsetFactor={-0.5}
        />
      </mesh>
    </group>
  );
}

function FloatingParticles() {
  const count = 240;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      arr[idx] = (Math.random() - 0.5) * 20;
      arr[idx + 1] = Math.random() * 5 + 0.5;
      arr[idx + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  const speeds = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = 0.08 + Math.random() * 0.12;
    }
    return arr;
  }, [count]);

  const basePositions = useMemo(() => positions.slice(0), [positions]);

  const pointsRef = useRef<Points>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!pointsRef.current) return;
    const positionsAttribute = pointsRef.current.geometry.getAttribute(
      "position"
    ) as BufferAttribute;
    for (let i = 0; i < count; i++) {
      const yIndex = i * 3 + 1;
      const initialY = basePositions[yIndex];
      const wave = Math.sin(t * speeds[i] + i) * 0.15;
      const newY = initialY + wave;
      positionsAttribute.array[yIndex] = newY;
    }
    positionsAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        transparent
        opacity={0.75}
        color="#ffe9c9"
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function DustSheen() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.5, 0]}>
      <circleGeometry args={[20, 64]} />
      <meshBasicMaterial
        color="#f7b97c"
        transparent
        opacity={0.07}
        depthWrite={false}
      />
    </mesh>
  );
}

function SunGlow() {
  return (
    <group position={[9, 4, -7]}>
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color="#ffe7b2" transparent opacity={0.12} />
      </mesh>
      <mesh scale={[3, 3, 3]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ffcc7a" transparent opacity={0.045} />
      </mesh>
    </group>
  );
}
