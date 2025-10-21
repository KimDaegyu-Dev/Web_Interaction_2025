import React, { useRef, useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { World } from "../pkg/game_of_life";
import { updateHangulSetOnWasm } from "./hangul";
import { getVideoStream, startMediaSource } from "./camera";
import { SelfieSegmentation, Results } from "@mediapipe/selfie_segmentation";
import { CELL_SIZE, frameDuration } from "./constants";
import { updateAndDrawWorld } from "./drawing";
import { initializeSelfieSegmentation } from "./segmentation";
import TextType from "./components/TextType";
import MetaBalls from "./components/MetaBalls";

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

  const [currentStage, setCurrentStage] = useState(-1);
  const [showVideo, setShowVideo] = useState(false);
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const [currentText, setCurrentText] = useState<string>(""); // 초기값 설정
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [startTyping, setStartTyping] = useState(false);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const stageTexts = [
    "우리는 텍스트로 세상을 이해하려 한다.\n수많은 기호의 얽힘 속에서, 우리는 하나의 의미를 찾는다.",
    "하지만 의미는 언제나 흩어진다.\n같은 문장도, 읽는 순간마다 다른 흔적을 남긴다.\n텍스트는 멈춰 있지 않다. 한 문장이 끝나는 자리에서,\n이미 또 다른 의미가 태어난다.",
    "우연히 맞닿은 기호들이, 잠시 하나의 생명을 이룬다.\n그 생명은 금세 사라지지만, 또 다른 조합으로 다시 태어난다.\n텍스트는 멈추지 않는다. 단지 형태를 바꿀 뿐이다.\n텍스트는 그렇게, 끝없이 자신을 다시 쓴다.",
    "무수한 조합 속에서, 당신은 어떤 의미를 읽어내고 있나요?\n이제, 당신의 텍스트를 남겨보세요.",
  ];

  // TextType duration 계산 함수
  const calculateTextTypeDuration = useCallback(
    (text: string, typingSpeed: number) => {
      const totalChars = text.length;
      // variableSpeed 평균값 사용 (min: 60, max: 120) => 평균 90
      const avgSpeed = typingSpeed || 90;
      const typingTime = totalChars * avgSpeed;
      const totalDuration = typingTime / 1000; // ms to seconds
      console.log(
        `Duration 계산: ${totalChars}글자, ${totalDuration.toFixed(2)}초`
      );
      return totalDuration;
    },
    []
  );

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

  // useGSAP으로 타임라인 생성
  useGSAP(
    () => {
      // DOM이 준비될 때까지 대기
      const subtitleElement = document.querySelector(".subtitle");
      if (!subtitleElement) {
        console.error(".subtitle element not found in DOM");
        return;
      }

      // 이미 타임라인이 실행 중이면 중단
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      console.log(".subtitle element found, creating timeline");
      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Stage 1: 텍스트만 표시 (영상 없음)
      const stage1Duration = calculateTextTypeDuration(stageTexts[0], 10);

      tl.to({}, { duration: 0.5 }) // 초기 지연
        .call(() => {
          console.log("Stage 1 시작");
          setCurrentStage(0);
          setCurrentText(stageTexts[0]);
          setShowSubtitle(true);
          setStartTyping(true);
        })
        .to(
          ".subtitle",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.1"
        )
        .call(() =>
          console.log(`Stage 1 타이핑 시작, duration: ${stage1Duration + 1}초`)
        )
        .to({}, { duration: stage1Duration + 1 }) // 타이핑 완료 대기
        .call(() => console.log("Stage 1 타이핑 완료, 페이드 아웃 시작"))
        .to(".subtitle", {
          opacity: 0,
          y: -50,
          duration: 0.8,
          ease: "power2.in",
        })
        .call(() => {
          console.log("Stage 1 종료");
          setStartTyping(false);
          setShowSubtitle(false);
        })
        .to({}, { duration: 1 }); // 페이드 아웃

      // Stage 2: 영상 시작, dimmed 배경, 한글 설정 변경
      const stage2Duration = calculateTextTypeDuration(stageTexts[1], 10);

      tl.call(() => {
        console.log("Stage 2 시작");
        setCurrentStage(1);
        setShowVideo(true);
        setCanvasOpacity(0);
        setCurrentText(stageTexts[1]);
        setShowSubtitle(true);
        setStartTyping(true);
      })
        .to(
          ".subtitle",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.1"
        )
        .to(
          {},
          {
            duration: 2,
            onUpdate: function () {
              const progress = this.progress();
              setCanvasOpacity(progress * 0.6); // opacity 0 -> 0.6
            },
          }
        )
        .call(() => {
          if (worldRef.current) {
            updateHangulSetOnWasm(worldRef.current, "의미는 흩어진다");
          }
        })
        .to({}, { duration: stage2Duration + 1 }) // 타이핑 완료 대기
        .to(".subtitle", {
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
      const stage3Duration = calculateTextTypeDuration(stageTexts[2], 10);

      tl.call(() => {
        setCurrentStage(2);
        setCurrentText(stageTexts[2]);
        setShowSubtitle(true);
        setStartTyping(true);
      })
        .to(
          ".subtitle",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.1"
        )
        .call(() => {
          if (worldRef.current) {
            updateHangulSetOnWasm(worldRef.current, "생명 태어남");
          }
        })
        .to({}, { duration: stage3Duration + 1 }) // 타이핑 완료 대기
        .to(".subtitle", {
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
      const stage4Duration = calculateTextTypeDuration(stageTexts[3], 10);

      tl.call(() => {
        setCurrentStage(3);
        setShowVideo(false);
        setCanvasOpacity(1);
        setCurrentText(stageTexts[3]);
        setShowSubtitle(true);
        setStartTyping(true);
      })
        .to(
          ".subtitle",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.1"
        )
        .to({}, { duration: stage4Duration + 1 }) // 타이핑 완료 대기
        .to(".subtitle", {
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

      // 타임라인 자동 시작
      tl.play();
    },
    { dependencies: [] }
  );

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
    };
  }, [setupDOMAndWorld]);

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
          console.log("Drawing world with segmentation mask");
          updateAndDrawWorld(
            worldRef.current,
            segmentationMaskRef.current,
            "random", // 고정 모드
            ctx,
            video,
            true // canvas에 비디오 배경과 한글 모두 그리기
          );
        }
      }
      animationFrameId.current = requestAnimationFrame(processFrame);
    };

    if (showVideo) {
      console.log("Starting frame processing, showVideo:", showVideo);
      if (isProcessingRef.current) {
        console.log("Processing already running, canceling old frame");
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      }
      isProcessingRef.current = true;
      animationFrameId.current = requestAnimationFrame(processFrame);
    } else {
      console.log("Stopping frame processing, showVideo:", showVideo);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isProcessingRef.current = false;
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isProcessingRef.current = false;
    };
  }, [showVideo]);

  // showVideo가 true가 될 때 영상 시작
  useEffect(() => {
    const startVideo = async () => {
      if (showVideo && videoRef.current) {
        console.log("Starting video playback...");
        try {
          await startMediaSource(
            videoRef.current,
            getVideoStream(videoRef.current)
          );
          console.log("Video playback started successfully");
        } catch (error) {
          console.error("Failed to start video:", error);
        }
      }
    };

    startVideo();
  }, [showVideo]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
      }}
    >
      {/* {(currentStage === 0 || currentStage === 3) && ( */}
      <MetaBalls
        color="#ffffff"
        cursorBallColor="#ffffff"
        cursorBallSize={1}
        ballCount={20}
        animationSize={20}
        enableMouseInteraction={true}
        enableTransparency={true}
        hoverSmoothness={0.05}
        clumpFactor={2}
        speed={0.1}
      />
      {/* )} */}
      <video
        ref={videoRef}
        id="inputVideo"
        playsInline
        muted
        style={{ display: "none" }}
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
          opacity: canvasOpacity,
          zIndex: 1,
          transition: "opacity 0.5s ease",
          display: showVideo ? "block" : "none",
        }}
      />

      <div
        ref={subtitleRef}
        className="subtitle"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          textAlign: "center",
          color: "white",
          fontSize: "28px",
          fontFamily: "Grandiflora One, sans-serif",
          maxWidth: "80%",
          lineHeight: 1.8,
          zIndex: 10,
          opacity: 0,
          visibility: "visible",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {currentStage >= 0 && currentText !== "" && (
          <TextType
            className="-translate-x-[50%] -translate-y-[50%]"
            key={`stage-${currentStage}`}
            text={currentText}
            typingSpeed={60}
            pauseDuration={0}
            deletingSpeed={30}
            loop={false}
            showCursor={false}
            hideCursorWhileTyping={true}
            textColors={["#ffffff"]}
            initialDelay={0}
            startOnVisible={false}
            variableSpeed={{ min: 8, max: 12 }}
            as="div"
            style={{ whiteSpace: "pre-line" }}
          />
        )}
      </div>
    </div>
  );
};

export default DescriptionStage;
