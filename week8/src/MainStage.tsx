import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { World } from "wasm-game-of-life";
import { updateHangulSetOnWasm } from "./hangul";
import { getWebcamStream, getVideoStream, startMediaSource } from "./camera";
import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";
import { CELL_SIZE, frameDuration } from "./constants";
import { updateAndDrawWorld } from "./drawing";
import { initializeSelfieSegmentation } from "./segmentation";
import ScreenshotButton from "./components/ScreenshotButton";

const MainStage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hangulInput, setHangulInput] = useState<string>("배고프다");
  const [tempHangulInput, setTempHangulInput] = useState<string>("배고프다");
  const [showVideoBackground, setShowVideoBackground] =
    useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const worldRef = useRef<World | null>(null);
  const selfieSegmentationRef = useRef<SelfieSegmentation | null>(null);
  const segmentationMaskRef = useRef<ImageBitmap | undefined>(undefined);
  const isProcessingRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);

  const setupDOMAndWorld = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("setupDOMAndWorld: Canvas not found");
      return;
    }

    console.log("setupDOMAndWorld: Canvas found", canvas);

    const docWidth = document.documentElement.clientWidth;
    const docHeight = document.documentElement.clientHeight;
    canvas.width = docWidth;
    canvas.height = docHeight;

    console.log("Canvas size set to:", docWidth, "x", docHeight);

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
        if (results.segmentationMask) {
          segmentationMaskRef.current = results.segmentationMask as ImageBitmap;
        }
      }
    );

    return () => {
      window.removeEventListener("resize", setupDOMAndWorld);
      selfieSegmentationRef.current?.close();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
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
            "random",
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
      setIsProcessing(true);
      animationFrameId.current = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isProcessingRef.current = false;
      setIsProcessing(false);
    };
  }, [showVideoBackground]);

  useEffect(() => {
    if (worldRef.current) {
      updateHangulSetOnWasm(worldRef.current, hangulInput);
    }
  }, [hangulInput]);

  const handleStartWebcam = useCallback(async () => {
    if (videoRef.current) {
      await startMediaSource(videoRef.current, getWebcamStream());
    }
  }, []);

  const handleToggleVideoBackground = () => {
    setShowVideoBackground((prev) => !prev);
  };

  const handleHangulInputChange = useCallback((value: string) => {
    setTempHangulInput(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setHangulInput(value);
    }, 400);
  }, []);

  // 컴포넌트 마운트 시 웹캠 자동 시작
  useEffect(() => {
    handleStartWebcam();
  }, [handleStartWebcam]);

  return (
    <div onClick={handleToggleVideoBackground}>
      <div id="controls">
        <div className="control-group">
          <input
            type="text"
            value={tempHangulInput}
            onChange={(e) => handleHangulInputChange(e.target.value)}
            placeholder="ex: 읏 추워"
          />
        </div>
        <div className="control-group">
          <ScreenshotButton canvasRef={canvasRef} isProcessing={isProcessing} />
        </div>
      </div>

      <video ref={videoRef} id="inputVideo" playsInline muted></video>
      <canvas ref={canvasRef} id="game-of-life-canvas"></canvas>
    </div>
  );
};

export default MainStage;
