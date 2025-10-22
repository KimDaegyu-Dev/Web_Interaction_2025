import React, { useRef } from "react";

interface ScreenshotButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isProcessing?: boolean;
}

const ScreenshotButton: React.FC<ScreenshotButtonProps> = ({
  canvasRef,
  isProcessing = false,
}) => {
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const handleScreenshot = () => {
    console.log("Screenshot button clicked");
    console.log("canvasRef:", canvasRef);
    console.log("canvasRef.current:", canvasRef.current);

    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("Canvas not found");
      return;
    }

    // canvas가 실제로 그려진 내용이 있는지 확인
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.log("Canvas context not found");
      return;
    }

    // canvas의 실제 크기 확인

    // canvas의 내용을 확인하기 위해 ImageData 가져오기
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 배경 영상이 없어도 한글이 그려져 있을 수 있으므로,
    // RGB 채널 중 하나라도 0이 아닌 값이 있으면 내용이 있다고 판단
    const hasContent = imageData.data.some((value, index) => {
      // alpha 채널이 아닌 RGB 채널만 확인 (index % 4 !== 3)
      return index % 4 !== 3 && value > 0;
    });

    if (!hasContent) {
      console.log("Canvas appears to be empty");
      return;
    }

    // canvas를 이미지로 변환
    const dataURL = canvas.toDataURL("image/png");

    // 다운로드 링크 생성
    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = dataURL;
      downloadLinkRef.current.download = `game-of-life-${new Date().getTime()}.png`;
      downloadLinkRef.current.click();
    }
  };

  return (
    <>
      <button
        onClick={handleScreenshot}
        className="w-full bg-amber-700"
        disabled={!isProcessing}
      >
        의미 찾아보기
      </button>
      <a
        ref={downloadLinkRef}
        style={{ display: "none" }}
        download="screenshot.png"
      />
    </>
  );
};

export default ScreenshotButton;
