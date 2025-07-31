import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

export function Tanjiro(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/naruto_rage.glb");

  useFrame((state) => {
    // Add subtle idle animation
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 2) * 0.1 + props.rotation[1];
  });

  return (
    <group ref={group} {...props}>
      <primitive object={nodes.Scene} />
    </group>
  );
}

useGLTF.preload("/naruto_rage.glb");
