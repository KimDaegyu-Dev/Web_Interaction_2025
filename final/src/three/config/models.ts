export const MODEL_CONFIG = {
  DEFAULT_SCALE: [1.4, 1.4, 1.4] as [number, number, number],
  DEFAULT_ROTATION: [0, Math.PI / 2, 0] as [number, number, number],
  DEFAULT_POSITION_OFFSET: [0, 0, 0] as [number, number, number],
  SCALE_MULTIPLIER: 0.05,
  HOVER_SCALE_FACTOR: 1.05,
  ANIMATION: {
    CROSS_FADE_DURATION: 0.25,
    DEFAULT_CROSS_FADE: 0.3,
  },
  // Model loading strategy: "single_glb" (all models in one file) or "individual" (separate files)
  LOAD_STRATEGY: "single_glb" as "single_glb" | "individual",
  // Base URL for models if using individual strategy
  BASE_URL: "models/",
  // Shared GLB URL if using single_glb strategy
  SHARED_GLB_URL: "models/building.glb",
  BUILDING_TYPES: [
    { 
      key: "cube_138", 
      name: "Cube.138", 
      meshIndex: 0,
      description: "거대한 복합 상업시설입니다. 현대적인 디자인과 넓은 공간으로 많은 사람들이 모이는 랜드마크가 될 것입니다."
    },
    { 
      key: "cube", 
      name: "Cube", 
      meshIndex: 1,
      description: "기본적인 큐브 형태의 건물입니다. 심플하고 모던한 디자인으로 어디에나 잘 어울립니다."
    },
    { 
      key: "cube_085", 
      name: "Cube.085", 
      meshIndex: 2,
      description: "중형 오피스 빌딩입니다. 효율적인 공간 활용과 세련된 외관이 특징입니다."
    },
    { 
      key: "cube_121", 
      name: "Cube.121", 
      meshIndex: 3,
      description: "고급 주거용 아파트 단지입니다. 쾌적한 생활 환경과 우수한 편의시설을 자랑합니다."
    },
    { 
      key: "cube_001", 
      name: "Cube.001", 
      meshIndex: 4,
      description: "소규모 상점 건물입니다. 아담한 크기로 골목 상권에 최적화되어 있습니다."
    },
    { 
      key: "cube_135", 
      name: "Cube.135", 
      meshIndex: 5,
      description: "문화 복합 공간입니다. 갤러리, 카페, 공연장이 어우러진 창의적인 건축물입니다."
    },
    { 
      key: "plane_043", 
      name: "Plane.043", 
      meshIndex: 6,
      description: "평면형 전시관입니다. 넓은 개방감과 자연 채광이 돋보이는 공간입니다."
    },
    { 
      key: "plane_038", 
      name: "Plane.038", 
      meshIndex: 7,
      description: "야외 광장 구조물입니다. 사람들이 모여 소통하는 열린 공간을 제공합니다."
    },
    { 
      key: "cube_002", 
      name: "Cube.002", 
      meshIndex: 8,
      description: "부티크 호텔입니다. 독특한 디자인과 프리미엄 서비스로 특별한 경험을 선사합니다."
    },
    { 
      key: "cube_004", 
      name: "Cube.004", 
      meshIndex: 9,
      description: "초대형 쇼핑몰입니다. 다양한 브랜드와 엔터테인먼트 시설이 집약된 메가 구조물입니다."
    },
    { 
      key: "cube_035", 
      name: "Cube.035", 
      meshIndex: 10,
      description: "연구 개발 센터입니다. 첨단 기술과 혁신이 이루어지는 미래지향적 건물입니다."
    },
    { 
      key: "cube_003", 
      name: "Cube.003", 
      meshIndex: 11,
      description: "커뮤니티 센터입니다. 지역 주민들의 만남과 활동을 위한 따뜻한 공간입니다."
    },
    { 
      key: "cube_039", 
      name: "Cube.039", 
      meshIndex: 12,
      description: "예술 작업실입니다. 창작자들의 영감과 작품이 탄생하는 창의적인 아틀리에입니다."
    },
  ],


} as const;
