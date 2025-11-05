import { GUI } from "lil-gui";
import { createPresets } from "../config/params.js";

// GUI 설정
export function setupGUI(params, setObliqueProjection) {
  const gui = new GUI();
  
  // 투영 각도 폴더
  const folderAngles = gui.addFolder("Projection Angles");
  folderAngles.add(params, "thetaX", 0, 360, 1).onChange(setObliqueProjection);
  folderAngles.add(params, "thetaY", 0, 360, 1).onChange(setObliqueProjection);
  folderAngles.add(params, "thetaZ", 0, 360, 1).onChange(setObliqueProjection);
  folderAngles.open();

  // 축 스케일 폴더
  const folderScales = gui.addFolder("Axis Scales");
  folderScales.add(params, "scaleX", 0.1, 2, 0.01).onChange(setObliqueProjection);
  folderScales.add(params, "scaleY", 0.1, 2, 0.01).onChange(setObliqueProjection);
  folderScales.add(params, "scaleZ", 0.1, 2, 0.01).onChange(setObliqueProjection);
  folderScales.open();

  // 프리셋 폴더
  const presets = createPresets(params, gui, setObliqueProjection);
  const folderPresets = gui.addFolder("Presets");
  folderPresets.add(presets, "Isometric");
  folderPresets.add(presets, "Dimetric");
  folderPresets.add(presets, "FrontOblique");
  folderPresets.add(presets, "Cabinet");
  folderPresets.open();
  
  return gui;
}

