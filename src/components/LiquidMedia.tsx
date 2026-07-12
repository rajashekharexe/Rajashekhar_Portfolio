import { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uImage;
uniform sampler2D uVideo;
uniform float uHover;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHasVideo;
varying vec2 vUv;

// Classic Perlin 2D Noise 
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // Distort based on noise, time, and hover state
  float noise = snoise(uv * 3.0 + uTime * 0.5);
  
  // Calculate distance from mouse
  float dist = distance(uv, uMouse);
  
  // Ripple effect radiating from mouse
  float ripple = sin(dist * 20.0 - uTime * 10.0) * 0.5 + 0.5;
  
  // Apply distortion mostly near mouse, scaling by uHover
  float intensity = smoothstep(0.5, 0.0, dist) * uHover;
  uv.x += noise * 0.08 * intensity + ripple * 0.03 * intensity;
  uv.y += noise * 0.08 * intensity + ripple * 0.03 * intensity;
  
  // Clamp UVs to avoid edge bleeding
  uv = clamp(uv, 0.0, 1.0);
  
  vec4 imgColor = texture2D(uImage, uv);
  vec4 vidColor = uHasVideo > 0.5 ? texture2D(uVideo, uv) : imgColor;
  
  // Crossfade between image and video based on uHover
  gl_FragColor = mix(imgColor, vidColor, uHover);
}
`;

const Scene = ({ image, videoRef, isHovered }: { image: string, videoRef: React.RefObject<HTMLVideoElement | null>, isHovered: boolean }) => {
  const { viewport } = useThree()
  const imgTex = useTexture(image)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  
  const [vidTex, setVidTex] = useState<THREE.VideoTexture | null>(null)
  
  useEffect(() => {
    if (videoRef.current) {
      const tex = new THREE.VideoTexture(videoRef.current)
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.format = THREE.RGBAFormat
      setVidTex(tex)
    }
  }, [videoRef])

  const uniforms = useMemo(() => ({
    uImage: { value: imgTex },
    uVideo: { value: null },
    uHover: { value: 0 },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHasVideo: { value: 0 }
  }), [imgTex])

  useFrame((state, delta) => {
    if (!matRef.current) return
    
    // Smoothly interpolate hover state
    matRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uHover.value,
      isHovered ? 1 : 0,
      0.08
    )
    
    // Time
    matRef.current.uniforms.uTime.value += delta
    
    // Smoothly interpolate mouse (pointer is -1 to 1, we want 0 to 1)
    // We adjust Y because WebGL UV origin is bottom-left
    const targetX = state.pointer.x * 0.5 + 0.5
    const targetY = state.pointer.y * 0.5 + 0.5
    matRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(matRef.current.uniforms.uMouse.value.x, targetX, 0.1)
    matRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(matRef.current.uniforms.uMouse.value.y, targetY, 0.1)
    
    // Update video texture if playing
    if (vidTex) {
      matRef.current.uniforms.uVideo.value = vidTex
      matRef.current.uniforms.uHasVideo.value = 1
      if (isHovered && videoRef.current && videoRef.current.readyState >= videoRef.current.HAVE_CURRENT_DATA) {
        vidTex.needsUpdate = true
      }
    }
  })

  // Set the viewport size strictly using orthographic projection sizes
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial 
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  )
}

export default function LiquidMedia({ image, videoRef, isHovered }: { image: string, videoRef: React.RefObject<HTMLVideoElement | null>, isHovered: boolean }) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene image={image} videoRef={videoRef} isHovered={isHovered} />
        </Suspense>
      </Canvas>
    </div>
  )
}
