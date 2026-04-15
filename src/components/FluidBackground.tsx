import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Environment, Float } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function AmorphousBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      // Fluid inertial rotation based on mouse
      meshRef.current.rotation.x += (mousePosition.y * 0.5 - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (mousePosition.x * 0.5 - meshRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.5}>
        <icosahedronGeometry args={[4, 60]} />
        <MeshDistortMaterial
          color="#ffffff"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.1}
          roughness={0.1}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export function FluidBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none opacity-30 mix-blend-multiply">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Environment preset="studio" />
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#e5e5e5" />
        <AmorphousBlob />
      </Canvas>
    </div>
  );
}
