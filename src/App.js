import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { IslandModel } from "./IslandModel";
import { NarutoModel } from "./NarutoModel";
import { CharacterWithBoard } from "./CharacterWithBoard";
import { LoadingScreen } from "./LoadingScreen";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000000" }}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        shadows
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#211d1d"]} />
        <fog attach="fog" args={["#211d1d", 10, 50]} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <hemisphereLight intensity={0.3} />
          <IslandModel scale={0.5} position={[0, -1, 0]} />
          <NarutoModel
            scale={0.7}
            position={[0, -0.7, 0]}
            rotation={[0, Math.PI, 0]}
          />
          {/* Four characters with boards */}
          <CharacterWithBoard
            characterPath="/itachi_uchiha_sharingan_akatsuki_amaterasu.glb"
            position={[8, 1.45, 9]}
            rotation={[0, -Math.PI / 1.5, 0]}
            boardContent="Projects"
            scale={1.8}
          />
          <CharacterWithBoard
            characterPath="/kakashi.glb"
            position={[-8, -0.7, 9]}
            rotation={[2, Math.PI / 1.2, 0]}
            boardContent="Experience"
            scale={0.32}
          />
          <CharacterWithBoard
            characterPath="/sasuke.glb"
            position={[8, -0.3, -9]}
            rotation={[0, (-Math.PI * 1.1) / 4, 0]}
            boardContent="Skills"
            scale={0.4}
          />
          <CharacterWithBoard
            characterPath="/ameno.glb"
            position={[-6, -0.2, -9]}
            rotation={[0, (Math.PI * 11.5) / 5, 0]}
            boardContent="Education"
            scale={0.55}
          />
        </Suspense>
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.5}
          panSpeed={0.8}
          rotateSpeed={0.8}
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}

export default App;
