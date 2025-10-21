import React from "react";
import { useNavigate } from "react-router-dom";
import DecryptedText from "./components/DecryptedText";
import CurvedLoop from "./components/CurvedLoop";
import FadeContent from "./components/FadedContent";
import DecryptedCurvedLoop from "./components/DecryptedCurvedLoop";
const Intro: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/description");
  };

  return (
    <FadeContent
      blur={true}
      duration={1000}
      easing="ease-out"
      initialOpacity={100}
    >
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        {/* <CurvedLoop
          marqueeText="의미는 결코 도달되지 않고, 끊임없이 미끄러진다"
          speed={1}
          curveAmount={-300}
          interactive={false}
        /> */}
        <DecryptedCurvedLoop
          marqueeText="의미는 Différance 결코 Différance 도달되지 않고, 끊임없이 미끄러진다 * Différance"
          animateOn="both"
          speed={-0.5}
          curveAmount={-300}
          sequential
          revealDirection="start"
          useOriginalCharsOnly
          decryptSpeed={60}
          maxIterations={15}
        />
        <h1 className="text-5xl font-bold mb-8">
          Welcome to Hangul Segmentation
        </h1>
        <div className="mt-1 text-nowrap justify-self-end text-left">
          <DecryptedText
            text={`우리는 의미를 찾기 위해 끝없이 글자 조합을 시도한다`}
            animateOn="hover"
            revealDirection="start"
            speed={100}
            maxIterations={30}
            sequential
            useOriginalCharsOnly
          />
          <br />
          <DecryptedText
            text={`끝없는 조합 속에서 마침내 우리는 단 하나의 의미를 찾는다.`}
            animateOn="hover"
            revealDirection="start"
            speed={100}
            maxIterations={30}
            sequential
            useOriginalCharsOnly
          />
        </div>
        ;
        <button
          onClick={handleStart}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-semibold transition duration-300"
        >
          Start
        </button>
      </div>
    </FadeContent>
  );
};

export default Intro;
