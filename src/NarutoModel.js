import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

export function NarutoModel(props) {
  const model = useGLTF("/naruto_rage.glb");

  useEffect(() => {
    // Log the model structure to help debug
    console.log("Model structure:", model);
  }, [model]);

  return (
    <group {...props} dispose={null}>
      <primitive object={model.scene} />
    </group>
  );
}

useGLTF.preload("/naruto_rage.glb");
