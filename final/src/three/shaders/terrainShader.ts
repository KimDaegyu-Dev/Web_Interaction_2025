export const terrainVertexShader = /* glsl */ `
  varying float vHeight;

  uniform sampler2D heightMap;
  uniform float displacementScale;

  void main() {
    float h = texture2D(heightMap, uv).r;

    vHeight = h;

    vec3 displaced = position + normal * (h * displacementScale);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

export const terrainFragmentShader = /* glsl */ `varying float vHeight;

void main() {

    float h = vHeight;

    vec3 color;

    if (h < 0.02) {
        color = vec3(0.55, 0.55, 0.55);      // 서울 저지대 도심부 (회색)
    }
    else if (h < 0.10) {
        color = vec3(0.95, 0.85, 0.50);      // 낮은 구릉지
    }
    else if (h < 0.20) {
        color = vec3(0.6, 0.75, 0.4);        // 초록 구릉
    }
    else if (h < 0.45) {
        color = vec3(0.3, 0.5, 0.2);         // 산지 아래
    }
    else if (h < 0.7) {
        color = vec3(0.4, 0.3, 0.2);         // 암석/바위 지역
    }
    else {
        color = vec3(0.95, 0.95, 0.95);      // 정상부 (설원 느낌)
    }

    gl_FragColor = vec4(color, 1.0);
}

`;
