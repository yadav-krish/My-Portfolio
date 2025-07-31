import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function NarutoModel(props) {
  const group = useRef();
  const modelRef = useRef();

  const { scene, nodes, materials, animations } = useGLTF("/naruto_rage.glb");
  const { actions, mixer } = useAnimations(animations, group);

  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const [movement, setMovement] = useState({ x: 0, z: 0 });
  const speed = 0.08;
  const acceleration = 0.04;
  const deceleration = 0.08;
  const rotationSpeed = 0.05;
  const velocity = useRef({ x: 0, z: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          setMovement((prev) => ({ ...prev, z: -1 }));
          break;
        case "ArrowDown":
        case "s":
          setMovement((prev) => ({ ...prev, z: 1 }));
          break;
        case "ArrowLeft":
        case "a":
          setMovement((prev) => ({ ...prev, x: -1 }));
          break;
        case "ArrowRight":
        case "d":
          setMovement((prev) => ({ ...prev, x: 1 }));
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "ArrowDown":
        case "s":
          setMovement((prev) => ({ ...prev, z: 0 }));
          break;
        case "ArrowLeft":
        case "a":
        case "ArrowRight":
        case "d":
          setMovement((prev) => ({ ...prev, x: 0 }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (animations.length) {
      actions["idle"]?.play();
      Object.values(actions).forEach((action) => {
        action.clampWhenFinished = true;
        action.setLoop(THREE.LoopRepeat);
      });
    }
  }, [actions, animations]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      const frameSpeed = speed * delta * 60;

      velocity.current.x = THREE.MathUtils.lerp(
        velocity.current.x,
        movement.x * frameSpeed,
        movement.x ? acceleration : deceleration
      );
      velocity.current.z = THREE.MathUtils.lerp(
        velocity.current.z,
        movement.z * frameSpeed,
        movement.z ? acceleration : deceleration
      );

      modelRef.current.position.x += velocity.current.x;
      modelRef.current.position.z += velocity.current.z;

      if (
        Math.abs(velocity.current.x) > 0.001 ||
        Math.abs(velocity.current.z) > 0.001
      ) {
        const targetRotation = Math.atan2(
          velocity.current.x,
          velocity.current.z
        );

        const currentRotation = modelRef.current.rotation.y;
        let newRotation = currentRotation;

        const rotationDiff = targetRotation - currentRotation;
        if (Math.abs(rotationDiff) > Math.PI) {
          if (rotationDiff > 0) {
            newRotation = currentRotation + (rotationDiff - 2 * Math.PI);
          } else {
            newRotation = currentRotation + (rotationDiff + 2 * Math.PI);
          }
        } else {
          newRotation = currentRotation + rotationDiff;
        }

        modelRef.current.rotation.y = THREE.MathUtils.lerp(
          currentRotation,
          newRotation,
          rotationSpeed
        );

        if (currentAnimation !== "run") {
          actions[currentAnimation]?.fadeOut(0.2);
          actions["run"]?.reset().fadeIn(0.2).play();
          setCurrentAnimation("run");
        }
      } else if (currentAnimation !== "idle") {
        actions[currentAnimation]?.fadeOut(0.2);
        actions["idle"]?.reset().fadeIn(0.2).play();
        setCurrentAnimation("idle");
      }

      mixer?.update(delta);
    }
  });

  return (
    <group ref={modelRef} {...props} dispose={null}>
      <group ref={group}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload("/naruto_rage.glb");
