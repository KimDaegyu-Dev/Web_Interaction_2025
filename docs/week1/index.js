// 랜덤 rect 데이터 생성 함수
function generateData(count) {
  const data = [];
  let base = 300;

  for (let i = 0; i < count; i++) {
    const change = Math.floor(Math.random() * 40 - 20);
    base = Math.max(50, Math.min(450, base + change)); // 범위 제한 (50~450)

    const height = Math.floor(Math.random() * 100) + 50;
    const y = base - height;
    const color = Math.random() > 0.5 ? "red" : "blue";
    data.push({
      x: i * 40 + 20, // 막대 간격
      y,
      width: 20,
      height,
      color,
    });
  }
  return data;
}

// 주식 차트 그리기 함수
function drawChartRects(data) {
  const svg = document.querySelector("#svg");
  svg.innerHTML = ""; // 초기화

  data.forEach((d) => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", d.x);
    rect.setAttribute("y", d.y);
    rect.setAttribute("width", d.width);
    rect.setAttribute("height", d.height);

    // 랜덤 색상
    rect.setAttribute("fill", d.color);

    svg.appendChild(rect);
  });
}

function calculateChange(data, desire, prevDesire) {
  const lastData = data[data.length - 1];

  // 마지막 차트 데이터의 중심값
  const lastCenter = lastData.y + lastData.height / 2;

  const average =
    data.reduce((acc, curr, index) => acc + (curr.y + curr.height), 0) /
    data.length;

  // 평균에서 얼마나 멀리 있는지
  const extremeness = Math.abs(lastCenter - average) / average;

  // desire의 변화량
  const deltaDesire = desire - prevDesire;
  const isHighExtreme = lastCenter > average;

  let change = 0;

  if (isHighExtreme) {
    // 높은 극단값
    if (deltaDesire > 0) {
      // desire가 증가 → 유지 혹은 더 높아짐
      change = Math.random() * extremeness * (desire / 100);
    } else if (deltaDesire <= 0) {
      // desire가 줄거나 그대로 → 값이 떨어짐
      change = -Math.random() * extremeness * (1 - deltaDesire / 100);
    }
  } else {
    // 낮은 극단값
    if (deltaDesire > 0) {
      // desire가 증가 → 올라감
      change = Math.random() * extremeness * (desire / 100);
    } else if (deltaDesire <= 0) {
      // desire가 줄거나 그대로 → 유지 또는 더 떨어짐
      change = -Math.random() * 100 * extremeness * (1 - deltaDesire / 100);
    }
  }

  // 클리핑
  if (change > 1) change = 1;
  if (change < -1) change = -1;

  return change;
}
// 간절함 계산 함수
function calculateDesire(change) {
  let emotion = "";
  let text = "";
  if (change > 0.7 && change <= 1) {
    emotion = "best";
    text = "매우 간절한 상태입니다";
  }
  if (change > 0.5 && change < 0.7) {
    emotion = "good";
    text = "간절한 상태입니다";
  }
  if (change > 0.3 && change < 0.5) {
    emotion = "good";
    text = "살짝 간절함입니다";
  }
  if (change > -0.3 && change < 0.3) {
    emotion = "soso";
    text = "방심한 상태입니다";
  }
  if (change < -0.3 && change > -0.5) {
    emotion = "soso";
    text = "살짝 방심한 상태입니다";
  }
  if (change < -0.5 && change > -0.7) {
    emotion = "bad";
    text = "간절하지 않은 상태입니다";
  }
  if (change < -0.7 && change >= -1) {
    emotion = "worst";
    text = "전혀 간절하지 않은 상태입니다";
  }
  return { emotion, text };
}

// 입력값 읽기
function getInputValues() {
  return Number(document.querySelector("#input").value) === 0
    ? 10
    : Number(document.querySelector("#input").value);
}

// svg 관리 함수
function manageSvg(data) {
  const svg = document.querySelector("#svg");
  // svg 크기 관리
  svg.setAttribute("width", data.length * 40 + 20);
  svg.setAttribute(
    "height",
    data.reduce((acc, curr) => Math.max(acc, curr.y + curr.height), 0)
  );
}

function main() {
  const inputButton = document.querySelector("#inputButton");
  const chartData = generateData(20); // 20개의 막대
  let prevDesire = 0;
  drawChartRects(chartData);
  manageSvg(chartData);

  inputButton.addEventListener("click", () => {
    const desire = getInputValues();
    const change = calculateChange(chartData, desire, prevDesire);

    const lastData = chartData[chartData.length - 1];
    const lastCenter = lastData.y + lastData.height / 2;
    // 새로운 높이와 위치
    const nextHeight = Math.max(20, lastData.height + change * 10);
    const nextY = Math.max(0, lastData.y - change * 100 + 50);
    const isRed = lastCenter > nextY + nextHeight / 2;

    chartData.push({
      x: lastData.x + 40,
      y: nextY,
      width: 20,
      height: nextHeight,
      color: isRed ? "red" : "blue",
    });
    const { emotion, text } = calculateDesire(change);
    document.querySelector("#resultContainer").innerHTML = `
      <h3>결과</h3>
      <img src="assets/${emotion}.jpg" alt="간절함 이미지"  style="width: 400px; height: 400px; object-fit: cover;"/>
      <p>간절한 정도: ${text}</p>
      <p>간절함 변화량: ${desire - prevDesire}</p>
    `;

    drawChartRects(chartData);
    manageSvg(chartData);
    prevDesire = desire;
  });
}

main();
