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
  varying float vLensEdge;

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

    // 1 CM Glass Lens Radius (~1.1 WebGL units)
    float dist = distance(basePos.xy, uMouse.xy); 
    float lensRadius = 1.1; 
    
    // Glass factor inside lens
    float lensFactor = 1.0 - smoothstep(lensRadius - 0.1, lensRadius, dist);
    
    // Outer Glass Lens Ring Outline (for crisp 1cm cursor visibility)
    float ringWidth = 0.12;
    vLensEdge = smoothstep(lensRadius - ringWidth, lensRadius, dist) * (1.0 - smoothstep(lensRadius, lensRadius + ringWidth, dist));
    
    // Active when portrait is formed (uProgress > 0.5) and before sphere morph (uMorph < 0.8)
    vInLens = lensFactor * uHover * (1.0 - uMorph) * smoothstep(0.5, 1.0, uProgress); 
    
    // Slight 3D z-pop inside glass lens
    vec3 zenithPos = mix(basePos, basePos + vec3(0.0, 0.0, 0.3), vInLens);

    vec3 explodeDir = normalize(zenithPos) + curl(zenithPos * 2.0);
    explodeDir.y += 1.5; 
    float speedMap = random(vec3(45.164, 12.9898, 78.233), 0.0);
    vec3 finalPos = mix(zenithPos, zenithPos + (explodeDir * 15.0 * (speedMap + 0.5)), uDissolve);

    // Apply rotation ONLY to sphere state
    float angle = uTime * 0.1 * uMorph;
    mat2 rotY = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    finalPos.xz = rotY * finalPos.xz;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depth = -mvPosition.z; 
    
    // Point size: 30.0 for portrait, 5.0 for sphere, enlarged to 38.0 inside glass lens for crystal clear tiling
    float basePointSize = mix(30.0, 5.0, uMorph);
    basePointSize = mix(basePointSize, 38.0, vInLens);
    gl_PointSize = (basePointSize / depth) * vSizeMultiplier; 
    
    float portraitAlpha = smoothstep(14.0, 6.0, depth);
    float sphereAlpha = smoothstep(-5.0, 5.0, finalPos.z) * 0.6 + 0.15;
    
    vAlpha = mix(portraitAlpha, sphereAlpha, uMorph) * (1.0 - uDissolve);
  }
`;  

export const fragmentShader = `
  uniform float uMorph;
  uniform float uHover;
  
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSizeMultiplier;
  varying float vInLens;
  varying float vLensEdge;

  void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float radius = dot(cxy, cxy);
    
    // Tiled square pixels inside the glass lens for crisp 2D photo rendering
    if (radius > 1.0 && vInLens < 0.5) discard;

    float core = exp(-2.5 * radius); 
    float halo = 1.0 - smoothstep(0.0, 1.0, radius);       
    float softness = mix(halo, core, 0.5);

    // Color exposure inside glass lens vs ambient background particles
    float brightnessBoost = mix(1.4, 0.7, uMorph);
    vec3 photoColor = mix(vColor * brightnessBoost, vColor * 1.7, vInLens);
    
    // Glass Rim Outline Color (Glowing cyan-white glass ring)
    vec3 glassRimColor = vec3(0.8, 0.95, 1.0) * 2.0;
    vec3 finalColor = mix(photoColor, glassRimColor, vLensEdge * uHover * (1.0 - uMorph));

    // Inside the lens, reveal 100% solid, ultra-clear picture
    float finalSoftness = mix(softness, 1.0, vInLens);
    float finalAlpha = mix(finalSoftness * vAlpha, 1.0, vInLens * 0.9); 
    
    if (finalAlpha < 0.02) discard;

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;