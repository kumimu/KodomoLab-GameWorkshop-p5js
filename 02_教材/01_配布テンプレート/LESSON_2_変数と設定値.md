# レッスン2：変数と設定値

## 🎯 学習目標

CUSTOM AREA（カスタムエリア）にある5つの設定値を理解し、これらを変更するとゲームがどう変わるかを体験する。

- 変数とは何か
- CUSTOM AREA にある5つの設定値
- 色の指定方法
- 数値を変更した時の効果
- 参加者が最初に試すべき改造

---

## 🔧 CUSTOM AREA とは

`sketch.js` の冒頭に、参加者が自由に改造できる領域があります。

**`sketch.js` の1〜12行目：**

```javascript
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
```

この領域には、ゲームの見た目や速度に関わる5つの設定値があります。

**ここを変更するだけで、生徒は「自分のゲーム」を作ることができます。**

---

## 📦 変数とは何か

**変数** は、「データを保存する箱」です。

```javascript
let playerColor = "cyan";
```

この1行を分解すると：

| 部分 | 意味 |
|------|------|
| `let` | 「新しい箱を作る」という命令 |
| `playerColor` | 箱の名前 |
| `=` | 「中身を入れる」という意味 |
| `"cyan"` | 箱の中身（この場合、色を表す文字列） |
| `;` | 文の終わり |

### 変数が大事な理由

もし変数がなければ、コードはこんなになります：

```javascript
// 悪い例：色を書きまくる
function drawPlayer() {
  fill("cyan");
  triangle(...);
}

function showStartScreen() {
  fill("white");
  text("プレイヤーの色は、青です", width / 2, 100);
}

function drawGameInfo() {
  fill("white");
  text("プレイヤーの色", 20, 28);  // ← またプレイヤーの色について書いてる
}
```

プレイヤーの色を変えたいときに、ファイル全体から「cyan」を探して変更しなければなりません。**大変です！**

でも、変数を使えば：

```javascript
// 良い例：最初に1回だけ決める
let playerColor = "cyan";

// あとはこの変数を使うだけ
function drawPlayer() {
  fill(playerColor);
  triangle(...);
}

// 色を変えたいときは、1行目だけを変更する
// let playerColor = "lime";  ← ここだけ変えば全部変わる
```

**1行変更するだけで、ゲーム全体に反映されます。**

---

## 🎨 CUSTOM AREA の5つの設定値

### 1. `playerColor` — プレイヤーの色

```javascript
let playerColor = "cyan";
```

**役割：** プレイヤー（三角形）の色を指定します。

**使われている場所：** `sketch.js` の160行目

```javascript
function drawPlayer() {
  fill(playerColor);  // ← ここで使われている
  noStroke();
  triangle(
    playerX, playerY - playerSize / 2,
    playerX - playerSize / 2, playerY + playerSize / 2,
    playerX + playerSize / 2, playerY + playerSize / 2
  );
}
```

**変更例：**

```javascript
let playerColor = "lime";      // 緑色
let playerColor = "#FF6B9D";   // ピンク色（16進数）
let playerColor = "yellow";    // 黄色
```

---

### 2. `enemyColor` — 敵の色

```javascript
let enemyColor = "red";
```

**役割：** 敵（円）の色を指定します。

**使われている場所：** `sketch.js` の167行目

```javascript
function drawEnemy(enemy) {
  fill(enemyColor);  // ← ここで使われている
  noStroke();
  circle(enemy.x, enemy.y, enemySize);
}
```

**変更例：**

```javascript
let enemyColor = "orange";     // オレンジ
let enemyColor = "#00D9FF";    // シアン色
let enemyColor = "purple";     // 紫
```

---

### 3. `backgroundColor` — 背景色

```javascript
let backgroundColor = "black";
```

**役割：** ゲーム画面全体の背景色を指定します。

**使われている場所：** `sketch.js` の33行目（毎フレーム）

```javascript
function draw() {
  background(backgroundColor);  // ← ここで使われている
  
  if (gameState === "start") {
    showStartScreen();
  }
  // ...
}
```

**変更例：**

```javascript
let backgroundColor = "navy";   // 濃い青
let backgroundColor = "#1a1a2e"; // 暗い紫（16進数）
let backgroundColor = "white";   // 白（見えにくくなる可能性）
```

---

### 4. `playerSize` — プレイヤーの大きさ

```javascript
let playerSize = 40;
```

**役割：** プレイヤー（三角形）のサイズをピクセル単位で指定します。

**使われている場所：** `sketch.js` の160行目の `drawPlayer()` と、156行目の `movePlayer()`

```javascript
function movePlayer() {
  if (keyIsDown(LEFT_ARROW)) playerX -= playerSpeed;
  if (keyIsDown(RIGHT_ARROW)) playerX += playerSpeed;

  playerX = constrain(
    playerX,
    playerSize / 2,          // ← ここで使われている（左の端）
    width - playerSize / 2   // ← ここで使われている（右の端）
  );
}
```

プレイヤーが画面からはみ出さないように、左右の端をコントロールしています。

**変更例：**

```javascript
let playerSize = 60;  // 大きくなる（移動が楽になる）
let playerSize = 20;  // 小さくなる（難しくなる）
```

---

### 5. `enemySize` — 敵の大きさ

```javascript
let enemySize = 35;
```

**役割：** 敵（円）のサイズをピクセル単位で指定します。

**使われている場所：** `sketch.js` の167行目の `drawEnemy()` と、当たり判定

```javascript
function isHit(enemy) {
  const distance = dist(playerX, playerY, enemy.x, enemy.y);
  return distance < playerSize / 2 + enemySize / 2;  // ← ここで使われている
}
```

当たり判定も `enemySize` の値に基づいて計算されます。

敵が大きいと、当たりやすくなります。

**変更例：**

```javascript
let enemySize = 50;  // 大きくなる（当たりやすくなる、難しくなる）
let enemySize = 20;  // 小さくなる（当たりにくくなる、簡単になる）
```

---

### 6. `playerSpeed` — プレイヤーの移動速度

```javascript
let playerSpeed = 7;
```

**役割：** キー入力でプレイヤーがどれくらい速く移動するかを指定します。

**使われている場所：** `sketch.js` の156行目

```javascript
function movePlayer() {
  if (keyIsDown(LEFT_ARROW)) playerX -= playerSpeed;  // ← ここで使われている
  if (keyIsDown(RIGHT_ARROW)) playerX += playerSpeed; // ← ここで使われている

  playerX = constrain(playerX, playerSize / 2, width - playerSize / 2);
}
```

毎フレーム、左矢印キーが押されていれば `playerX` から `playerSpeed` 分だけ左に移動します。

`playerSpeed` が大きいほど、プレイヤーが速く動きます。

**変更例：**

```javascript
let playerSpeed = 10;  // 速くなる（移動が楽になる、簡単）
let playerSpeed = 3;   // 遅くなる（難しくなる）
```

**重要：** このゲームでは、敵の速度（`enemySpeed`）は難易度ごとに異なります。レッスン4で詳しく説明します。

---

### 7. `gameTitle` — ゲームのタイトル

```javascript
let gameTitle = "隕石をよけろ！";
```

**役割：** 開始画面に表示されるゲームのタイトルです。

**使われている場所：** `sketch.js` の49行目

```javascript
function showStartScreen() {
  fill("white");
  textAlign(CENTER);

  textSize(36);
  text(gameTitle, width / 2, 75);  // ← ここで使われている
  
  textSize(22);
  text("難易度を選んでスタート！", width / 2, 135);
  // ...
}
```

**変更例：**

```javascript
let gameTitle = "宇宙を守れ！";
let gameTitle = "敵戦闘機を避けろ！";
let gameTitle = "My Game";
```

---

## 🎨 色を指定する方法

p5.jsで色を指定する方法は3つあります。

### 方法1：英語の色名

```javascript
let playerColor = "red";
let enemyColor = "cyan";
let backgroundColor = "black";
```

**使える色名の例：**

| 英語 | 日本語 |
|-----|--------|
| `"red"` | 赤 |
| `"blue"` | 青 |
| `"green"` | 緑 |
| `"yellow"` | 黄 |
| `"purple"` | 紫 |
| `"orange"` | オレンジ |
| `"pink"` | ピンク |
| `"cyan"` | シアン（水色） |
| `"lime"` | ライム（黄緑） |
| `"navy"` | ネイビー（濃い青） |
| `"gray"` または `"grey"` | グレー |
| `"white"` | 白 |
| `"black"` | 黒 |

全ての色名は、p5.js公式ドキュメント（Color Reference）に載っています。

https://p5js.org/reference/#/p5/color

### 方法2：16進数（ヘックスカラー）

```javascript
let playerColor = "#FF6B9D";  // ピンク
let enemyColor = "#00D9FF";   // シアン
let backgroundColor = "#1a1a2e"; // 暗い紫
```

16進数は、色をより細かく指定できます。

`#` のあとに、6文字の数字とアルファベットが続きます。

- 最初の2文字：赤（00〜FF）
- 次の2文字：緑（00〜FF）
- 最後の2文字：青（00〜FF）

**例：**

```javascript
#FF0000  // 赤（赤100%、緑0%、青0%）
#00FF00  // 緑
#0000FF  // 青
#FFFFFF  // 白（全て100%）
#000000  // 黒（全て0%）
```

オンラインの「カラーピッカー」を使うと、好きな色の16進数が簡単に分かります。

### 方法3：RGB値

```javascript
let playerColor = rgb(255, 107, 157);  // ピンク
let enemyColor = rgb(0, 217, 255);     // シアン
```

RGB値は、赤・緑・青の3つの値（各0〜255）で色を指定します。

---

## 📝 実際の変更を試す（シミュレーション）

### 例1：プレイヤーとタイトルを変更

**元のコード：**

```javascript
let playerColor = "cyan";
let enemyColor = "red";
let backgroundColor = "black";
let playerSize = 40;
let enemySize = 35;
let playerSpeed = 7;
let gameTitle = "隕石をよけろ！";
```

**変更後：**

```javascript
let playerColor = "lime";         // プレイヤーを緑色に
let enemyColor = "red";
let backgroundColor = "black";
let playerSize = 40;
let enemySize = 35;
let playerSpeed = 7;
let gameTitle = "敵を避けまくれ！";  // タイトル変更
```

**ゲームはこう変わる：**

- 開始画面のタイトルが「敵を避けまくれ！」に変わる
- プレイヤーが緑色の三角形になる
- 敵は赤いままなので、背景（黒）の中で目立ちやすくなる

---

### 例2：難易度を易しくする

**変更後：**

```javascript
let playerColor = "cyan";
let enemyColor = "red";
let backgroundColor = "black";
let playerSize = 60;        // 大きくなる
let enemySize = 20;         // 小さくなる（避けやすい）
let playerSpeed = 10;       // 速くなる（移動が楽）
let gameTitle = "隕石をよけろ！";
```

**ゲームはこう変わる：**

- プレイヤーが大きくなり、移動が速くなる（やりやすい）
- 敵が小さくなり、当たりにくくなる（避けやすい）
- つまり、全体的に簡単になる

---

### 例3：見た目を大きく変える

**変更後：**

```javascript
let playerColor = "#FF1493";    // 深いピンク
let enemyColor = "#00FF00";     // ネオン緑
let backgroundColor = "#0a0a2e"; // 暗い紫
let playerSize = 40;
let enemySize = 35;
let playerSpeed = 7;
let gameTitle = "NEONバトル";
```

**ゲームはこう変わる：**

- 背景が暗い紫になり、より近未来的な雰囲気
- プレイヤーがピンク、敵がネオン緑で、コントラストが強い
- タイトルが「NEONバトル」に変わり、テーマが統一される

---

## 🔄 座標と移動の仕組み

ゲーム画面は、左上を (0, 0) とする座標系を使っています。

```
(0, 0)      →        (600, 0)
  ┌─────────────────────┐
  │                     │  ← width = 600
  │                     │
  │                     │  height = 400
  │                     │
(0, 400)    →    (600, 400)
```

### プレイヤーの位置

```javascript
let playerX;
let playerY;
```

ゲーム開始時、`sketch.js` の90行目：

```javascript
playerX = width / 2;      // 画面の中央 = 300
playerY = height - 55;    // 画面の下から少し上 = 345
```

プレイヤーは、画面中央の下に表示されます。

### 移動の仕組み

**`movePlayer()` 関数（156行目）：**

```javascript
function movePlayer() {
  if (keyIsDown(LEFT_ARROW)) playerX -= playerSpeed;   // 左矢印キーが押されている
  if (keyIsDown(RIGHT_ARROW)) playerX += playerSpeed;  // 右矢印キーが押されている

  playerX = constrain(
    playerX,
    playerSize / 2,
    width - playerSize / 2
  );
}
```

**毎フレーム、以下が起こります：**

1. 左矢印キーが押されていれば：`playerX = playerX - 7`（左に移動）
2. 右矢印キーが押されていれば：`playerX = playerX + 7`（右に移動）
3. プレイヤーが画面外に出ないように制限：`constrain()` で左右の端を制御

**もし `playerSpeed = 10` に変更したら：**

毎フレーム、10ピクセル分動きます。7ピクセルより速い。

---

## 📝 重要な用語のまとめ

| 用語 | 意味 | 例 |
|------|------|-----|
| **変数** | データを保存する箱 | `let playerColor = "cyan";` |
| **プロパティ（設定値）** | 変数に保存される値 | `playerColor` の値は `"cyan"` |
| **色名** | 英語の色の名前 | `"red"`、`"blue"` |
| **16進数** | 色を数字で指定する方法 | `"#FF0000"` は赤 |
| **ピクセル** | 画面の最小単位 | プレイヤーのサイズは 40 ピクセル |
| **座標** | 画面上の位置 | (300, 345) は画面中央の下 |
| **constrain()** | 値を指定の範囲内に制限する関数 | プレイヤーが画面外に出ないようにする |

---

## ✅ 理解度確認クイズ

### クイズ1：変数を変更するとどこまで変わる？

`playerColor` を `"cyan"` から `"lime"` に変更しました。

ゲーム中、プレイヤー（三角形）の色が変わる場所は、いくつありますか？

**ヒント：** `playerColor` はどこで使われていますか？

**選択肢：**
- A. 1箇所だけ（`drawPlayer()` 関数の中）
- B. 2箇所以上（複数の場所）
- C. 全体（全部のコードが影響を受ける）

---

### クイズ2：移動速度の計算

`playerSpeed = 7` のゲームを60フレーム/秒で遊んでいます。

1秒間に、プレイヤーはピクセル単位で何ピクセル移動できますか？

**ヒント：** 毎フレーム 7 ピクセル移動し、1秒間に 60 フレームあります。

**選択肢：**
- A. 7ピクセル
- B. 60ピクセル
- C. 420ピクセル

---

### クイズ3：敵のサイズと難易度

`enemySize = 35` のゲームと、`enemySize = 50` のゲームでは、どちらが難しいでしょう？

**理由も答えてください。**

---

## 🎓 中学生への説明例（講師向け）

> このゲームの見た目や動きの速さは、上の方にある **CUSTOM AREA** という領域で全部決まっています。
>
> 例えば `playerColor = "cyan"` というのは、「プレイヤーの色は、シアン色ですよ」という指示です。
>
> ここを `playerColor = "lime"` に変えると、プレイヤーが緑色になります。
>
> 1つの値を変えるだけで、ゲーム全体に反映されます。それが **変数** の便利さです。
>
> 難しすぎるゲームなら、`playerSize` を大きくしたり、`playerSpeed` を速くしたり、`enemySize` を小さくしたりして、自分好みに調整できるんです。

---

## 🔗 次のレッスンへ

次は、**レッスン3『プレイヤーの移動』** です。

キー入力、座標、ゲームループの関係を、より詳しく学びます。

敵がどうやって下から上に移動するのか、も解説します。

