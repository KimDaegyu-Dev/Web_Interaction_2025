import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";

function initializeSelfieSegmentation(
  onResults: (results: Results) => void
): SelfieSegmentation {
  const selfieSegmentation = new SelfieSegmentation({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });

  selfieSegmentation.setOptions({ modelSelection: 1, selfieMode: true });
  selfieSegmentation.onResults(onResults);

  return selfieSegmentation;
}

export { initializeSelfieSegmentation };
