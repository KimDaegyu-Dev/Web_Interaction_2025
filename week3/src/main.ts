// 이미지 프리로드
const preloadImages = [
  "./placeholder/coffe_ph.svg",
  "./placeholder/macbook_ph.svg",
  "./placeholder/photoshop_ph.svg",
  "./placeholder/tear_ph.svg",
  "./imgs/background2x.png",
  "./imgs/door.png",
  "./imgs/fire.webp",
  "./things/번뇌의 흔적.png",
  "./things/생명 연장 수액.png",
  "./things/손목 통증 제조기.png",
  "./things/아마존 강의 눈물.png",
];
preloadImages.forEach((src) => {
  const img = new Image();
  img.src = src;
});
import JSZip from "jszip";

import "./style.css";
import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);
let leftDoor = document.querySelector("#left-door");
let rightDoor = document.querySelector("#right-door");
let background = document.querySelector("#background");
let input_placeholders = document.querySelector("#placeholder-inputs");
let tl = gsap.timeline();
const INTRO_DURATION = 3;
tl.to(leftDoor, {
  duration: INTRO_DURATION,
  xPercent: -100,
});
tl.to(
  rightDoor,
  {
    duration: INTRO_DURATION,
    xPercent: 100,
  },
  "<"
);
tl.fromTo(
  background,
  {
    backgroundSize: "105%",
  },
  {
    duration: 4,
    ease: "power1.out",
    backgroundSize: "120%",
  },
  "=>"
);
tl.fromTo(
  input_placeholders,
  {
    autoAlpha: 0,
  },
  {
    autoAlpha: 1,
  }
);

tl.pause();

// placeholder input 이벤트 처리
type PlaceholderInfo = {
  imgId: string;
  inputId: string;
  filenameId: string;
};
const placeholders: PlaceholderInfo[] = [
  {
    imgId: "ph-coffee",
    inputId: "input-coffee",
    filenameId: "filename-coffee",
  },
  {
    imgId: "ph-macbook",
    inputId: "input-macbook",
    filenameId: "filename-macbook",
  },
  {
    imgId: "ph-photoshop",
    inputId: "input-photoshop",
    filenameId: "filename-photoshop",
  },
  { imgId: "ph-tear", inputId: "input-tear", filenameId: "filename-tear" },
];

placeholders.forEach(({ imgId, inputId, filenameId }) => {
  const img = document.getElementById(imgId) as HTMLImageElement | null;
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  const filenameDiv = document.getElementById(
    filenameId
  ) as HTMLDivElement | null;
  if (!img || !input || !filenameDiv) return;
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        if (typeof ev.target?.result === "string") {
          img.src = ev.target.result;
          img.className = "w-[140px] h-[140px] object-scale-down object-bottom";
        }
      };
      reader.readAsDataURL(file);
      filenameDiv.textContent = file.name.split(".")[0];
      uploaded[inputId] = true;
      if (checkAllUploaded()) {
        let fire = document.querySelector("#fire");
        gsap.to(fire, {
          autoAlpha: 1,
        });
        // show
      }
    } else {
      filenameDiv.textContent = "";
      uploaded[inputId] = false;
    }
  });
});

// 업로드 상태 추적
const uploaded: Record<string, boolean> = {
  "input-coffee": false,
  "input-macbook": false,
  "input-photoshop": false,
  "input-tear": false,
};
let allUploaded = false;
function checkAllUploaded(): boolean {
  allUploaded = Object.values(uploaded).every(Boolean);
  return allUploaded;
}

const gods = [
  {
    name: "네트워크의 용신",
    msg: "너의 연결은 끊기지 않으리라.",
    effect: "🌊",
  },
  {
    name: "스토리지 산신",
    msg: "너의 기록은 오래 보존되리라.",
    effect: "🗻",
  },
  {
    name: "버그의 잡귀",
    msg: "이 파일에 흉운이 깃들었구나.",
    effect: "👻",
  },
  {
    name: "로그의 조상신",
    msg: "과거의 발자취가 드러난다.",
    effect: "📜",
  },
  {
    name: "픽셀의 불꽃신",
    msg: "너의 제물이 불꽃으로 승화한다!",
    effect: "🔥",
  },
];
function handleAllFilesUploaded() {
  const god = gods[Math.floor(Math.random() * gods.length)];
  alert(`${god.name} 등장!\n「${god.msg}」`);
}

window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    if (allUploaded) {
      handleAllFilesUploaded();
    }
  }
});

// 이미지 다운
const placeholderFiles = [
  { name: "번뇌의 흔적.png", path: "./things/번뇌의 흔적.png" },
  { name: "생명 연장 수액.png", path: "./things/생명 연장 수액.png" },
  {
    name: "손목 통증 제조기.png",
    path: "./things/손목 통증 제조기.png",
  },
  {
    name: "아마존 강의 눈물.png",
    path: "./things/아마존 강의 눈물.png",
  },
];

let startButton = document.querySelector("#download-placeholders");

async function downloadPlaceholdersZip() {
  const zip = new JSZip();
  gsap.to(startButton, {
    autoAlpha: 0,
  });
  tl.play();
  for (const file of placeholderFiles) {
    const response = await fetch(file.path);
    const blob = await response.blob();
    zip.file(file.name, blob);
  }
  const content = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = "공물.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

startButton?.addEventListener("click", downloadPlaceholdersZip);
