# レッスン3：プレイヤーの移動

## 🎯 学習目標

プレイヤーがキー入力で左右に移動する仕組みを、深く理解する。

- キー入力の受け取り方
- 座標の更新とゲームループの関係
- `constrain()` 関数で画面の端を制御する理由
- 1秒間の移動距離を計算する方法

---

## 🎮 プレイヤーが「移動して見える」仕組み

レッスン1で学んだとおり、ゲームは毎フレーム（1秒間に60回）、背景を消して新しい画像を描き直しています。

**プレイヤーの移動も、これと同じです。**

毎フレーム、プレイヤーの位置（`playerX`）が少しずつ変わります。

だから、プレイヤーが移動しているように「見える」のです。

```
フレーム1：playerX = 300
フレーム2：playerX = 293  (左矢印を押した)  ← 300 - 7 = 293
フレーム3：playerX = 286  ← 293 - 7 = 286
フレーム4：playerX = 279  ← 286 - 7 = 279
フレーム5：playerX = 272  ← 279 - 7 = 272（連続して変わるから、移動に見える）
```

---

## 📍 座標システムの確認

ゲーム画面の座標は、左上を基準にしています。

```
(0, 0)      →        (600, 0)
  ┌─────────────────────┐
  │    プレイヤー        │
  │    (playerX, playerY)
  │                     │  width = 600ピクセル
  │                     │  height = 400ピクセル
  │                     │
(0, 400)    →    (600, 400)
```

- **左端** = X座標 0
- **右端** = X座標 600
- **上端** = Y座標 0
- **下端** = Y座標 400

プレイヤーが画面中央にいれば、`playerX` はおよそ 300 です。

---

## ⌨️ キー入力の受け取り方

### `movePlayer()` 関数

**`sketch.js` の156〜164行目：**

```javascript
function movePlayer() {
  if (keyIsDown(LEFT_ARROW)) playerX -= playerSpeed;
  if (keyIsDown(RIGHT_ARROW)) playerX += playerSpeed;

  playerX = constrain(
    playerX,
    playerSize / 2,
    width - playerSize / 2
  );
}
```

### `keyIsDown()` 関数とは

**`keyIsDown(LEFT_ARROW)`** は、p5.jsが提供する関数です。

「この瞬間、LEFT_ARROW（左矢印キー）が押されていますか？」と確認します。

- 押されている → `true`（真）
- 押されていない → `false`（偽）

### 左矢印キーが押された場合

```javascript
if (keyIsDown(LEFT_ARROW)) playerX -= playerSpeed;
```

このコードを読む：

1. `if (...)` — もし〜なら
2. `keyIsDown(LEFT_ARROW)` — 左矢印キーが押されていたら
3. `playerX -= playerSpeed` — `playerX` から `playerSpeed` を引く（左に移動）

**例：** `playerX = 300`、`playerSpeed = 7` の場合

```javascript
playerX -= 7;  // playerX = 300 - 7 = 293
```

プレイヤーが左に7ピクセル移動します。

### 右矢印キーが押された場合

```javascript
if (keyIsDown(RIGHT_ARROW)) playerX += playerSpeed;
```

このコードを読む：

1. `if (...)` — もし〜なら
2. `keyIsDown(RIGHT_ARROW)` — 右矢印キーが押されていたら
3. `playerX += playerSpeed` — `playerX` に `playerSpeed` を足す（右に移動）

**例：** `playerX = 300`、`playerSpeed = 7` の場合

```javascript
playerX += 7;  // playerX = 300 + 7 = 307
```

プレイヤーが右に7ピクセル移動します。

---

## 🔄 毎フレーム何が起こるのか

**レッスン1で学んだゲームループを思い出してください。**

```javascript
function draw() {
  background(backgroundColor);

  if (gameState === "play") {
    playGame();
  }
}

function playGame() {
  drawGameInfo(remaining);
  movePlayer();           // ← ここで移動が計算される
  drawPlayer();           // ← ここで新しい位置に描かれる
  
  for (const enemy of enemies) {
    moveEnemy(enemy);
    drawEnemy(enemy);
    if (isHit(enemy)) { ... }
  }
}
```

**毎フレーム、以下の順で起こります：**

1. 背景を描き直す（前フレームの画像を消す）
2. `playGame()` が実行される
3. `movePlayer()` で、キー入力に基づいて `playerX` を更新する
4. `drawPlayer()` で、新しい位置にプレイヤーを描く
5. 敵も同様に移動・描画される

このすべてが、毎フレーム60回繰り返されます。

---

## 🛑 `constrain()` 関数で画面の端を制御

### なぜ `constrain()` が必要なのか

もし `constrain()` がなければ、こうなります：

```javascript
function movePlayer() {
  if (keyIsDown(LEFT_ARROW)) playerX -= playerSpeed;
  if (keyIsDown(RIGHT_ARROW)) playerX += playerSpeed;
  // constrain()がない！
}
```

プレイヤーが左矢印を押し続けると、`playerX` はどんどん小さくなります。

```
playerX = 300
playerX = 293
playerX = 286
playerX = 279
playerX = 50
playerX = -20    ← 画面の左側の外へ出てしまう！
playerX = -100
...
```

マイナスの座標に描かれたプレイヤーは、画面に見えません。

これは、ゲームとして不自然です。

### `constrain()` 関数の役割

```javascript
playerX = constrain(
  playerX,
  playerSize / 2,
  width - playerSize / 2
);
```

**`constrain()` は、値を指定の範囲内に制限します。**

引数（中身）は3つ：

| 引数 | 意味 |
|------|------|
| 第1引数：`playerX` | 制限したい値 |
| 第2引数：`playerSize / 2` | 最小値 |
| 第3引数：`width - playerSize / 2` | 最大値 |

**つまり：**

```javascript
constrain(playerX, 左の端, 右の端);
```

---

## 📐 具体的な計算

### 画面のサイズ

```javascript
width = 600   // 画面の幅
height = 400  // 画面の高さ
```

### プレイヤーのサイズ

```javascript
playerSize = 40
```

### `constrain()` の範囲

```javascript
playerX = constrain(
  playerX,
  playerSize / 2,        // 40 / 2 = 20
  width - playerSize / 2 // 600 - 20 = 580
);
```

**つまり、`playerX` は 20〜580 の範囲に制限されます。**

### なぜ `playerSize / 2` なのか

プレイヤーは三角形で、中心が `(playerX, playerY)` です。

三角形の半径は `playerSize / 2` なので、

- プレイヤーの左端 = `playerX - playerSize / 2` = `20 - 20` = `0`（画面の左端）
- プレイヤーの右端 = `playerX + playerSize / 2` = `580 + 20` = `600`（画面の右端）

**プレイヤー全体が画面内に収まるようにしています。**

---

## 📊 移動の流れ（完全版）

### 状態1：初期状態

```javascript
playerX = 300      // 画面中央
playerSize = 40
playerSpeed = 7
```

### 状態2：左矢印キーを3フレーム押し続けた場合

**フレーム1：**

```javascript
if (keyIsDown(LEFT_ARROW)) playerX -= 7;  // playerX = 300 - 7 = 293
playerX = constrain(293, 20, 580);        // 293は範囲内なので変わらない
// playerX = 293
```

**フレーム2：**

```javascript
if (keyIsDown(LEFT_ARROW)) playerX -= 7;  // playerX = 293 - 7 = 286
playerX = constrain(286, 20, 580);        // 286は範囲内
// playerX = 286
```

**フレーム3：**

```javascript
if (keyIsDown(LEFT_ARROW)) playerX -= 7;  // playerX = 286 - 7 = 279
playerX = constrain(279, 20, 580);        // 279は範囲内
// playerX = 279
```

結果：プレイヤーは3フレーム × 7ピクセル = 21ピクセル左に移動しました。

### 状態3：画面の端に達した場合

プレイヤーが左端に近づいて、`playerX = 25` の状態で、さらに左矢印を押した場合：

```javascript
if (keyIsDown(LEFT_ARROW)) playerX -= 7;  // playerX = 25 - 7 = 18
playerX = constrain(18, 20, 580);         // 18 < 20 なので、20に制限される
// playerX = 20（画面の端で止まる）
```

次のフレーム：

```javascript
if (keyIsDown(LEFT_ARROW)) playerX -= 7;  // playerX = 20 - 7 = 13
playerX = constrain(13, 20, 580);         // 13 < 20 なので、20に制限
// playerX = 20（そのまま）
```

**プレイヤーが左端を超えません。**

---

## ⏱️ 移動速度の計算

### `playerSpeed` の意味

`playerSpeed = 7` は、「毎フレーム7ピクセル移動」を意味します。

### 1秒間の移動距離

ゲームは60フレーム/秒で動きます。

```
1秒間の移動距離 = playerSpeed × フレームレート
                = 7 × 60
                = 420ピクセル/秒
```

つまり、プレイヤーが左矢印を1秒間押し続けたら、420ピクセル左に移動します。

### ゲーム画面全体の幅

```javascript
width = 600ピクセル
```

プレイヤーが画面全体を左から右に移動するのにかかる時間：

```
時間 = 600 ÷ 420 ≈ 1.43秒
```

つまり、1.43秒あれば、プレイヤーは画面全体を横切ることができます。

### `playerSpeed` を変更した場合

**例：`playerSpeed = 10` に変更**

```
1秒間の移動距離 = 10 × 60 = 600ピクセル/秒
画面全体を横切る時間 = 600 ÷ 600 = 1秒
```

もっと速く移動できます。

**例：`playerSpeed = 3` に変更**

```
1秒間の移動距離 = 3 × 60 = 180ピクセル/秒
画面全体を横切る時間 = 600 ÷ 180 ≈ 3.33秒
```

移動が遅くなります。

---

## 📝 重要な用語のまとめ

| 用語 | 意味 | このゲームでの例 |
|------|------|-----------------|
| **キー入力** | ユーザーがキーボードで何かを押すこと | 左矢印キーを押す |
| **`keyIsDown()`** | 特定のキーが押されているか確認する関数 | `keyIsDown(LEFT_ARROW)` |
| **座標更新** | プレイヤーの位置（X座標）を変える | `playerX += 7` |
| **加算代入** | `+=` で値を足す | `playerX += 7` は `playerX = playerX + 7` と同じ |
| **減算代入** | `-=` で値を引く | `playerX -= 7` は `playerX = playerX - 7` と同じ |
| **`constrain()`** | 値を指定の範囲内に制限する関数 | プレイヤーを画面内に留める |
| **フレームレート** | 1秒間のフレーム数 | 60 FPS = 1秒間に60フレーム |

---

## 📌 コードの読み方（演習）

### 演習1：このコードは何をしている？

```javascript
if (keyIsDown(RIGHT_ARROW)) playerX += playerSpeed;
```

**答え：** 右矢印キーが押されていれば、プレイヤーを右に `playerSpeed` ピクセル移動させる。

### 演習2：`constrain()` の役割は？

```javascript
playerX = constrain(playerX, playerSize / 2, width - playerSize / 2);
```

**答え：** `playerX` を、20〜580 の範囲に制限する。これによって、プレイヤーが画面外に出ないようにする。

### 演習3：もし `constrain()` がなかったら？

```javascript
// constrain() がない場合
if (keyIsDown(LEFT_ARROW)) playerX -= playerSpeed;
if (keyIsDown(RIGHT_ARROW)) playerX += playerSpeed;
```

**答え：** プレイヤーが画面外に移動してしまい、見えなくなる可能性がある。

---

## ✅ 理解度確認クイズ

### クイズ1：フレームごとの移動

`playerSpeed = 5` のゲームで、左矢印キーを10フレーム押し続けた場合、プレイヤーは何ピクセル左に移動しますか？

**選択肢：**
- A. 5ピクセル
- B. 50ピクセル
- C. 300ピクセル

---

### クイズ2：画面の端の計算

`playerSize = 40`、`width = 600` のとき、`constrain()` の最小値と最大値は何ですか？

**選択肢：**
- A. 最小値 = 0、最大値 = 600
- B. 最小値 = 20、最大値 = 580
- C. 最小値 = 40、最大値 = 560

---

### クイズ3：移動速度と時間

`playerSpeed = 10`、フレームレート60 FPS、画面の幅 600ピクセルのとき、プレイヤーが画面の左端から右端に到達するまでにかかる時間は何秒ですか？

**ヒント：** 1秒間の移動距離 = `playerSpeed × 60`

**選択肢：**
- A. 0.6秒
- B. 1秒
- C. 10秒

---

## 🎓 中学生への説明例（講師向け）

> ゲームの画面って、左上が (0, 0) っていう座標から始まっています。プレイヤーは、その座標の中を移動します。
>
> キーボードの左矢印を押すと、プレイヤーの X 座標が小さくなります。右矢印を押すと、大きくなります。
>
> でも、座標がマイナスになったり、600を超えたりすると、画面の外になって見えなくなります。
>
> だから `constrain()` という関数で、「プレイヤーは、20〜580の範囲だけで移動してね」って制限してあるんです。
>
> そういう工夫が、自然なゲームプレイを作るんです。

---

## 🔗 次のレッスンへ

次は、**レッスン4『敵と当たり判定』** です。

ここでは：

- **敵の生成** — 敵がどうやって画面の上から下へ落ちてくるのか
- **当たり判定** — `dist()` 関数で2点間の距離を計算する
- **ゲームオーバー** — 敵とプレイヤーが衝突したときの処理

を、詳しく学びます。

