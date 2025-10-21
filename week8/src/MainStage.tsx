import React, { useState, useRef, useEffect, useCallback } from "react";
import { World } from "../pkg/game_of_life";
import { updateHangulSetOnWasm } from "./hangul";
import { getWebcamStream, getVideoStream, startMediaSource } from "./camera";
import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";
import { CELL_SIZE, frameDuration } from "./constants";
import { updateAndDrawWorld } from "./drawing";
import { initializeSelfieSegmentation } from "./segmentation";

const MainStage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hangulInput, setHangulInput] = useState<string>("가");
  const [currentMode, setCurrentMode] = useState<string>("random");
  const [showVideoBackground, setShowVideoBackground] =
    useState<boolean>(false);

  const worldRef = useRef<World | null>(null);
  const selfieSegmentationRef = useRef<SelfieSegmentation | null>(null);
  const segmentationMaskRef = useRef<ImageBitmap | undefined>();
  const isProcessingRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);

  const setupDOMAndWorld = useCallback(() => {
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
  }, [hangulInput]);

  useEffect(() => {
    setupDOMAndWorld();
    window.addEventListener("resize", setupDOMAndWorld);

    selfieSegmentationRef.current = initializeSelfieSegmentation(
      (results: Results) => {
        segmentationMaskRef.current = results.segmentationMask;
      }
    );

    return () => {
      window.removeEventListener("resize", setupDOMAndWorld);
      selfieSegmentationRef.current?.close();
    };
  }, [setupDOMAndWorld]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!video || !canvas || !ctx) return;

    const processFrame = async () => {
      if (!isProcessingRef.current) return;

      const now = performance.now();
      if (now - lastTimeRef.current >= frameDuration) {
        lastTimeRef.current = now;
        if (video.readyState >= 2) {
          await selfieSegmentationRef.current?.send({ image: video });
        }
        if (worldRef.current && segmentationMaskRef.current) {
          updateAndDrawWorld(
            worldRef.current,
            segmentationMaskRef.current,
            currentMode,
            ctx,
            video,
            showVideoBackground
          );
        }
      }
      animationFrameId.current = requestAnimationFrame(processFrame);
    };

    if (!isProcessingRef.current) {
      isProcessingRef.current = true;
      animationFrameId.current = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isProcessingRef.current = false;
    };
  }, [currentMode, showVideoBackground]);

  useEffect(() => {
    if (worldRef.current) {
      updateHangulSetOnWasm(worldRef.current, hangulInput);
    }
  }, [hangulInput]);

  const handleStartWebcam = async () => {
    if (videoRef.current) {
      await startMediaSource(videoRef.current, getWebcamStream());
    }
  };

  const handleStartVideo = async () => {
    if (videoRef.current) {
      await startMediaSource(
        videoRef.current,
        getVideoStream(videoRef.current)
      );
    }
  };

  return (
    <div>
      <div id="controls">
        <div className="control-group">
          <button onClick={handleStartVideo}>🎞 영상</button>
          <button onClick={handleStartWebcam}>📷 웹캠</button>
        </div>
        <div className="control-group">
          <input
            type="text"
            value={hangulInput}
            onChange={(e) => setHangulInput(e.target.value)}
            placeholder="ex: 가"
          />
        </div>
        <div className="control-group">
          <input
            type="checkbox"
            id="video-bg-toggle"
            checked={showVideoBackground}
            onChange={(e) => setShowVideoBackground(e.target.checked)}
          />
          <label htmlFor="video-bg-toggle">배경 영상 보기</label>
        </div>
        <div className="control-group">
          <label htmlFor="mode-select">모드:</label>
          <select
            id="mode-select"
            value={currentMode}
            onChange={(e) => setCurrentMode(e.target.value)}
          >
            <option value="random">랜덤</option>
            <option value="consonant">자음</option>
            <option value="vowel">모음</option>
          </select>
        </div>
      </div>

      <video ref={videoRef} id="inputVideo" playsInline muted></video>
      <canvas ref={canvasRef} id="game-of-life-canvas"></canvas>
    </div>
  );
};

export default MainStage;
