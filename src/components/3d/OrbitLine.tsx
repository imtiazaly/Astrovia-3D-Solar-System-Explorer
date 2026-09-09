import React from "react";

interface OrbitLineProps {
  radius: number;
  color?: string;
  visible?: boolean;
}

export const OrbitLine: React.FC<OrbitLineProps> = ({
  radius,
  color = "#3b82f6",
  visible = true,
}) => {
  if (!visible || radius <= 0) return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.15, radius + 0.15, 128]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.2}
        side={2} // DoubleSide
      />
    </mesh>
  );
};
