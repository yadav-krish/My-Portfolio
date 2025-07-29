import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function NarutoModel(props) {
  const group = useRef();
  const modelRef = useRef();

  const { scene, nodes, materials, animations } = useGLTF("/naruto_rage.glb");
  const { actions, mixer } = useAnimations(animations, group);

  // Debug log to check model loading
  console.log("Model loaded:", { scene, nodes, animations });

  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const [movement, setMovement] = useState({ x: 0, z: 0 });
  const speed = 0.08; // Reduced base speed
  const acceleration = 0.04; // Lower acceleration for smoother start
  const deceleration = 0.08; // Adjusted deceleration
  const rotationSpeed = 0.05; // Slower rotation for smoother turning
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

  // Handle animations
  useEffect(() => {
    if (animations.length) {
      // Play idle animation by default
      actions["idle"]?.play();

      // Reset all animations when changing states
      Object.values(actions).forEach((action) => {
        action.clampWhenFinished = true;
        action.setLoop(THREE.LoopRepeat);
      });
    }
  }, [actions, animations]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Calculate movement with delta time for frame-rate independence
      const frameSpeed = speed * delta * 60; // Normalize to 60fps

      // Smooth velocity changes with improved acceleration
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

      // Update position based on velocity
      modelRef.current.position.x += velocity.current.x;
      modelRef.current.position.z += velocity.current.z;

      // Improved rotation logic
      if (
        Math.abs(velocity.current.x) > 0.001 ||
        Math.abs(velocity.current.z) > 0.001
      ) {
        const targetRotation = Math.atan2(
          velocity.current.x,
          velocity.current.z
        );

        // Smooth rotation with proper interpolation
        const currentRotation = modelRef.current.rotation.y;
        let newRotation = currentRotation;

        // Calculate shortest rotation path
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

        // Change to running animation when moving
        if (currentAnimation !== "run") {
          actions[currentAnimation]?.fadeOut(0.2);
          actions["run"]?.reset().fadeIn(0.2).play();
          setCurrentAnimation("run");
        }
      } else if (currentAnimation !== "idle") {
        // Change back to idle animation when stopped
        actions[currentAnimation]?.fadeOut(0.2);
        actions["idle"]?.reset().fadeIn(0.2).play();
        setCurrentAnimation("idle");
      }

      // Update mixer for animations
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
