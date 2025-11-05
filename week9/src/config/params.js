// 투영 파라미터 설정
export const params = {
  thetaX: 330, // x축: 오른쪽 아래로 (-30도 = 330도)
  thetaY: 90, // y축: 위로 (90도)
  thetaZ: 210, // z축: 왼쪽 아래로 (210도)
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1, // 아이소메트릭 스타일
};

// 프리셋 정의
export const createPresets = (params, gui, setObliqueProjection) => ({
  Isometric: () => {
    Object.assign(params, {
      thetaX: 330, // x축: 오른쪽 아래로 30도
      thetaY: 90, // y축: 위로
      thetaZ: 210, // z축: 왼쪽 아래로 30도
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    });
    gui.updateDisplay();
    setObliqueProjection();
  },
  Dimetric: () => {
    Object.assign(params, {
      thetaX: 335, // x축: 약간 더 오른쪽 아래
      thetaY: 90, // y축: 위로
      thetaZ: 205, // z축: 약간 덜 왼쪽
      scaleX: 1,
      scaleY: 1,
      scaleZ: 0.5, // z축 스케일 줄임
    });
    gui.updateDisplay();
    setObliqueProjection();
  },
  FrontOblique: () => {
    Object.assign(params, {
      thetaX: 0,
      thetaY: 90,
      thetaZ: 225,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 0.7,
    });
    gui.updateDisplay();
    setObliqueProjection();
  },
  Cabinet: () => {
    Object.assign(params, {
      thetaX: 0,
      thetaY: 90,
      thetaZ: 225,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 0.5,
    });
    gui.updateDisplay();
    setObliqueProjection();
  },
});

