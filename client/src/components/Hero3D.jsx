import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const SubtleAura = () => {
  const meshRef = useRef();

  useFrame((state) => {
    // useFrame provides the clock and state already
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.1;
      meshRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group position={[3.5, 0, 0]}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.5, 10]} />
          <MeshDistortMaterial
            color="#a78bfa"
            emissive="#7c3aed"
            emissiveIntensity={0.5}
            distort={0.4}
            speed={1.5}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
      
      {/* Subtle outer glow ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.5, 0.005, 16, 100]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.3} emissive="#06b6d4" emissiveIntensity={1} />
      </mesh>
    </group>
  );
};

const Particles = ({ count = 150 }) => {
  const pointsRef = useRef();
  
  // Fixing NaN: ensuring initial position values are strictly valid
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;     // X
      p[i * 3 + 1] = (Math.random() - 0.5) * 20; // Y
      p[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z
    }
    return p;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.2} sizeAttenuation />
    </points>
  );
};

const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-60">
      <Canvas dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#7c3aed" />
        <pointLight position={[-10, -5, 5]} intensity={0.5} color="#06b6d4" />
        
        <SubtleAura />
        <Particles count={200} />
        
        <fog attach="fog" args={['#0f0f0f', 5, 25]} />
      </Canvas>
    </div>
  );
};

export default Hero3D;
