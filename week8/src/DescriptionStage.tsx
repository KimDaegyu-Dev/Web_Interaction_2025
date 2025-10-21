import React, { useRef, useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { World } from "../pkg/game_of_life";
import { updateHangulSetOnWasm } from "./hangul";
import { getVideoStream, startMediaSource } from "./camera";
import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";
import { CELL_SIZE, frameDuration } from "./constants";
import { updateAndDrawWorld } from "./drawing";
import { initializeSelfieSegmentation } from "./segmentation";
import TextType from "./components/TextType";

const DescriptionStage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  const worldRef = useRef<World | null>(null);
  const selfieSegmentationRef = useRef<SelfieSegmentation | null>(null);
  const segmentationMaskRef = useRef<ImageBitmap | undefined>(undefined);
  const isProcessingRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);

  const [currentStage, setCurrentStage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoOpacity, setVideoOpacity] = useState(0);
  const [currentText, setCurrentText] = useState<string[]>([]);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [startTyping, setStartTyping] = useState(false);

  const stageTexts = [
    [
      "우리는 텍스트로 세상을 이해하려 한다.",
      "수많은 기호의 얽힘 속에서, 우리는 하나의 의미를 찾는다.",
    ],
    [
      "하지만 의미는 언제나 흩어진다.",
      "같은 문장도, 읽는 순간마다 다른 흔적을 남긴다.",
      "텍스트는 멈춰 있지 않다. 한 문장이 끝나는 자리에서, 이미 또 다른 의미가 태어난다.",
    ],
    [
      "우연히 맞닿은 기호들이, 잠시 하나의 생명을 이룬다.",
      "그 생명은 금세 사라지지만, 또 다른 조합으로 다시 태어난다.",
      "텍스트는 멈추지 않는다. 단지 형태를 바꿀 뿐이다.",
      "텍스트는 그렇게, 끝없이 자신을 다시 쓴다.",
    ],
    [
      "무수한 조합 속에서, 당신은 어떤 의미를 읽어내고 있나요?",
      "이제, 당신의 텍스트를 남겨보세요.",
    ],
  ];

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

  const createTimeline = useCallback(() => {
    const tl = gsap.timeline();

    // Stage 1: 텍스트만 표시 (영상 없음)
    tl.to({}, { duration: 0.5 }) // 초기 지연
      .call(() => {
        setCurrentStage(0);
        setCurrentText(stageTexts[0]);
        setShowSubtitle(true);
        setStartTyping(true);
      })
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
      .to({}, { duration: 10 }) // 타이핑 완료 대기
      .to(subtitleRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power2.in",
      })
      .call(() => {
        setStartTyping(false);
        setShowSubtitle(false);
      })
      .to({}, { duration: 1 }); // 페이드 아웃

    // Stage 2: 영상 시작, dimmed 배경, 한글 설정 변경
    tl.call(() => {
      setCurrentStage(1);
      setShowVideo(true);
      setCurrentText(stageTexts[1]);
      setShowSubtitle(true);
      setStartTyping(true);
    })
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
      .to(
        {},
        {
          duration: 2,
          onUpdate: function () {
            const progress = this.progress();
            setVideoOpacity(progress * 0.6);
          },
        }
      )
      .call(() => {
        if (worldRef.current) {
          updateHangulSetOnWasm(worldRef.current, "의미는 흩어진다");
        }
      })
      .to({}, { duration: 15 }) // 타이핑 완료 대기
      .to(subtitleRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power2.in",
      })
      .call(() => {
        setStartTyping(false);
        setShowSubtitle(false);
      })
      .to({}, { duration: 1 });

    // Stage 3: 한글 설정 변경, 영상 계속
    tl.call(() => {
      setCurrentStage(2);
      setCurrentText(stageTexts[2]);
      setShowSubtitle(true);
      setStartTyping(true);
    })
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
      .call(() => {
        if (worldRef.current) {
          updateHangulSetOnWasm(worldRef.current, "생명 태어남");
        }
      })
      .to({}, { duration: 20 }) // 타이핑 완료 대기
      .to(subtitleRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power2.in",
      })
      .call(() => {
        setStartTyping(false);
        setShowSubtitle(false);
      })
      .to({}, { duration: 1 });

    // Stage 4: 영상 종료, 빈 화면에서 텍스트만
    tl.call(() => {
      setCurrentStage(3);
      setShowVideo(false);
      setVideoOpacity(0);
      setCurrentText(stageTexts[3]);
      setShowSubtitle(true);
      setStartTyping(true);
    })
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
      .to({}, { duration: 10 }) // 타이핑 완료 대기
      .to(subtitleRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power2.in",
      })
      .call(() => {
        setStartTyping(false);
        setShowSubtitle(false);
      })
      .to({}, { duration: 2 })
      .call(() => {
        navigate("/main");
      }); // 메인으로 이동

    return tl;
  }, [stageTexts, navigate]);

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

    // 타임라인 시작
    const timeline = createTimeline();
    timeline.play();

    return () => {
      window.removeEventListener("resize", setupDOMAndWorld);
      selfieSegmentationRef.current?.close();
      timeline.kill();
    };
  }, [setupDOMAndWorld, createTimeline]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!video || !canvas || !ctx) return;

    const processFrame = async () => {
      if (!isProcessingRef.current || !showVideo) return;

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

    if (!isProcessingRef.current && showVideo) {
      isProcessingRef.current = true;
      animationFrameId.current = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isProcessingRef.current = false;
    };
  }, [showVideo]);

  const handleStartVideo = async () => {
    if (videoRef.current && showVideo) {
      try {
        await startMediaSource(
          videoRef.current,
          getVideoStream(videoRef.current)
        );
      } catch (error) {
        console.error("Failed to start video:", error);
      }
    }
  };

  // showVideo가 true가 될 때 영상 시작
  useEffect(() => {
    if (showVideo) {
      handleStartVideo();
    }
  }, [showVideo]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <video
        ref={videoRef}
        id="inputVideo"
        playsInline
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: videoOpacity,
          transition: "opacity 0.5s ease",
        }}
      />
      <canvas
        ref={canvasRef}
        id="game-of-life-canvas"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {showSubtitle && (
        <div
          ref={subtitleRef}
          style={{
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "white",
            fontSize: "24px",
            fontFamily: "Noto Sans KR, sans-serif",
            maxWidth: "80%",
            lineHeight: 1.6,
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            zIndex: 10,
          }}
        >
          <TextType
            key={`${currentStage}-${showSubtitle}`}
            text={currentText}
            typingSpeed={80}
            pauseDuration={2000}
            deletingSpeed={50}
            loop={false}
            showCursor={true}
            hideCursorWhileTyping={true}
            cursorCharacter="|"
            cursorBlinkDuration={0.8}
            textColors={["#ffffff"]}
            initialDelay={startTyping ? 0 : 1000}
            startOnVisible={false}
            variableSpeed={{ min: 60, max: 120 }}
            onSentenceComplete={(sentence, index) => {
              console.log(`Sentence ${index} completed: ${sentence}`);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DescriptionStage;
