export const vertexShader = `
  uniform float uProgress; 
  uniform float uTime;     
  uniform vec3 uMouse;     
  uniform float uHover;    
  uniform float uDissolve; 
  uniform float uMorph; 
  
  attribute vec3 targetPosition; 
  attribute vec3 spherePosition; 
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
    
    vec3 currentTarget = mix(targetPosition, spherePosition, uMorph);
    
    vec3 drift = position + curl(position + uTime * 0.15) * 0.5;
    vec3 swirlPath = mix(drift, currentTarget + curl(currentTarget) * 1.5, uProgress);
    vec3 basePos = mix(swirlPath, currentTarget, smoothstep(0.8, 1.0, uProgress));

    float dist = distance(basePos.xy, uMouse.xy); 
    float lensRadius = 1.8; 
    float lensFactor = 1.0 - smoothstep(lensRadius - 0.2, lensRadius, dist);
    vInLens = lensFactor * uHover * (1.0 - uMorph); 
    
    vec3 zenithPos = mix(basePos, currentTarget, vInLens);

    vec3 explodeDir = normalize(zenithPos) + curl(zenithPos * 2.0);
    explodeDir.y += 1.5; 
    float speedMap = random(vec3(45.164, 12.9898, 78.233), 0.0);
    vec3 finalPos = mix(zenithPos, zenithPos + (explodeDir * 15.0 * (speedMap + 0.5)), uDissolve);

    // Apply rotation ONLY to the sphere state
    float angle = uTime * 0.1 * uMorph;
    mat2 rotY = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    finalPos.xz = rotY * finalPos.xz;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depth = -mvPosition.z; 
    
    // Smoothly transition point size: Large (30.0) for portrait formation, Crisp dots (5.0) for Sphere
    float basePointSize = mix(30.0, 5.0, uMorph);
    gl_PointSize = (basePointSize / depth) * vSizeMultiplier; 
    
    // ==========================================
    // THE HEMISPHERE FIX
    // ==========================================
    // 1. Portrait Alpha: Uses the original strict camera depth limit
    float portraitAlpha = smoothstep(14.0, 6.0, depth);
    
    // 2. Sphere Alpha: High enough to clearly see the sphere shape, low enough not to block Skill Nodes
    // Max opacity 60% at the front, 15% at the back
    float sphereAlpha = smoothstep(-5.0, 5.0, finalPos.z) * 0.6 + 0.15;
    
    // 3. Blend between them smoothly as the scroll morph happens
    vAlpha = mix(portraitAlpha, sphereAlpha, uMorph) * (1.0 - uDissolve);
  }
`;  

export const fragmentShader = `
  uniform float uMorph;
  
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

    // Dynamically adjust brightness: High (1.4) for flat portrait, Elegant ambient (0.7) for sphere
    float brightnessBoost = mix(1.4, 0.7, uMorph);
    vec3 finalColor = vColor * brightnessBoost;

    // Inside the lens, we reveal the solid picture
    float finalSoftness = mix(softness, 1.0, vInLens);
    float finalAlpha = finalSoftness * vAlpha; 
    
    // Discard completely invisible pixels to optimize rendering speed
    if (finalAlpha < 0.02) discard;

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;