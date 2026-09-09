import React, { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import type { PlanetData, ScaleMode, TimeEngineState } from "../../types/solar";
import { SUN_DATA, PLANETS_DATA } from "../../data/planetsData";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { OrbitLine } from "./OrbitLine";
import { AsteroidBelt } from "./AsteroidBelt";
import { StarField } from "./StarField";
import { CameraController } from "./CameraController";

interface SolarSystemCanvasProps {
  selectedPlanet: PlanetData | null;
  onSelectPlanet: (planet: PlanetData) => void;
  scaleMode: ScaleMode;
  timeEngine: TimeEngineState;
  showOrbits: boolean;
}

export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  selectedPlanet,
  onSelectPlanet,
  scaleMode,
  timeEngine,
  showOrbits,
}) => {
  // Real-time tracker for planet 3D coordinates
  const [planetPositions, setPlanetPositions] = useState<
    Record<string, [number, number, number]>
  >({});

  const handlePosUpdate = useCallback(
    (id: string, pos: [number, number, number]) => {
      setPlanetPositions((prev) => ({ ...prev, [id]: pos }));
    },
    [],
  );

  return (
    <div className="w-full h-full relative bg-slate-950">
      <Canvas
        camera={{ position: [0, 80, 110], fov: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false }}
        onPointerDown={(e) => {
          // Unselect planet if clicking empty space
          if (e.target === e.currentTarget) {
            // Background click
          }
        }}
      >
        <color attach="background" args={["#020617"]} />

        {/* Deep Space Background Stars */}
        <StarField />

        {/* Sun at Center */}
        <Sun
          data={SUN_DATA}
          onSelect={onSelectPlanet}
          isSelected={selectedPlanet?.id === "sun"}
        />

        {/* Orbit Path Lines */}
        {PLANETS_DATA.map((planet) => {
          const radius =
            scaleMode === "exploratory"
              ? planet.orbitRadius
              : planet.distanceFromSunAU * 25;
          return (
            <OrbitLine
              key={`orbit-${planet.id}`}
              radius={radius}
              color={planet.color}
              visible={showOrbits}
            />
          );
        })}

        {/* Asteroid Belt */}
        <AsteroidBelt />

        {/* All Planets */}
        {PLANETS_DATA.map((planet) => (
          <Planet
            key={planet.id}
            data={planet}
            scaleMode={scaleMode}
            timeEngine={timeEngine}
            onSelect={onSelectPlanet}
            isSelected={selectedPlanet?.id === planet.id}
            onPositionUpdate={handlePosUpdate}
          />
        ))}

        {/* Smooth Camera Glide Controller */}
        <CameraController
          selectedPlanet={selectedPlanet}
          planetPositions={planetPositions}
        />
      </Canvas>
    </div>
  );
};
