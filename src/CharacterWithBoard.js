import React, { useRef } from "react";
import { useGLTF, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CharacterWithBoard({
  characterPath,
  position,
  rotation,
  boardContent,
  scale = 1,
}) {
  const { scene } = useGLTF(characterPath);
  const characterRef = useRef();

  // Subtle idle animation
  useFrame((state) => {
    if (characterRef.current) {
      characterRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + rotation[1];
    }
  });

  return (
    <group position={position}>
      {/* Character */}
      <group ref={characterRef} scale={scale}>
        <primitive object={scene} />
      </group>

      {/* Board */}
      <group position={[0, 2, 0]} rotation={[0, rotation[1], 0]}>
        {/* Board background */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2, 1.5, 0.1]} />
          <meshStandardMaterial color="#2a3b4c" />
        </mesh>

        {/* Board content */}
        <Text
          position={[0, 0.5, 0.1]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZJhjp-Ek-_0ew.woff"
        >
          {boardContent}
        </Text>

        {/* Decorative line */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.5, 0.02]} />
          <meshBasicMaterial color="#4a5b6c" />
        </mesh>
      </group>
    </group>
  );
}
