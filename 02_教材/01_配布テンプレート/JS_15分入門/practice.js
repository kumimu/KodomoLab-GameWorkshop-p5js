// まずは上の3行だけ変えてみよう！
let playerSize = 40;
let playerColor = "cyan";
let gameTitle = "わたしのゲーム";

// ===== このファイルで使う関数・用語の早見表 =====
// 必要な名前を探し、次の行のURLから詳しい説明を確認できます。
// p5.js 1.x 公式リファレンス：https://v1.p5js.org/reference/
//
// 【p5.jsが用意する関数】
// createCanvas(幅, 高さ)：描画する画面を作る。
// https://v1.p5js.org/reference/p5/createCanvas/
// background(色)：背景を塗り直す。
// https://v1.p5js.org/reference/p5/background/
// fill(色)：この後に描く図形や文字の塗り色を決める。
// https://v1.p5js.org/reference/p5/fill/
// noStroke()：図形の輪郭線を描かない設定にする。
// https://v1.p5js.org/reference/p5/noStroke/
// circle(x, y, 直径)：中心(x, y)に円を描く。
// https://v1.p5js.org/reference/p5/circle/
// text(文字, x, y)：指定した位置に文字を描く。
// https://v1.p5js.org/reference/p5/text/
// textFont(フォント名)：文字の書体を決める。
// https://v1.p5js.org/reference/p5/textFont/
// textSize(大きさ)：文字の大きさを決める。
// https://v1.p5js.org/reference/p5/textSize/
// textAlign(横, 縦)：文字を配置する基準を決める。CENTERは中央、LEFTは左。
// https://v1.p5js.org/reference/p5/textAlign/
//
// 【p5.jsが呼び出す入口：中身はこのコードに書く】
// setup()：p5.jsが最初に1回呼ぶ。画面などを準備する。
// https://v1.p5js.org/reference/p5/setup/
// draw()：p5.jsが繰り返し呼ぶ。移動の計算や描画を進める。
// https://v1.p5js.org/reference/p5/draw/
// CENTER：文字の配置の基準を表す定数。
// https://v1.p5js.org/reference/p5/textAlign/
// ===== 早見表ここまで =====

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
