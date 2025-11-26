export const MODEL_CONFIG = {
  DEFAULT_SCALE: [3.0, 3.0, 3.0] as [number, number, number],
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
      name: "메트로 시티 아파트", 
      meshIndex: 0,
      description: "도심의 편리함과 고층의 탁 트인 전망을 모두 갖춘 현대적인 아파트입니다."
    },
    { 
      key: "cube", 
      name: "선샤인 빌라", 
      meshIndex: 1,
      description: "따스한 햇살이 가득 들어오는 남향 구조의 아늑한 빌라입니다."
    },
    { 
      key: "cube_085", 
      name: "그린 가든 단독주택", 
      meshIndex: 2,
      description: "넓은 마당과 정원이 있어 자연과 함께 숨 쉬는 단독주택입니다."
    },
    { 
      key: "cube_121", 
      name: "리버뷰 아파트", 
      meshIndex: 3,
      description: "창밖으로 흐르는 강을 바라보며 여유를 즐길 수 있는 프리미엄 아파트입니다."
    },
    { 
      key: "cube_001", 
      name: "코지 빌라", 
      meshIndex: 4,
      description: "작지만 효율적인 공간 구성으로 1인 가구에게 안성맞춤인 빌라입니다."
    },
    { 
      key: "cube_135", 
      name: "모던 단독주택", 
      meshIndex: 5,
      description: "심플하고 세련된 디자인으로 완성된 감각적인 단독주택입니다."
    },
    { 
      key: "plane_043", 
      name: "스카이 아파트", 
      meshIndex: 6,
      description: "하늘과 가장 가까운 곳에서 특별한 일상을 누리는 펜트하우스형 아파트입니다."
    },
    { 
      key: "plane_038", 
      name: "어반 빌라", 
      meshIndex: 7,
      description: "도시적인 감성과 편리한 교통을 자랑하는 도심형 빌라입니다."
    },
    { 
      key: "cube_002", 
      name: "포레스트 단독주택", 
      meshIndex: 8,
      description: "숲세권에 위치하여 맑은 공기와 피톤치드를 만끽할 수 있는 단독주택입니다."
    },
    { 
      key: "cube_004", 
      name: "노블레스 아파트", 
      meshIndex: 9,
      description: "최고급 자재와 품격 있는 커뮤니티 시설을 갖춘 럭셔리 아파트입니다."
    },
    { 
      key: "cube_035", 
      name: "하모니 빌라", 
      meshIndex: 10,
      description: "이웃 간의 정이 넘치고 조용한 주거 환경을 제공하는 빌라입니다."
    },
    { 
      key: "cube_003", 
      name: "드림 단독주택", 
      meshIndex: 11,
      description: "당신이 꿈꾸던 나만의 공간을 실현할 수 있는 맞춤형 단독주택입니다."
    },
    { 
      key: "cube_039", 
      name: "센트럴 아파트", 
      meshIndex: 12,
      description: "도시의 중심에서 모든 인프라를 가깝게 누리는 대단지 아파트입니다."
    },
  ],


} as const;
