import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { IslandModel } from "./IslandModel";
import { NarutoModel } from "./NarutoModel";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [10, 10, 10], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <IslandModel scale={0.5} position={[-2, 0, 0]} />
        <NarutoModel
          position={[2, 0, 0]}
          scale={1.5}
          rotation={[0, -Math.PI / 4, 0]}
        />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
