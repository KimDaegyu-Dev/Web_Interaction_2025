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
    <div className="flex flex-col items-center justify-center bg-black text-white overflow-hidden w-screen h-screen fixed inset-0">
      <div className="z-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-5xl font-bold -translate-y-10 text-center">
          Welcome to Deconstructivism
        </h1>
        <div className="mt-1 text-nowrap text-center">
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

        <div className="flex justify-center mt-10 translate-y-10">
          <button
            onClick={handleStart}
            className="px-12 py-8 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-semibold transition duration-300"
          >
            Start
          </button>
        </div>
      </div>
      {Array.from({ length: 13 }).map((_, index) => (
        <div
          className={`w-full h-full absolute`}
          style={{
            transform: `translateY(${-8 * index}rem)`,
            top: `50rem`,
          }}
        >
          <DecryptedCurvedLoop
            marqueeText="하지만 의미는 결코 도달되지 않고, 끊임없이 Différance 미끄러진다"
            animateOn="always"
            speed={index % 5 === 0 ? 0.15 : -0.05}
            curveAmount={-100}
            revealDirection={index % 3 === 0 ? "start" : "end"}
            sequential
            useOriginalCharsOnly
            decryptSpeed={200 * (Math.floor(index / 5) + 1)}
          />
        </div>
      ))}
    </div>
  );
};

export default Intro;
