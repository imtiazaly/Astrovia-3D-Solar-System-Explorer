import React from "react";

interface SaturnRingsProps {
  innerRadius: number;
  outerRadius: number;
  color?: string;
}

export const SaturnRings: React.FC<SaturnRingsProps> = ({
  innerRadius,
  outerRadius,
  color = "#d6be85",
}) => {
  return (
    <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.8}
        side={2} // DoubleSide
        roughness={0.5}
      />
    </mesh>
  );
};
