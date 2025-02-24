let shapes = [];
let numShapes = 90; // 항상 같은 개수 유지 (각 3개씩)
let shapeTypes = ["✂️", "🪨", "📄"];
let boxSize = 700;

function setup() {
  createCanvas(boxSize, boxSize); // 캔버스 생성
  
  // 초기 위치 설정 (각 타입별로 좀 더 넓게 퍼지도록 배치)
  let startPositions = [
    { x: width * 0.2, y: height * 0.2 }, // ✂️ 그룹 위치
    { x: width * 0.8, y: height * 0.2 }, // 🪨 그룹 위치
    { x: width * 0.5, y: height * 0.8 }  // 📄 그룹 위치
  ];
  
  // 각 그룹당 같은 개수 배치 (좀 더 넓게 퍼지도록 오프셋 증가)
  for (let i = 0; i < shapeTypes.length; i++) {
    for (let j = 0; j < numShapes / shapeTypes.length; j++) {
      let xOffset = random(-50, 50);
      let yOffset = random(-50, 50);
      shapes.push(new MovingShape(startPositions[i].x + xOffset, startPositions[i].y + yOffset, shapeTypes[i]));
    }
  }
}

function draw() {
  background(220); // 배경 설정
  rect(0, 0, boxSize, boxSize); // 박스 영역 그리기
  
  for (let shape of shapes) {
    shape.move(); // 이동 처리
    shape.checkCollisions(); // 충돌 체크
    shape.display(); // 화면에 표시
  }
}

class MovingShape {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.size = 40;
    // 속도를 느리게 조정
    this.vx = random(0.5, 1.5) * (random() > 0.5 ? 1 : -1);
    this.vy = random(0.5, 1.5) * (random() > 0.5 ? 1 : -1);
    this.type = type; // 가위, 바위, 보 타입 지정
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    
    // 벽에 닿으면 반대로 튕김
    if (this.x <= 0 || this.x >= width - this.size) {
      this.vx *= -1;
      this.x = constrain(this.x, 0, width - this.size);
    }
    if (this.y <= 0 || this.y >= height - this.size) {
      this.vy *= -1;
      this.y = constrain(this.y, 0, height - this.size);
    }
  }

  checkCollisions() {
    for (let other of shapes) {
      if (other !== this && dist(this.x, this.y, other.x, other.y) < this.size) {
        this.resolveCollision(other);
      }
    }
  }

  resolveCollision(other) {
    // 가위 바위 보 규칙 적용
    if (this.type === "✂️" && other.type === "🪨") {
      this.type = "🪨"; // 가위 -> 바위
    } else if (this.type === "🪨" && other.type === "📄") {
      this.type = "📄"; // 바위 -> 보
    } else if (this.type === "📄" && other.type === "✂️") {
      this.type = "✂️"; // 보 -> 가위
    }
  }

  display() {
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text(this.type, this.x + this.size / 2, this.y + this.size / 2); // 화면에 출력
  }
}
