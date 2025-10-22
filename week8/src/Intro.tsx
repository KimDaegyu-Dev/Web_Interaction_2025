import React from "react";
import { Link, useNavigate } from "react-router-dom";
import DecryptedText from "./components/DecryptedText";
import CurvedLoop from "./components/CurvedLoop";
import FadeContent from "./components/FadedContent";
import DecryptedCurvedLoop from "./components/DecryptedCurvedLoop";
const Intro: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-black text-white overflow-hidden w-screen h-screen fixed inset-0">
      <div className="z-3">
        {/* <h1 className="text-5xl font-bold -translate-y-10 text-center font-[FunflowSurvivor] text-amber-700/20">
          Welcome to Deconstructivism
        </h1> */}

        <div className="mt-1 text-nowrap text-center font-[FunflowSurvivor] text-xl text-gray-300">
          <DecryptedText
            text={`우리는 의미를 찾기 위해 끝없이 글자 조합을 시도한다`}
            animateOn="hover"
            revealDirection="start"
            speed={80}
            maxIterations={30}
            sequential
            useOriginalCharsOnly
          />
          <br />
          <DecryptedText
            text={`끝없는 조합 속에서 마침내 우리는 단 하나의 의미를 찾는다.`}
            animateOn="hover"
            revealDirection="start"
            speed={80}
            maxIterations={30}
            sequential
            useOriginalCharsOnly
          />
        </div>
        <h3 className="text-center font-[Noto Sans KR] text-xl text-gray-400/40">
          위의 설명에 마우스를 가져다대보세요
        </h3>

        <div className="flex justify-center items-center mt-20 translate-y-10 ">
          <Link
            to="/description"
            className="block text-xl font-semibold transition duration-300 px-8 py-4 bg-amber-700 hover:bg-amber-800 rounded-lg font-[Noto_Sans_KR]"
            style={{ padding: "8px 12px" }}
          >
            Start
          </Link>
        </div>
      </div>
      {Array.from({ length: 13 }).map((_, index) => (
        <div
          key={index}
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
