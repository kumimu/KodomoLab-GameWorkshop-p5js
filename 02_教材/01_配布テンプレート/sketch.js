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
// 応用課題を呼び出す共通の仕組み。課題コードは末尾の枠に貼ります。
const workshopOptions = new Map();

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
// triangle(x1, y1, x2, y2, x3, y3)：3つの頂点を指定して三角形を描く。
// https://v1.p5js.org/reference/p5/triangle/
// text(文字, x, y)：指定した位置に文字を描く。
// https://v1.p5js.org/reference/p5/text/
// textFont(フォント名)：文字の書体を決める。
// https://v1.p5js.org/reference/p5/textFont/
// textSize(大きさ)：文字の大きさを決める。
// https://v1.p5js.org/reference/p5/textSize/
// textAlign(横, 縦)：文字を配置する基準を決める。CENTERは中央、LEFTは左。
// https://v1.p5js.org/reference/p5/textAlign/
// millis()：スケッチ開始からの経過時間をミリ秒で得る。1000ミリ秒で1秒。
// https://v1.p5js.org/reference/p5/millis/
// floor(数)：その数以下の最大の整数にする。例：1.8 → 1。
// https://v1.p5js.org/reference/p5/floor/
// random(下限, 上限)：範囲内の乱数を得る。上限は含まない。引数なしでは0以上1未満。
// https://v1.p5js.org/reference/p5/random/
// dist(x1, y1, x2, y2)：2点の間の距離を求める。
// https://v1.p5js.org/reference/p5/dist/
// constrain(値, 下限, 上限)：値を指定した範囲内に収める。
// https://v1.p5js.org/reference/p5/constrain/
// keyIsDown(キー番号)：そのキーを押している間はtrueを返す。
// https://v1.p5js.org/reference/p5/keyIsDown/
//
// 【p5.jsが呼び出す入口：中身はこのコードに書く】
// setup()：p5.jsが最初に1回呼ぶ。画面などを準備する。
// https://v1.p5js.org/reference/p5/setup/
// draw()：p5.jsが繰り返し呼ぶ。移動の計算や描画を進める。
// https://v1.p5js.org/reference/p5/draw/
// keyPressed()：キーを押したときにp5.jsが呼ぶ。
// https://v1.p5js.org/reference/p5/keyPressed/
//
// 【p5.jsが用意する値：関数ではないので()を付けない】
// width：描画する画面の幅。
// https://v1.p5js.org/reference/p5/width/
// height：描画する画面の高さ。
// https://v1.p5js.org/reference/p5/height/
// key：直近に押されたキーの文字。
// https://v1.p5js.org/reference/p5/key/
// LEFT_ARROW / RIGHT_ARROW：左右の矢印キーを表す定数。
// https://v1.p5js.org/reference/p5/keyIsDown/
// CENTER / LEFT：文字の配置の基準を表す定数。
// https://v1.p5js.org/reference/p5/textAlign/
//
// 【JavaScript標準の機能：p5.jsとは別】
// 配列.push(値)：一覧の末尾に値を追加する。描画設定のpush()とは別の機能。
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/push
// 配列.sort()：要素を並べ替える。この教材では課題IDの順を揃える。
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
// 関数.apply(対象, 引数の一覧)：thisに対象を指定して関数を呼ぶ。課題ごとのデータを使う。
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
// new Map() / set() / get() / keys()：IDと機能を組にして保存・取得・列挙する。
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map
// ===== 早見表ここまで =====

// 【役割】最初に1回、ゲームの画面と文字の設定を用意します。
function setup() {
  createCanvas(600, 400);
  textFont("sans-serif");
}

// 【役割】画面を繰り返し描き直し、開始・プレイ・終了の状態に合う処理を呼びます。
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

// 【役割】タイトルと難易度ごとの内容、開始キーの案内を表示します。
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

// 【役割】選んだ難易度を設定し、自機・敵・得点・時間・追加機能を初期化して始めます。
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
      speed: enemySpeed + random(0, 2),
    });
  }

  runOption("start");
  for (const enemy of enemies) {
    runOption("spawnEnemy", enemy);
  }
  gameState = "play";
}

// 【役割】残り時間、自機と敵の移動、描画、当たり判定、追加機能を順に処理します。
function playGame() {
  const elapsed = floor((millis() - startTime) / 1000);
  const remaining = clearTime - elapsed;
  if (remaining <= 0) {
    resultText = "CLEAR!";
    gameState = "end";
    return;
  }

  movePlayer();
  // Bの弾移動、Gの音の時刻、Mのコンボ期限などを、各update関数で確かめます。
  runOption("update"); // 選んだ機能を更新します。未選択なら何もしません。
  drawGameInfo(remaining);
  drawPlayer();
  // Bなどのdraw関数を呼び、追加した弾を画面へ描きます。
  runOption("draw");
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

// 【役割】難易度・得点・残り時間と、追加機能の情報を表示します。
function drawGameInfo(remaining) {
  fill("white");
  textAlign(LEFT);
  textSize(18);
  text("難易度: " + difficultyName, 20, 28);
  text("残り時間: " + remaining, 20, 52);
  text("SCORE: " + score, 20, 76);
  runOption("drawInfo");
}

// 【役割】左右キーに合わせて自機を動かし、画面の端で止めます。
function movePlayer() {
  if (keyIsDown(LEFT_ARROW)) {
    playerX -= playerSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    playerX += playerSpeed;
  }

  playerX = constrain(playerX, playerSize / 2, width - playerSize / 2);
}

// 【役割】敵1体を下へ動かし、下まで避けたら得点と再登場を処理します。
function moveEnemy(enemy) {
  // Aの① 本体から追加機能へ「この敵は何倍の速さ？」と聞きます。
  const multiplier = runOption("speedMultiplier", enemy);
  // Aの③ 返ってきた倍率を元の速さに掛けます。返事がなければ1倍です。
  enemy.y += enemy.speed * (multiplier === undefined ? 1 : multiplier);
  if (enemy.y > height + enemySize) {
    // 応用側で得点を計算した場合は、標準の1点を重ねて加えません。
    // Mがtrue（計算済み）を返したら、標準の1点は重ねて足しません。
    if (runOption("avoid", enemy) !== true) {
      score += 1;
    }
    respawnEnemy(enemy);
  }
}

// 【役割】自機と敵の中心の距離を調べ、当たっていればtrueを返します。
function isHit(enemy) {
  const distance = dist(playerX, playerY, enemy.x, enemy.y);
  return distance < playerSize / 2 + enemySize / 2;
}

// 【役割】追加の光などを描いた後、自機を設定した色の三角形で描きます。
function drawPlayer() {
  // Hなどへ「自機を描く直前です」と伝え、光を先に描きます。
  runOption("beforePlayer");
  fill(playerColor);
  noStroke();
  triangle(
    playerX,
    playerY - playerSize / 2,
    playerX - playerSize / 2,
    playerY + playerSize / 2,
    playerX + playerSize / 2,
    playerY + playerSize / 2,
  );
}

// 【役割】追加機能の形を使うか判断し、指定がなければ敵を円で描きます。
function drawEnemy(enemy) {
  // Hがtrue（描画済み）を返したら、下にある通常の円は描きません。
  if (runOption("drawEnemy", enemy) === true) {
    return;
  }
  fill(optionEnemyColor(enemy));
  noStroke();
  circle(enemy.x, enemy.y, enemySize);
}

// 【役割】クリア／ゲームオーバーの結果、得点、開始画面への戻り方を表示します。
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

// 【役割】難易度の選択や結果画面からの戻りを処理し、追加機能にもキーを渡します。
function keyPressed() {
  if (gameState === "start") {
    if (key === "1") {
      startGame(1);
    }
    if (key === "2") {
      startGame(2);
    }
    if (key === "3") {
      startGame(3);
    }
  } else if (gameState === "end" && key === " ") {
    gameState = "start";
  }
  // BやGへ押したキーを伝えます。各機能のkey関数が呼ばれます。
  runOption("key", key);
  return false;
}

// 課題IDごとに機能を登録する共通の窓口です。
// 課題ごとのIDで登録。同じ課題を再度貼っても、二重に実行しません。
// 【役割】課題IDごとに機能を登録します。同じIDを再登録した場合は最後の内容に置き換わります。
function registerWorkshopOption(id, option) {
  workshopOptions.set(id, option);
}

// 【役割】登録済みの各機能から、指定された名前の処理を順番に呼び出します。
function runOption(name, ...args) {
  let result;
  let infoRow = 0;
  // 貼った順番が違っても、組み合わせた結果を揃えます。
  for (const id of [...workshopOptions.keys()].sort()) {
    const option = workshopOptions.get(id);
    // 名前で関数を探します。例：nameがspeedMultiplierなら、Aの同名関数です。
    const action = option[name];
    if (typeof action !== "function") {
      continue;
    }
    const callArgs = name === "drawInfo" ? [100 + 24 * infoRow++] : args;
    // 見つけた関数へ敵やキーを渡して実行し、返ってきた答えを受け取ります。
    const value = action.apply(option, callArgs);
    if (name === "speedMultiplier" && typeof value === "number") {
      result = (result === undefined ? 1 : result) * value;
    } else if (name === "avoid" || name === "drawEnemy") {
      result = result === true || value === true;
    } else if (value !== undefined) {
      result = value;
    }
  }
  return result;
}

// 色と形を分け、敵の多様化・スコア・回転を同時に使えます。
// 【役割】追加機能が選んだ敵の色を返し、指定がなければ基本の敵の色を使います。
function optionEnemyColor(enemy) {
  const chosen = runOption("enemyColor", enemy);
  return chosen === undefined ? enemyColor : chosen;
}

// 敵を消し切らず、画面上からもう一度登場させます。
// 【役割】敵を画面の上へ戻し、横位置・速さ・追加機能の特性を決め直します。
function respawnEnemy(enemy) {
  enemy.y = random(-300, -50);
  enemy.x = random(enemySize, width - enemySize);
  enemy.speed = enemySpeed + random(0, 2);
  runOption("spawnEnemy", enemy);
}

// ===== 応用コード貼り付け欄：ここから =====
// 課題A/B/G/H/Mのコードを、この枠内へ貼ります。
// 次の機能は、先のコードを残したまま、その下に追加できます。
// CUSTOM AREAの色・大きさ・速さ・タイトルはそのまま使えます。

// ===== 応用コード貼り付け欄：ここまで =====
