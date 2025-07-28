import React from "react";
import { useGLTF } from "@react-three/drei";

export function IslandModel(props) {
  const { scene } = useGLTF("/city_park_at_sunset.glb"); // Load from public folder
  return <primitive object={scene} {...props} />;
}

useGLTF.preload("/city_park_at_sunset.glb");
