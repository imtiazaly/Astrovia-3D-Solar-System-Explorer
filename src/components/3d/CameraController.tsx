import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import { Vector3 } from "three";
import type { PlanetData } from "../../types/solar";

interface CameraControllerProps {
  selectedPlanet: PlanetData | null;
  planetPositions: Record<string, [number, number, number]>;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  selectedPlanet,
  planetPositions,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null!);

  useEffect(() => {
    if (!controlsRef.current) return;

    if (selectedPlanet) {
      const pos = planetPositions[selectedPlanet.id] || [0, 0, 0];
      const targetVec = new Vector3(...pos);

      // Distance offset based on planet size
      const offsetDistance =
        selectedPlanet.id === "sun" ? 25 : selectedPlanet.size * 5 + 6;
      const cameraTargetPos = new Vector3(
        pos[0] + offsetDistance,
        pos[1] + offsetDistance * 0.4,
        pos[2] + offsetDistance,
      );

      // Smooth camera glide with GSAP
      gsap.to(camera.position, {
        x: cameraTargetPos.x,
        y: cameraTargetPos.y,
        z: cameraTargetPos.z,
        duration: 1.8,
        ease: "power2.inOut",
      });

      gsap.to(controlsRef.current.target, {
        x: targetVec.x,
        y: targetVec.y,
        z: targetVec.z,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current.update(),
      });
    } else {
      // Reset view to overview
      gsap.to(camera.position, {
        x: 0,
        y: 80,
        z: 110,
        duration: 2.0,
        ease: "power2.inOut",
      });

      gsap.to(controlsRef.current.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2.0,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current.update(),
      });
    }
  }, [selectedPlanet, camera]);

  // Continuous camera target tracking as target orbits
  useFrame(() => {
    if (selectedPlanet && controlsRef.current && selectedPlanet.id !== "sun") {
      const pos = planetPositions[selectedPlanet.id];
      if (pos) {
        controlsRef.current.target.set(pos[0], pos[1], pos[2]);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={4}
      maxDistance={400}
      dampingFactor={0.05}
    />
  );
};
