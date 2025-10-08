import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Shader code (GLSL)
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float iTime;
  uniform vec2 iResolution;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    vec3 color = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0,2,4));
    gl_FragColor = vec4(color, 1.0);
  }
`;

const ShaderMaterial = shaderMaterial(
  { iTime: 0, iResolution: new THREE.Vector2(1, 1) },
  vertexShader,
  fragmentShader
);


function ShaderPlane() {
  const meshRef = useRef(null);
  const materialRef = useRef(null);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.iTime = state.clock.elapsedTime;
    const { width, height } = state.size;
    materialRef.current.iResolution.set(width, height);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        iTime={0}
        iResolution={new THREE.Vector2(1, 1)}
      />
    </mesh>
  );
}

export default function ShaderBackground() {
  const canvasRef = useRef(null);
  const [canvasKey, setCanvasKey] = useState(0);
  const [contextLost, setContextLost] = useState(false);
  const [restoreAttempts, setRestoreAttempts] = useState(0);
  const listenersAttachedRef = useRef(false);
  const camera = useMemo(() => ({ position: [0, 0, 1], fov: 75, near: 0.1, far: 1000 }), []);

  useGSAP(
    () => {
      if (!canvasRef.current) return;
      gsap.set(canvasRef.current, { filter: 'blur(20px)', scale: 1.1, autoAlpha: 0.7 });
      gsap.to(canvasRef.current, {
        filter: 'blur(0px)',
        scale: 1,
        autoAlpha: 1,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.3,
      });
    },
    { scope: canvasRef }
  );

  return (
    <div ref={canvasRef} className="bg-black absolute inset-0 -z-10 w-full h-full" aria-hidden>
      <Canvas
        key={canvasKey}
        camera={camera}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false
        }}
        dpr={1}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          try {
            const canvas = (gl.domElement || gl.getContext().canvas);
            if (!listenersAttachedRef.current && canvas) {
              let lostCount = 0;
              const onLost = (e) => {
                e.preventDefault();
                lostCount += 1;
                if (lostCount <= 3) console.warn('WebGL context lost, attempting to restore...');
                setContextLost(true);
                setRestoreAttempts((v) => v + 1);
                setTimeout(() => {
                  try {
                    setCanvasKey((k) => k + 1);
                  } catch (err) {}
                }, 1000);
              };
              const onRestored = () => {
                console.info('WebGL context restored');
                try { setContextLost(false); setRestoreAttempts(0); } catch (err) {}
                try { gl.resetState(); } catch (err) {}
              };
              canvas.addEventListener('webglcontextlost', onLost, false);
              canvas.addEventListener('webglcontextrestored', onRestored, false);
              listenersAttachedRef.current = true;
            }
          } catch (err) {
            console.warn('Failed to attach WebGL context handlers', err);
          }
        }}
      >
        <ShaderPlane />
      
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
    </div>
  );
}