import React, { useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { World } from "../pkg/game_of_life";
import { updateHangulSetOnWasm } from "./hangul";
import { getVideoStream, startMediaSource } from "./camera";
import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";
import { CELL_SIZE, frameDuration } from "./constants";
import { updateAndDrawWorld } from "./drawing";
import { initializeSelfieSegmentation } from "./segmentation";

const DescriptionStage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    updateHangulSetOnWasm(worldRef.current, "설명");
  }, []);

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
            "random", // 고정 모드
            ctx,
            video,
            true // 배경 영상 보기 활성화
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
  }, []);

  const handleStartVideo = async () => {
    if (videoRef.current) {
      await startMediaSource(
        videoRef.current,
        getVideoStream(videoRef.current)
      );
    }
  };

  // 영상 종료 시 /main으로 이동
  const handleVideoEnd = () => {
    navigate("/main");
  };

  // 컴포넌트 마운트 시 영상 자동 시작
  useEffect(() => {
    handleStartVideo();
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        id="inputVideo"
        playsInline
        muted
        onEnded={handleVideoEnd}
      ></video>
      <canvas ref={canvasRef} id="game-of-life-canvas"></canvas>
    </div>
  );
};

export default DescriptionStage;
