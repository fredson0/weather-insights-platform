import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ShaderMaterial, IcosahedronGeometry, Mesh, Vector3 } from 'three';
import { cloudVertexShader, cloudFragmentShader } from './cloudShader';

function CloudsScene() {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const { size } = useThree();

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value = new Vector3(size.width, size.height, 1);
    }
  }, [size]);

  useFrame(({ clock }) => {
    if (materialRef.current && meshRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uMouse.value.x += (Math.random() - 0.5) * 0.02;
      materialRef.current.uniforms.uMouse.value.y += (Math.random() - 0.5) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} scale={[2, 2, 2]}>
      <icosahedronGeometry args={[1, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={cloudVertexShader}
        fragmentShader={cloudFragmentShader}
        uniforms={{
          uTime: { value: 0.0 },
          uMouse: { value: new Vector3(0.5, 0.5, 0) },
          uResolution: { value: new Vector3(size.width, size.height, 1) },
        }}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

interface VolumetricCloudsProps {
  className?: string;
}

export function VolumetricClouds({ className = '' }: VolumetricCloudsProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 1.5] }}
        style={{ width: '100%', height: '100%' }}
      >
        <CloudsScene />
      </Canvas>
    </div>
  );
}
