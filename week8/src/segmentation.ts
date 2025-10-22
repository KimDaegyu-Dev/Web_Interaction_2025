import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";

declare global {
  interface Window {
    SelfieSegmentation: typeof SelfieSegmentation;
  }
}

function initializeSelfieSegmentation(
  onResults: (results: Results) => void
): SelfieSegmentation {
  // 글로벌 객체가 있으면 사용, 없으면 import된 것 사용
  const SelfieSegmentationConstructor =
    window.SelfieSegmentation || SelfieSegmentation;

  const selfieSegmentation = new SelfieSegmentationConstructor({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });

  selfieSegmentation.setOptions({ modelSelection: 1, selfieMode: true });
  selfieSegmentation.onResults(onResults);

  return selfieSegmentation;
}

export { initializeSelfieSegmentation };
