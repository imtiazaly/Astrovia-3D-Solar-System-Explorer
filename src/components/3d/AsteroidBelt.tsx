import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Object3D } from "three";

export const AsteroidBelt: React.FC = () => {
  const meshRef = useRef<InstancedMesh>(null!);
  const count = 400; // 400 Asteroid particles

  const dummy = useMemo(() => new Object3D(), []);

  // Generate random orbits between radius 41 and 47
  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = 41 + Math.random() * 6;
      const angle = Math.random() * Math.PI * 2;
      const speed =
        (0.05 + Math.random() * 0.1) * (Math.random() < 0.5 ? 1 : -1);
      const size = 0.1 + Math.random() * 0.25;
      const yOffset = (Math.random() - 0.5) * 2.5;

      temp.push({ radius, angle, speed, size, yOffset });
    }
    return temp;
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    asteroids.forEach((asteroid, i) => {
      asteroid.angle += asteroid.speed * delta * 0.5;
      const x = Math.cos(asteroid.angle) * asteroid.radius;
      const z = Math.sin(asteroid.angle) * asteroid.radius;

      dummy.position.set(x, asteroid.yOffset, z);
      dummy.scale.set(asteroid.size, asteroid.size, asteroid.size);
      dummy.rotation.x += 0.01;
      dummy.rotation.y += 0.02;
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#888888" roughness={0.9} />
    </instancedMesh>
  );
};
