import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points as ThreePoints } from "three";

export const StarField: React.FC = () => {
  const pointsRef = useRef<ThreePoints>(null!);
  const count = 2500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Sphere distribution around origin
      const radius = 200 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Star colors: White, Cyan, Yellow tint
      const tint = Math.random();
      col[i * 3] = tint > 0.8 ? 1.0 : 0.8;
      col[i * 3 + 1] = tint > 0.6 ? 0.9 : 0.8;
      col[i * 3 + 2] = 1.0;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.005; // Slow universe drift
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
};
