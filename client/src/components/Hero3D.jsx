import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

const TechCore = () => {
  const meshRef = useRef();
  const outerRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.y = t * 0.3;
    }
    if (outerRef.current) {
      outerRef.current.rotation.z = -t * 0.1;
      outerRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group>
      {/* Central Core */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#a78bfa"
            emissive="#7c3aed"
            emissiveIntensity={2}
            distort={0.4}
            speed={2}
            metalness={1}
            roughness={0}
          />
        </mesh>
      </Float>

      {/* Wireframe Outer Shell */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.3}
          emissive="#06b6d4"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Rotating Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1} />
      </mesh>
    </group>
  );
};

const Particles = ({ count = 100 }) => {
  const points = useMemo(() => {
    const p = new Array(count).fill(0).map(() => (Math.random() - 0.5) * 10);
    return new THREE.Float32BufferAttribute(p, 3);
  }, [count]);

  const pointsRef = useRef();
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" {...points} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.4} />
    </points>
  );
};

const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#7c3aed" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        
        <TechCore />
        <Particles count={200} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <fog attach="fog" args={['#0f0f0f', 5, 20]} />
      </Canvas>
    </div>
  );
};

export default Hero3D;
