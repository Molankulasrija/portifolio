export const vertexShader = `
  uniform float uProgress; 
  uniform float uTime;     
  uniform vec3 uMouse;     
  uniform float uHover;    
  uniform float uDissolve; 
  
  attribute vec3 targetPosition; 
  attribute vec3 color;          
  
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSizeMultiplier;
  varying float vInLens;

  vec3 curl(vec3 p) {
    return vec3(sin(p.z), cos(p.x), sin(p.y)) * 2.0;
  }

  float random(vec3 scale, float seed) {
    return fract(sin(dot(targetPosition + seed, scale)) * 43758.5453 + seed);
  }

  void main() {
    vColor = color;
    
    vSizeMultiplier = random(vec3(12.9898, 78.233, 151.7182), 0.0) * 0.4 + 0.8;
    
    vec3 drift = position + curl(position + uTime * 0.15) * 0.5;
    vec3 swirlPath = mix(drift, targetPosition + curl(targetPosition) * 1.5, uProgress);
    vec3 basePos = mix(swirlPath, targetPosition, smoothstep(0.8, 1.0, uProgress));

    // THE LENS REVEAL MATH
    float dist = distance(basePos.xy, uMouse.xy); 
    float lensRadius = 1.8; 
    float lensFactor = 1.0 - smoothstep(lensRadius - 0.2, lensRadius, dist);
    vInLens = lensFactor * uHover; 
    
    // Simply snap the floating particles exactly back to the real photograph's grid
    vec3 zenithPos = mix(basePos, targetPosition, vInLens);

    // Dissolve Math
    vec3 explodeDir = normalize(zenithPos) + curl(zenithPos * 2.0);
    explodeDir.y += 1.5; 
    float speedMap = random(vec3(45.164, 12.9898, 78.233), 0.0);
    vec3 finalPos = mix(zenithPos, zenithPos + (explodeDir * 15.0 * (speedMap + 0.5)), uDissolve);

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depth = -mvPosition.z; 
    
    // FIX: Keep the particle size EXACTLY the same inside and outside the lens.
    // This entirely prevents the white blow-out.
    gl_PointSize = (13.0 / depth) * vSizeMultiplier; 
    
    vAlpha = smoothstep(14.0, 6.0, depth) * (1.0 - uDissolve);
  }
`;

export const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSizeMultiplier;
  varying float vInLens;

  void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float radius = dot(cxy, cxy);
    
    // Make particles square inside the lens so they tile together like a real photo
    if (radius > 1.0 && vInLens < 0.5) discard;

    float core = exp(-2.5 * radius); 
    float halo = 1.0 - smoothstep(0.0, 1.0, radius);       
    float softness = mix(halo, core, 0.5);

    // FIX: Keep the light and brightness identical everywhere
    vec3 finalColor = vColor * 2.0;

    // Inside the lens, we remove the glowing gradient to reveal the flat, real picture,
    // but we cap it at 0.8 so the additive blending doesn't blow out to pure white.
    float finalSoftness = mix(softness, 0.8, vInLens);
    float finalAlpha = finalSoftness * vAlpha; 

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;