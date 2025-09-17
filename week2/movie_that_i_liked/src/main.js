import "./style.css";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const imgs = [
  "./siksin.jpg",
  "./bgs/dumb-and-dumber.jpg",
  "./bgs/god-of-food.webp",
  "./bgs/kungfuhustle.jpg",
];
const musics = [
  "./musics/school_of_rock.mp3",
  "./musics/dumb-and-dumber.mp3",
  "./musics/god-of-food.mp3",
];
const titles = [
  "",
  "./titles/dumb-and-dumber-title.webp",
  "./titles/god-of-food-title.jpg",
  "./titles/kungfuhustle-title.webp",
];
const descriptions = [
  "식스센스는 1999년에 개봉한 미국의 심리 스릴러 영화로, M. 나이트 샤말란이 감독과 각본을 맡았다.",
  `영화 덤 앤 더머는 얼간이 친구 로이드와 해리가 잃어버린 가방을 돌려주기 위해 아스펜으로 떠나는 코믹 로드무비다.
돈가방을 발견한 뒤 얻게 된 부와 기회마저 허무하게 날려버리지만, 끝까지 순수한 두 사람의 엉뚱한 우정이 웃음과 아이러니를 남긴다.`,
  `영화 식신은 허세 가득한 요리 스타 주성치가 몰락 끝에 음식의 진심을 깨닫고, 소림사 수련과 요리 대결을 거쳐 성장하는 과정을 그린 코믹 요리 무협극이다.
패러디와 황당 개그가 넘치지만, 마지막에 선보이는 암연소혼반은 웃음 뒤에 남는 따뜻한 감동을 전한다.`,
  `
영화 쿵푸허슬은 삼류 건달 아성이 우연히 무림의 절대 고수로 각성해, 저롱성채를 지키기 위해 도끼파와 화운사신에 맞서는 과정을 그린 무협 코미디다.
만화 같은 액션과 기발한 개그, 그리고 성장 서사가 어우러져, 주성치 특유의 과장된 유머 속에서도 통쾌한 카타르시스를 전한다.
`,
];
const duration = [5, 6, 6, 6];
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
          nextIndex = 1;
          const allProgress = document.querySelectorAll("#carouselList > div");
          allProgress.forEach((prog, index) => {
            if (index !== 0) {
              prog.style.transform = "translateX(-100%)";
            }
          });
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
  const movieTitle = document.querySelector("#movieTitle");
  movieInfo.textContent = descriptions[index];
  movieTitle.src = titles[index];
  if (index === 0) {
    gsap.set(dimmed, { visibility: "hidden", opacity: 0 });
  } else {
    gsap.set(dimmed, { visibility: "visible" });
  }
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

function introAnimation() {
  const introText = document.querySelector("#introText");
  const intro = document.querySelector("#intro");
  const tl = gsap.timeline();
  tl.to(introText, {
    text: "내가 좋아하는 영화들",
    duration: duration[0] - 2,
    ease: "power4.inOut",
  })
    .fromTo(
      intro,
      {
        backgroundColor: "rgba(0,0,0,0.6)",
      },
      {
        backgroundColor: "rgba(0,0,0,0)",
        duration: duration[0],
        ease: "power4.Out",
      },
      "<"
    )
    .to(
      introText,
      {
        autoAlpha: 0,
        backgroundColor: "transparent",
        delay: 1,
      },
      ">-1"
    );
}
document.addEventListener("DOMContentLoaded", () => {
  const movieImgParent = document.querySelector("#movieImgParent");
  carouselInit();
  introAnimation();
  changeMovieImg(0);
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
