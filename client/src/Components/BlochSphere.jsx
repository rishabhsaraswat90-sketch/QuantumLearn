import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

// The actual 3D logic
const QuantumSphere = ({ theta = 0, phi = 0 }) => {
  const sphereRef = useRef();

  // Convert spherical (theta, phi) to Cartesian (x,y,z) for the vector arrow
  // Note: in quantum mechanics, +Z is |0> and -Z is |1>
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.cos(theta); // Z in quantum is Y in 3D space usually, but let's map quantum Z to 3D Y for visual uprightness
  const z = Math.sin(theta) * Math.sin(phi);

  const vectorEnd = new THREE.Vector3(x * 2, y * 2, z * 2);

  // Slow rotation for visual effect
  useFrame(() => {
    if (sphereRef.current) sphereRef.current.rotation.y += 0.002;
  });

  return (
    <group ref={sphereRef}>
      {/* Outer Transparent Sphere */}
      <Sphere args={[2, 32, 32]}>
        <meshPhysicalMaterial 
            color="#00d2d3" 
            transparent 
            opacity={0.1} 
            wireframe 
            roughness={0} 
            metalness={0.8} 
        />
      </Sphere>

      {/* X, Y, Z Axes */}
      <Line points={[[-2.5, 0, 0], [2.5, 0, 0]]} color="rgba(255,255,255,0.3)" lineWidth={1} />
      <Line points={[[0, -2.5, 0], [0, 2.5, 0]]} color="rgba(255,255,255,0.3)" lineWidth={1} />
      <Line points={[[0, 0, -2.5], [0, 0, 2.5]]} color="rgba(255,255,255,0.3)" lineWidth={1} />

      {/* Axis Labels */}
      <Text position={[2.7, 0, 0]} fontSize={0.3} color="white">X</Text>
      <Text position={[0, 2.7, 0]} fontSize={0.3} color="white">|0⟩</Text>
      <Text position={[0, -2.7, 0]} fontSize={0.3} color="white">|1⟩</Text>
      <Text position={[0, 0, 2.7]} fontSize={0.3} color="white">Z</Text>

      {/* The State Vector Arrow */}
      <Line points={[[0, 0, 0], vectorEnd]} color="#ff4757" lineWidth={4} />
      <Sphere position={vectorEnd} args={[0.1, 16, 16]}>
        <meshBasicMaterial color="#ff4757" />
      </Sphere>
      
      {/* Center Core */}
      <Sphere args={[0.05, 16, 16]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
    </group>
  );
};

// The Responsive Container
const BlochSphere = ({ theta = 0, phi = 0 }) => {
  return (
    // This container fills whatever space the parent gives it (crucial for mobile responsiveness)
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <Canvas camera={{ position: [4, 3, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <QuantumSphere theta={theta} phi={phi} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
};

export default BlochSphere;