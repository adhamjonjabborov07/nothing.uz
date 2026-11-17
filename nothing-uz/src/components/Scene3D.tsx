import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ChromeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        pointer.y * 0.3,
        0.05
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -pointer.x * 0.2,
        0.05
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.8}>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshDistortMaterial
          color="#d4d4d8"
          metalness={1}
          roughness={0.03}
          distort={0.2}
          speed={2.5}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
}

function FloatingGeometry({ position, rotation, scale, shape }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  shape: 'octahedron' | 'tetrahedron' | 'torus';
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'octahedron': return <octahedronGeometry args={[1, 0]} />;
      case 'tetrahedron': return <tetrahedronGeometry args={[1, 0]} />;
      case 'torus': return <torusGeometry args={[1, 0.3, 16, 32]} />;
    }
  }, [shape]);

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        {geometry}
        <meshStandardMaterial
          color="#ffffff"
          metalness={1}
          roughness={0.05}
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 100;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#6366f1" />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.3} penumbra={1} />

        <ChromeSphere />

        <FloatingGeometry position={[-3.5, 2, -2]} rotation={[0.5, 0.3, 0]} scale={0.25} shape="octahedron" />
        <FloatingGeometry position={[4, -1.5, -3]} rotation={[0.2, 0.7, 0]} scale={0.2} shape="tetrahedron" />
        <FloatingGeometry position={[-2, -2.5, -1]} rotation={[0.8, 0.1, 0.4]} scale={0.15} shape="torus" />
        <FloatingGeometry position={[3, 2.5, -2]} rotation={[0.3, 0.5, 0.2]} scale={0.18} shape="octahedron" />

        <Particles />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
