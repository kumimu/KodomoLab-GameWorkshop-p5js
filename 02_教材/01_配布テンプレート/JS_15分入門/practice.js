// まずは上の3行だけ変えてみよう！
let playerSize = 40;
let playerColor = "cyan";
let gameTitle = "わたしのゲーム";

function setup() {
  createCanvas(400, 260);
  textFont("sans-serif");
}

function draw() {
  background("black");
  noStroke();
  fill("white");
  textAlign(CENTER);
  textSize(24);
  text(gameTitle, 200, 55);
  fill(playerColor);
  circle(200, 150, playerSize);
}
