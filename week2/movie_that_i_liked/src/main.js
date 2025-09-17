import "./style.css";
import { gsap } from "gsap";
const imgs = ["./kungfuhustle.jpg", "./siksin.jpg", "./kungfuhustle.jpg"];
const musics = [
  "./musics/school_of_rock.mp3",
  "./musics/school_of_rock.mp3",
  "./musics/school_of_rock.mp3",
];
const titles = ["식스센스", "쿵푸허슬", "식스센스"];
const descriptions = [
  "식스센스는 1999년에 개봉한 미국의 심리 스릴러 영화로, M. 나이트 샤말란이 감독과 각본을 맡았다.",
  "쿵푸 허슬은 2004년에 개봉한 홍콩의 액션 코미디 영화로, 스티븐 차우가 감독과 주연을 맡았다.",
  "식스센스는 1999년에 개봉한 미국의 심리 스릴러 영화로, M. 나이트 샤말란이 감독과 각본을 맡았다.",
];
const duration = [2, 6, 6];
function carouselInit() {
  const carouselProgress = document.querySelector("#carouselProgress");
  const bgm = document.querySelector("#bgm");
  bgm.src = musics[0];
  bgm.pause();

  const currentIndex = 0;
  imgs.forEach((_, index) => {
    const carouselList = document.createElement("div");
    carouselList.id = "carouselList";
    carouselList.dataset.index = index;
    carouselList.className =
      "flex h-19 w-20 bg-gray-600/70 relative overflow-hidden";

    const img = document.createElement("img");
    img.draggable = false;
    img.src = "./film.svg";
    img.className =
      "h-20 w-20 overflow-hidden absolute object-cover left-0 -top-[1px] z-200";
    const progress = document.createElement("div");
    progress.className =
      "h-full w-full bg-white z-10 translate-x-[-100%] z-100";
    carouselList.appendChild(progress);
    carouselList.appendChild(img);
    carouselProgress.appendChild(carouselList);
  });
  animateCarouselList(currentIndex);
}
let currentAnimation = null;
function updateCarousel(index) {
  const customEvent = new CustomEvent("indexChanged", {
    detail: { index: index },
  });
  document.dispatchEvent(customEvent);
}
function animateCarouselList(index) {
  const currentList = document.querySelector(
    `#carouselList[data-index='${index}']`
  );
  const progress = currentList.firstChild;
  const animation = gsap.fromTo(
    progress,
    { xPercent: 0 },
    {
      ease: "none",
      xPercent: 100,
      duration: duration[index],
      onComplete: () => {
        let nextIndex = index + 1;
        if (nextIndex >= imgs.length) {
          nextIndex = 0;
          const allProgress = document.querySelectorAll("#carouselList > div");
          allProgress.forEach((prog) => {
            prog.style.transform = "translateX(-100%)";
          });
          progress.style.transform = "translateX(-100%)";
        }
        updateCarousel(nextIndex);
      },
    }
  );
  const carouselProgress = document.querySelector("#carouselProgress");
  const playBtn = document.querySelector("#playBtn");

  currentAnimation = animation;

  return animation;
}

document.addEventListener("mousedown", () => {
  currentAnimation.paused(true);
  playBtn.textContent = "감상 중...";
});
document.addEventListener("mouseup", () => {
  currentAnimation.paused(false);
  playBtn.textContent = "넘어가는 중...";
});
function changeMovieImg(index) {
  const movieImg = document.querySelector("#movieImg");
  movieImg.src = imgs[index];
  const dimmed = document.querySelector("#dimmed");
  const movieInfo = document.querySelector("#movieInfo");
  movieInfo.textContent = descriptions[index];
  gsap.fromTo(
    dimmed,
    { opacity: 0.2, y: 100 },
    { opacity: 1, duration: 1, y: 0 }
  );
}

let isMuted = true;
function bgmPlayer() {
  const bgm = document.querySelector("#bgm");
  const muteBtn = document.querySelector("#muteBtn");
  // const muteAnimation = gsap.to(muteBtn, {
  //   rotation: -20,
  //   duration: 0.5,
  //   yoyo: true,
  //   repeat: -1,
  // });
  const playAnimation = gsap.to(muteBtn, {
    scale: 1.05,
    duration: 0.2,
    yoyo: true,
    repeat: -1,
    paused: true,
  });
  muteBtn.onclick = () => {
    if (bgm.paused && isMuted) {
      bgm.play();
      muteBtn.src = "./speaker-on.svg";
      isMuted = false;
      playAnimation.play();
    } else {
      bgm.pause();
      muteBtn.src = "./speaker-off.svg";
      isMuted = true;
      playAnimation.pause(0);
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const movieImgParent = document.querySelector("#movieImgParent");
  carouselInit();
  bgmPlayer();
});

document.addEventListener("indexChanged", (e) => {
  const index = e.detail.index;
  const bgm = document.querySelector("#bgm");
  bgm.src = musics[index];
  isMuted ? bgm.pause() : bgm.play();
  animateCarouselList(index);
  changeMovieImg(index);
  console.log(e);
});
