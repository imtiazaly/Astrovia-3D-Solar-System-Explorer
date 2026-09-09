import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Group, Mesh } from "three";
import type { PlanetData, ScaleMode, TimeEngineState } from "../../types/solar";
import { SaturnRings } from "./SaturnRings";

interface PlanetProps {
  data: PlanetData;
  scaleMode: ScaleMode;
  timeEngine: TimeEngineState;
  onSelect: (planet: PlanetData) => void;
  isSelected: boolean;
  onPositionUpdate?: (planetId: string, pos: [number, number, number]) => void;
}

export const Planet: React.FC<PlanetProps> = ({
  data,
  scaleMode,
  timeEngine,
  onSelect,
  isSelected,
  onPositionUpdate,
}) => {
  const groupRef = useRef<Group>(null!);
  const meshRef = useRef<Mesh>(null!);
  const moonRef = useRef<Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // Angle tracking for orbital revolution
  const angleRef = useRef(Math.random() * Math.PI * 2);

  // Compute radius based on scale mode
  const radius =
    scaleMode === "exploratory"
      ? data.orbitRadius
      : data.distanceFromSunAU * 25;
  const planetSize =
    scaleMode === "exploratory"
      ? data.size
      : Math.max(0.4, Math.log10(data.realRadiusKm) * 0.4);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // 1. Orbital Revolution Physics
    if (timeEngine.isPlaying && data.orbitalPeriodDays > 0) {
      const speedMultiplier =
        (365 / data.orbitalPeriodDays) * 0.05 * timeEngine.speed;
      const direction = timeEngine.isReversed ? -1 : 1;
      angleRef.current += speedMultiplier * delta * direction;
    }

    const x = Math.cos(angleRef.current) * radius;
    const z = Math.sin(angleRef.current) * radius;
    groupRef.current.position.set(x, 0, z);

    // Notify parent of current 3D position for camera glide
    if (onPositionUpdate) {
      onPositionUpdate(data.id, [x, 0, z]);
    }

    // 2. Axial Rotation
    if (meshRef.current) {
      const rotationSpeed =
        (24 / Math.abs(data.rotationPeriodHours)) * 0.5 * delta;
      meshRef.current.rotation.y +=
        data.rotationPeriodHours < 0 ? -rotationSpeed : rotationSpeed;
    }

    // 3. Sub-orbit for Earth's Moon
    if (moonRef.current && data.id === "earth") {
      const moonAngle = angleRef.current * 12; // Moon completes 12 revolutions a year
      moonRef.current.position.set(
        Math.cos(moonAngle) * 3,
        0,
        Math.sin(moonAngle) * 3,
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Interactive Planet Mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(data);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[planetSize, 32, 32]} />
        <meshStandardMaterial
          color={data.color}
          roughness={0.7}
          metalness={0.1}
          emissive={hovered || isSelected ? data.color : "#000000"}
          emissiveIntensity={hovered || isSelected ? 0.35 : 0.0}
        />
      </mesh>

      {/* Saturn & Uranus Rings */}
      {data.hasRings && data.ringInnerRadius && data.ringOuterRadius && (
        <SaturnRings
          innerRadius={data.ringInnerRadius}
          outerRadius={data.ringOuterRadius}
          color={data.ringColor}
        />
      )}

      {/* Earth Moon Sub-Orbit */}
      {data.id === "earth" && (
        <mesh ref={moonRef}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#cccccc" roughness={0.9} />
        </mesh>
      )}

      {/* 3D Sci-Fi HTML Label Tag on Hover/Select */}
      {(hovered || isSelected) && (
        <Html position={[0, planetSize + 1.2, 0]} center distanceFactor={60}>
          <div className="px-3 py-1 bg-slate-950/80 text-cyan-300 backdrop-blur-md rounded-full border border-cyan-500/40 text-xs font-semibold tracking-wider whitespace-nowrap shadow-lg shadow-cyan-500/20 pointer-events-none transition-all duration-200">
            {data.name}
          </div>
        </Html>
      )}
    </group>
  );
};
