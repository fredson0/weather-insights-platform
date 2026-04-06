export const cloudVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const cloudFragmentShader = `
  uniform float uTime;
  uniform vec3 uMouse;
  uniform vec3 uResolution;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  // Noise functions for procedural cloud generation
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(
      mix(
        mix(hash(n + 0.0), hash(n + 1.0), f.x),
        mix(hash(n + 57.0), hash(n + 58.0), f.x),
        f.y
      ),
      mix(
        mix(hash(n + 113.0), hash(n + 114.0), f.x),
        mix(hash(n + 170.0), hash(n + 171.0), f.x),
        f.y
      ),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p * frequency);
      p += vec3(uTime * 0.05);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  // Volumetric cloud computation
  float volumetricCloud(vec3 pos) {
    float cloud = fbm(pos * 2.0);
    cloud += 0.5 * fbm(pos * 4.0 + uTime * 0.1);
    cloud += 0.25 * fbm(pos * 8.0 + uTime * 0.2);
    
    // Storm-like concentration
    float storm = smoothstep(0.3, 0.7, cloud);
    
    return cloud * storm;
  }

  void main() {
    vec3 rayDir = normalize(vPosition);
    vec3 rayOrigin = vec3(0.0);
    
    // Ray marching through cloud volume
    float transmittance = 1.0;
    vec3 color = vec3(0.0);
    float stepSize = 0.05;
    
    for (int i = 0; i < 32; i++) {
      vec3 samplePos = rayOrigin + rayDir * (float(i) * stepSize);
      float density = volumetricCloud(samplePos + vec3(uTime * 0.02));
      
      // Lighting from "sun"
      float light = smoothstep(-0.5, 0.5, dot(normalize(samplePos), vec3(0.5, 1.0, 0.3)));
      
      // Enhanced storm coloring
      vec3 cloudColor = mix(
        vec3(0.3, 0.4, 0.6),  // Dark cloud base
        vec3(0.7, 0.8, 1.0),  // Light top
        light
      );
      
      // Add dramatic storm lighting
      cloudColor += vec3(1.0, 0.8, 0.6) * pow(light, 3.0) * 0.5;
      
      color += transmittance * density * cloudColor * stepSize;
      transmittance *= exp(-density * stepSize * 2.0);
      
      if (transmittance < 0.01) break;
    }

    // Atmospheric perspective
    float depth = length(vPosition);
    color += vec3(0.1, 0.15, 0.3) * (1.0 - transmittance) * 0.5;
    
    gl_FragColor = vec4(color, max(transmittance, 0.0));
  }
`;
