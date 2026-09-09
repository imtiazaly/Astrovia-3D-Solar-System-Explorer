import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import type { PlanetData } from "../../types/solar";

interface SunProps {
  data: PlanetData;
  onSelect: (planet: PlanetData) => void;
  isSelected: boolean;
}

export const Sun: React.FC<SunProps> = ({ data, onSelect, isSelected }) => {
  const meshRef = useRef<Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05; // Slow sun axial rotation
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sun Light Source */}
      <pointLight color="#ffaa00" intensity={3.5} distance={300} decay={0.2} />
      <ambientLight intensity={0.25} />

      {/* Sun Mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(data);
        }}
      >
        <sphereGeometry args={[data.size, 64, 64]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>

      {/* Outer Corona Sun Glow Mesh */}
      <mesh scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={isSelected ? 0.45 : 0.25}
        />
      </mesh>
    </group>
  );
};
