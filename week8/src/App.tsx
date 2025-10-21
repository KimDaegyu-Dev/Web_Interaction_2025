import React, { useState, useRef, useEffect } from "react";
import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";
import { World } from "../pkg/game_of_life";
import { memory } from "../pkg/game_of_life_bg.wasm";
import { CELL_SIZE, frameDuration } from "./constants";
import { updateHangulSetOnWasm } from "./hangul";
import { getWebcamStream, getVideoStream, startMediaSource } from "./camera";
import { initializeSelfieSegmentation } from "./segmentation";
import { updateAndDrawWorld } from "./drawing";

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<World | null>(null);
  const selfieSegmentationRef = useRef<SelfieSegmentation | null>(null);
  const [segmentationMask, setSegmentationMask] = useState<
    ImageBitmap | undefined
  >(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMode, setCurrentMode] = useState("random");
  const [showVideoBackground, setShowVideoBackground] = useState(false);
  const [hangulInput, setHangulInput] = useState("가");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const docWidth = document.documentElement.clientWidth;
    const docHeight = document.documentElement.clientHeight;
    canvas.width = docWidth;
    canvas.height = docHeight;

    const worldWidth = Math.floor(docWidth / (CELL_SIZE + 1));
    const worldHeight = Math.floor(docHeight / (CELL_SIZE + 1));

    worldRef.current = new World(worldWidth, worldHeight);

    selfieSegmentationRef.current = initializeSelfieSegmentation(
      (results: Results) => {
        setSegmentationMask(results.segmentationMask);
      }
    );
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const docWidth = document.documentElement.clientWidth;
      const docHeight = document.documentElement.clientHeight;
      canvas.width = docWidth;
      canvas.height = docHeight;

      const worldWidth = Math.floor(docWidth / (CELL_SIZE + 1));
      const worldHeight = Math.floor(docHeight / (CELL_SIZE + 1));

      worldRef.current = new World(worldWidth, worldHeight);
      updateHangulSetOnWasm(worldRef.current, hangulInput);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [hangulInput]);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;

    const gameLoop = async (timestamp: number) => {
      if (!isProcessing) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const deltaTime = timestamp - lastTime;

      if (deltaTime > frameDuration) {
        lastTime = timestamp - (deltaTime % frameDuration);

        const video = videoRef.current;
        const world = worldRef.current;
        const selfieSegmentation = selfieSegmentationRef.current;

        if (video && world && selfieSegmentation && video.readyState >= 2) {
          await selfieSegmentation.send({ image: video });

          if (segmentationMask) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (ctx) {
              updateAndDrawWorld(
                world,
                segmentationMask,
                currentMode,
                ctx,
                video,
                showVideoBackground
              );
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isProcessing, segmentationMask, currentMode, showVideoBackground]);

  const handleWebcam = async () => {
    if (!videoRef.current) return;
    await startMediaSource(videoRef.current, getWebcamStream());
    setIsProcessing(true);
  };

  const handleVideo = async () => {
    if (!videoRef.current) return;
    await startMediaSource(videoRef.current, getVideoStream(videoRef.current));
    setIsProcessing(true);
  };

  return (
    <div>
      <div id="controls">
        <div className="control-group">
          <button onClick={handleVideo}>🎞 영상</button>
          <button onClick={handleWebcam}>📷 웹캠</button>
        </div>
        <div className="control-group">
          <input
            type="text"
            value={hangulInput}
            onChange={(e) => setHangulInput(e.target.value)}
            placeholder="ex: 가"
          />
          <button
            onClick={() =>
              worldRef.current &&
              updateHangulSetOnWasm(worldRef.current, hangulInput)
            }
          >
            적용
          </button>
        </div>
        <div className="control-group">
          <input
            type="checkbox"
            checked={showVideoBackground}
            onChange={(e) => setShowVideoBackground(e.target.checked)}
          />
          <label>배경 영상 보기</label>
        </div>
        <div className="control-group">
          <label>모드:</label>
          <select
            value={currentMode}
            onChange={(e) => setCurrentMode(e.target.value)}
          >
            <option value="random">랜덤</option>
            <option value="consonant">자음</option>
            <option value="vowel">모음</option>
          </select>
        </div>
      </div>

      <video ref={videoRef} playsInline muted style={{ display: "none" }} />
      <canvas ref={canvasRef} id="game-of-life-canvas" />
    </div>
  );
};

export default App;
