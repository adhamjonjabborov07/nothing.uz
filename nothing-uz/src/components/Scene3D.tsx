import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../theme/ThemeContext';

// Pre-generated deterministic particles to ensure purity during render
const PARTICLE_COUNT = 140;
const PARTICLE_POSITIONS = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
  const radius = 2.2 + (i % 7) * 0.75;
  PARTICLE_POSITIONS[i * 3] = Math.cos(angle) * radius + ((i % 5) - 2) * 0.45;
  PARTICLE_POSITIONS[i * 3 + 1] = Math.sin(angle) * radius + ((i % 3) - 1) * 0.45;
  PARTICLE_POSITIONS[i * 3 + 2] = ((i % 11) - 5) * 0.75;
}

function QuantumNothingCore() {
  const outerSphereRef = useRef<THREE.Mesh>(null);
  const innerZeroRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ledBeaconRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { pointer } = useThree();
  const { theme } = useTheme();

  // Interactive spin boost on click/interaction
  const spinBoost = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  // Theme-reactive color palettes
  const sphereColor = theme === 'matrix' ? '#a7f3d0' : theme === 'gold' ? '#fde68a' : '#e0e7ff';
  const emissiveColor = theme === 'matrix' ? '#10b981' : theme === 'gold' ? '#f59e0b' : '#ef4444';
  const secondaryColor = theme === 'matrix' ? '#06b6d4' : theme === 'gold' ? '#a855f7' : '#38bdf8';

  const handleClick = () => {
    spinBoost.current = 3.5; // Impulse spin acceleration
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Gradually decay spin boost back to normal
    spinBoost.current = THREE.MathUtils.lerp(spinBoost.current, 0, delta * 2.5);
    const speedMultiplier = 1 + spinBoost.current + (isHovered ? 0.6 : 0);

    // 1. Mouse pointer parallax tracking for the entire gyroscope
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.45,
        0.06
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.55,
        0.06
      );
    }

    // 2. Outer Chrome-Glass Distorted Sphere
    if (outerSphereRef.current) {
      outerSphereRef.current.rotation.y += delta * 0.25 * speedMultiplier;
      outerSphereRef.current.rotation.z += delta * 0.1 * speedMultiplier;
    }

    // 3. Inner Glowing Nothing "0" (Glyph Core) rotates opposite way
    if (innerZeroRef.current) {
      innerZeroRef.current.rotation.y -= delta * 0.4 * speedMultiplier;
      innerZeroRef.current.rotation.x = Math.sin(time * 1.5) * 0.2;
    }

    // 4. Equatorial Gyro Ring (horizontal orbit)
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.18 * speedMultiplier;
      ring1Ref.current.rotation.x = Math.sin(time * 0.5) * 0.15;
    }

    // 5. Polar Gyro Ring (tilted vertical orbit)
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * 0.22 * speedMultiplier;
      ring2Ref.current.rotation.y += delta * 0.15 * speedMultiplier;
    }

    // 6. Nothing LED Beacon revolving along the outer orbit
    if (ledBeaconRef.current) {
      const orbitSpeed = time * 1.8 * speedMultiplier;
      const orbitRadius = 2.75;
      ledBeaconRef.current.position.x = Math.cos(orbitSpeed) * orbitRadius;
      ledBeaconRef.current.position.z = Math.sin(orbitSpeed) * orbitRadius;
      ledBeaconRef.current.position.y = Math.sin(orbitSpeed * 2) * 0.35;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1.0}>
      <group
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        {/* A. Outer Morphing Chrome-Glass Sphere */}
        <mesh ref={outerSphereRef} scale={1.85}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color={sphereColor}
            metalness={0.88}
            roughness={0.12}
            distort={0.32}
            speed={2.4}
            envMapIntensity={2.5}
            transparent
            opacity={0.82}
          />
        </mesh>

        {/* B. Inner Glowing Nothing "0" Glyph Core */}
        <mesh ref={innerZeroRef} scale={[0.85, 1.25, 0.4]}>
          <torusGeometry args={[0.9, 0.16, 24, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={emissiveColor}
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* C. Primary Equatorial Gyroscope Ring */}
        <mesh ref={ring1Ref} scale={2.75}>
          <torusGeometry args={[1, 0.022, 16, 120]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={secondaryColor}
            emissiveIntensity={0.8}
            wireframe
            transparent
            opacity={0.75}
          />
        </mesh>

        {/* D. Secondary Tilted Polar Gyroscope Ring */}
        <mesh ref={ring2Ref} scale={3.0} rotation={[Math.PI / 3, 0, Math.PI / 6]}>
          <torusGeometry args={[1, 0.016, 16, 100]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={emissiveColor}
            emissiveIntensity={0.65}
            wireframe
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* E. Revolving Nothing Iconic LED Status Beacon */}
        <mesh ref={ledBeaconRef} scale={0.11}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={emissiveColor}
            emissive={emissiveColor}
            emissiveIntensity={2.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingTechGlyph({
  position,
  rotation,
  scale,
  shape,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  shape: 'octahedron' | 'tetrahedron' | 'torus' | 'icosahedron';
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();

  const glowColor = theme === 'matrix' ? '#10b981' : theme === 'gold' ? '#f59e0b' : '#38bdf8';

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1, 0]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.28, 16, 32]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 0]} />;
    }
  }, [shape]);

  return (
    <Float speed={1.6} rotationIntensity={1.5} floatIntensity={1.3}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        {geometry}
        <meshStandardMaterial
          color="#ffffff"
          emissive={glowColor}
          emissiveIntensity={0.35}
          metalness={0.92}
          roughness={0.12}
          transparent
          opacity={0.7}
          wireframe={shape === 'icosahedron'}
        />
      </mesh>
    </Float>
  );
}

function ConstellationParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const { theme } = useTheme();

  const particleColor = theme === 'matrix' ? '#6ee7b7' : theme === 'gold' ? '#fde047' : '#93c5fd';

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.025;
      pointsRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[PARTICLE_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.048}
        color={particleColor}
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

export default function Scene3D() {
  const { theme } = useTheme();

  const lightColor1 = theme === 'matrix' ? '#10b981' : theme === 'gold' ? '#f59e0b' : '#ef4444';
  const lightColor2 = theme === 'matrix' ? '#06b6d4' : theme === 'gold' ? '#a855f7' : '#38bdf8';

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 6, 5]} intensity={1.3} />
        <pointLight position={[-4, -4, 4]} intensity={1.1} color={lightColor1} />
        <pointLight position={[4, 4, -4]} intensity={0.9} color={lightColor2} />
        <spotLight position={[0, 10, 2]} intensity={1.2} angle={0.45} penumbra={1} />

        {/* Upgraded Quantum Nothing Core with Glass Shell, Inner "0", Gyro Rings & LED Beacon */}
        <QuantumNothingCore />

        {/* Orbiting Tech Artifacts */}
        <FloatingTechGlyph position={[-3.6, 2.2, -2]} rotation={[0.5, 0.3, 0]} scale={0.28} shape="octahedron" />
        <FloatingTechGlyph position={[3.8, -1.8, -2.5]} rotation={[0.2, 0.7, 0]} scale={0.24} shape="tetrahedron" />
        <FloatingTechGlyph position={[-2.4, -2.2, -1]} rotation={[0.8, 0.1, 0.4]} scale={0.18} shape="torus" />
        <FloatingTechGlyph position={[3.2, 2.4, -2]} rotation={[0.3, 0.5, 0.2]} scale={0.22} shape="icosahedron" />

        {/* Constellation Particle Dust */}
        <ConstellationParticles />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
