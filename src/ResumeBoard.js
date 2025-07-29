import React from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export function ResumeBoard(props) {
  const sections = ["Projects", "Experience", "Skills", "Education", "Contact"];

  return (
    <group {...props}>
      {/* Main board */}
      <mesh position={[0, 2, 0]} receiveShadow>
        <boxGeometry args={[4, 3, 0.2]} />
        <meshStandardMaterial color="#2a3b4c" />
      </mesh>

      {/* Header */}
      <Text
        position={[0, 3.2, 0.15]}
        fontSize={0.3}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZJhjp-Ek-_0ew.woff"
      >
        Portfolio
      </Text>

      {/* Section titles */}
      {sections.map((section, index) => (
        <group key={section} position={[0, 2.7 - index * 0.4, 0.15]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZJhjp-Ek-_0ew.woff"
          >
            {section}
          </Text>
          {/* Decorative line */}
          <mesh position={[0, -0.15, 0]} rotation={[0, 0, 0]}>
            <planeGeometry args={[2, 0.01]} />
            <meshBasicMaterial color="#4a5b6c" />
          </mesh>
        </group>
      ))}

      {/* Support stand */}
      <mesh position={[0, 0.5, -0.5]} rotation={[Math.PI / 8, 0, 0]}>
        <boxGeometry args={[0.2, 3, 0.1]} />
        <meshStandardMaterial color="#2a3b4c" />
      </mesh>
    </group>
  );
}
