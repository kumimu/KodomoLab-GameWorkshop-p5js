// まずは上の3行だけ変えてみよう！
let playerSize = 40;
// 色を変えるときは、" " の中を好きな色の名前に変えます。例は "yellow"（黄色）です。
// 色の見本と名前：https://docodoor.co.jp/staffblog/html60/
let playerColor = "cyan";
let gameTitle = "わたしのゲーム";

// p5.jsは、円や文字を画面に描くときに使う道具です。
// 円を描く circle など、p5.jsの道具の使い方はここで調べられます。
// https://v1.p5js.org/reference/

// 【役割】最初に1回、円を表示する練習用の画面と文字の設定を用意します。
function setup() {
  createCanvas(400, 260);
  textFont("sans-serif");
}

// 【役割】背景・タイトル・円を繰り返し描き、練習で変えた値を画面に反映します。
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
