// =====================================
// 自分だけの避けゲー
// 開始画面・難易度選択・終了画面つき
// =====================================

// ===== CUSTOM AREA：まずはここを改造しよう！ =====
let playerColor = "cyan";
let enemyColor = "red";
let backgroundColor = "black";

let playerSize = 40;
let enemySize = 35;
let playerSpeed = 7;

let gameTitle = "隕石をよけろ！";
// ================================================

let gameState = "start"; // start / play / end
let playerX;
let playerY;
let enemies = [];

let difficultyName = "";
let enemySpeed = 4;
let enemyCount = 1;
let clearTime = 30;

let startTime = 0;
let score = 0;
let resultText = "";

function setup() {
  createCanvas(600, 400);
  textFont("sans-serif");
}

function draw() {
  background(backgroundColor);

  if (gameState === "start") {
    showStartScreen();
  } else if (gameState === "play") {
    playGame();
  } else if (gameState === "end") {
    showEndScreen();
  }
}

function showStartScreen() {
  fill("white");
  textAlign(CENTER);

  textSize(36);
  text(gameTitle, width / 2, 75);

  textSize(22);
  text("難易度を選んでスタート！", width / 2, 135);

  textSize(20);
  text("1：かんたん　30秒・敵1個", width / 2, 190);
  text("2：ふつう　　45秒・敵2個", width / 2, 230);
  text("3：むずかしい 60秒・敵3個", width / 2, 270);

  textSize(16);
  text("ゲーム中は ← → キーで移動", width / 2, 330);
}

function startGame(level) {
  if (level === 1) {
    difficultyName = "かんたん";
    enemySpeed = 4;
    enemyCount = 1;
    clearTime = 30;
  } else if (level === 2) {
    difficultyName = "ふつう";
    enemySpeed = 6;
    enemyCount = 2;
    clearTime = 45;
  } else {
    difficultyName = "むずかしい";
    enemySpeed = 8;
    enemyCount = 3;
    clearTime = 60;
  }

  playerX = width / 2;
  playerY = height - 55;
  score = 0;
  startTime = millis();
  resultText = "";
  enemies = [];

  for (let i = 0; i < enemyCount; i++) {
    enemies.push({
      x: random(enemySize, width - enemySize),
      y: random(-300, -50),
      speed: enemySpeed + random(0, 2)
    });
  }

  gameState = "play";
}

function playGame() {
  const elapsed = floor((millis() - startTime) / 1000);
  const remaining = clearTime - elapsed;

  if (remaining <= 0) {
    resultText = "CLEAR!";
    gameState = "end";
    return;
  }

  drawGameInfo(remaining);
  movePlayer();
  drawPlayer();

  for (const enemy of enemies) {
    moveEnemy(enemy);
    drawEnemy(enemy);

    if (isHit(enemy)) {
      resultText = "GAME OVER";
      gameState = "end";
      return;
    }
  }
}

function drawGameInfo(remaining) {
  fill("white");
  textAlign(LEFT);
  textSize(18);
  text("難易度: " + difficultyName, 20, 28);
  text("残り時間: " + remaining, 20, 52);
  text("SCORE: " + score, 20, 76);
}

function movePlayer() {
  if (keyIsDown(LEFT_ARROW)) playerX -= playerSpeed;
  if (keyIsDown(RIGHT_ARROW)) playerX += playerSpeed;

  playerX = constrain(
    playerX,
    playerSize / 2,
    width - playerSize / 2
  );
}

function moveEnemy(enemy) {
  enemy.y += enemy.speed;

  if (enemy.y > height + enemySize) {
    enemy.y = random(-300, -50);
    enemy.x = random(enemySize, width - enemySize);
    enemy.speed = enemySpeed + random(0, 2);
    score += 1;
  }
}

function isHit(enemy) {
  const distance = dist(playerX, playerY, enemy.x, enemy.y);
  return distance < playerSize / 2 + enemySize / 2;
}

function drawPlayer() {
  fill(playerColor);
  noStroke();
  triangle(
    playerX, playerY - playerSize / 2,
    playerX - playerSize / 2, playerY + playerSize / 2,
    playerX + playerSize / 2, playerY + playerSize / 2
  );
}

function drawEnemy(enemy) {
  fill(enemyColor);
  noStroke();
  circle(enemy.x, enemy.y, enemySize);
}

function showEndScreen() {
  fill("white");
  textAlign(CENTER);

  textSize(42);
  text(resultText, width / 2, 125);

  textSize(24);
  text("難易度: " + difficultyName, width / 2, 185);
  text("SCORE: " + score, width / 2, 220);

  textSize(18);
  text("スペースキーで開始画面へ", width / 2, 285);
}

function keyPressed() {
  if (gameState === "start") {
    if (key === "1") startGame(1);
    if (key === "2") startGame(2);
    if (key === "3") startGame(3);
  } else if (gameState === "end" && key === " ") {
    gameState = "start";
  }
}
