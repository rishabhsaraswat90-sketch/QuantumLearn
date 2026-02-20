import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const QuantumSphere = ({ theta = 0, phi = 0 }) => {
  const sphereRef = useRef();

  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.cos(theta); 
  const z = Math.sin(theta) * Math.sin(phi);

  const vectorEnd = new THREE.Vector3(x * 2, y * 2, z * 2);

  useFrame(() => {
    if (sphereRef.current) sphereRef.current.rotation.y += 0.003; // Smooth idle rotation
  });

  return (
    <group ref={sphereRef}>
      {/* Outer Glass Sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshPhysicalMaterial 
            color="#0f172a" 
            transparent 
            opacity={0.15} 
            wireframe 
            roughness={0.1} 
            metalness={0.9}
            clearcoat={1}
        />
      </Sphere>

      {/* Glowing Axes */}
      <Line points={[[-2.5, 0, 0], [2.5, 0, 0]]} color="#334155" lineWidth={1} />
      <Line points={[[0, -2.5, 0], [0, 2.5, 0]]} color="#334155" lineWidth={1} />
      <Line points={[[0, 0, -2.5], [0, 0, 2.5]]} color="#334155" lineWidth={1} />

      {/* Floating Labels */}
      <Text position={[2.8, 0, 0]} fontSize={0.25} color="#94a3b8">X</Text>
      <Text position={[0, 2.8, 0]} fontSize={0.25} color="#00d2d3">|0⟩</Text>
      <Text position={[0, -2.8, 0]} fontSize={0.25} color="#00d2d3">|1⟩</Text>
      <Text position={[0, 0, 2.8]} fontSize={0.25} color="#94a3b8">Z</Text>

      {/* The Glowing State Vector Arrow */}
      <Line points={[[0, 0, 0], vectorEnd]} color="#ff4757" lineWidth={5} />
      
      {/* Arrowhead (Emissive so it glows) */}
      <Sphere position={vectorEnd} args={[0.08, 32, 32]}>
        <meshStandardMaterial 
            color="#ff4757" 
            emissive="#ff4757" 
            emissiveIntensity={2} 
            toneMapped={false} 
        />
      </Sphere>
      
      {/* Quantum Core */}
      <Sphere args={[0.05, 32, 32]}>
        <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={3} 
            toneMapped={false} 
        />
      </Sphere>
    </group>
  );
};

const BlochSphere = ({ theta = 0, phi = 0 }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '350px', background: 'transparent' }}>
      <Canvas camera={{ position: [3.5, 2.5, 4.5], fov: 45 }} gl={{ antialias: true }}>
        <color attach="background" args={['transparent']} />
        
        {/* Dark moody lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d2d3" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff4757" />
        
        <QuantumSphere theta={theta} phi={phi} />
        
        {/* Post-Processing: This creates the Cyberpunk/Neon Glow */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={1.5} 
          />
        </EffectComposer>

        {/* Let the user drag to rotate the sphere */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
};

export default BlochSphere;