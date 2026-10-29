# 虫食い問題：OPTION B — 射撃機能

**難易度：★★★★** | **実装時間：45～60分** | **学習：配列・当たり判定の応用・イベント処理**

---

## 🎯 目標

スペースキーで弾を発射し、敵を撃ち落とせるようにする。

**完成時のゲーム：**
- スペースキー（またはマウス）で敵に向かって弾を発射
- 敵に当たった弾と敵が消える
- 敵撃破で 10 点獲得

---

## 📝 虫食い問題 — 段階1：弾の配列と発射処理

### 問題1：グローバル変数に弾の配列を追加

**📍 ファイル：`sketch.js`**

**📍 場所：「CUSTOM AREA」の下**

**📍 現在のコード：**
```javascript
let gameTitle = "隕石をよけろ！";
// ================================================  ← ここの下に追加！

let gameState = "start";
```

**追加するコード：**

```javascript
let gameTitle = "隕石をよけろ！";
// ================================================

// ★ OPTION B：射撃機能
const OPTION_B_ENABLED = true;
// ★ ここを埋めてください
let ________________________ = [];  // ← 弾を管理する配列を作成

let gameState = "start";
```

**追加するコード（答え）：**

```javascript
let bullets = [];
```

**✅ 完成後：**
```javascript
// ★ OPTION B：射撃機能
const OPTION_B_ENABLED = true;
let bullets = [];
```

**💡 ヒント：** 敵は `enemies` という配列なので、弾は？

---

### 問題2：スペースキーで弾を発射

**📍 ファイル：`sketch.js`**

**📍 場所：`keyPressed()` 関数の中**

**📍 具体的な場所：既存のキー処理の最後**

**📍 現在のコード：**

```javascript
function keyPressed() {
  if (gameState === "start") {
    if (key === "1") startGame(1);
    if (key === "2") startGame(2);
    if (key === "3") startGame(3);
  } else if (gameState === "end" && key === " ") {
    gameState = "start";
  }
  // ★ ここに追加！
}
```

**追加するコード：**

```javascript
function keyPressed() {
  if (gameState === "start") {
    if (key === "1") startGame(1);
    if (key === "2") startGame(2);
    if (key === "3") startGame(3);
  } else if (gameState === "end" && key === " ") {
    gameState = "start";
  }
  // ★ OPTION B：スペースキーで弾を発射
  else if (OPTION_B_ENABLED && gameState === "play" && key === " ") {
    _________________________________________
  }
}
```

**追加するコード（答え）：**

```javascript
bullets.push({
  x: playerX,
  y: playerY - playerSize / 2,
  vy: -8
});
```

**✅ 完成後：**
```javascript
function keyPressed() {
  if (gameState === "start") {
    if (key === "1") startGame(1);
    if (key === "2") startGame(2);
    if (key === "3") startGame(3);
  } else if (gameState === "end" && key === " ") {
    gameState = "start";
  }
  else if (OPTION_B_ENABLED && gameState === "play" && key === " ") {
    bullets.push({
      x: playerX,
      y: playerY - playerSize / 2,
      vy: -8
    });
  }
}
```

**💡 ヒント：** 弾オブジェクトは x（横位置）、y（縦位置）、vy（移動速度）を持つ

---

## 📝 虫食い問題 — 段階2：弾の更新と敵への当たり判定

### 問題1：弾の位置を更新し、画面外に出たら削除

**📍 ファイル：`sketch.js`**

**📍 場所：ファイルの最後に新しい関数を作成**

**📍 現在のコード（関数の構造例）：**

```javascript
function drawEnemy(enemy) {
  // ... 敵の描画処理 ...
}
// ← ここに新しい関数を追加！
```

**追加するコード（新しい関数）：**

```javascript
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    // ★ ここを埋めてください
    ____________________________  // ← 弾を移動（上に向かって移動）
    
    // 弾が画面外に出たら削除
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      continue;
    }
    
    // 敵との当たり判定
    for (let j = enemies.length - 1; j >= 0; j--) {
      const dist = hypot(
        bullets[i].x - enemies[j].x,
        bullets[i].y - enemies[j].y
      );
      if (dist < 10 + enemySize / 2) {
        // 敵に当たった
        // ★ ここを埋めてください（3箇所）
        ____________________________  // ← スコア加算
        ____________________________  // ← 弾を削除
        ____________________________  // ← 敵を削除
        break;
      }
    }
  }
}
```

**追加するコード（答え）：**

```javascript
// 弾の移動：
bullets[i].y += bullets[i].vy;

// スコア加算：
score += 10;

// 弾削除：
bullets.splice(i, 1);

// 敵削除：
enemies.splice(j, 1);
```

**✅ 完成後：**
```javascript
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y += bullets[i].vy;
    
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      continue;
    }
    
    for (let j = enemies.length - 1; j >= 0; j--) {
      const dist = hypot(
        bullets[i].x - enemies[j].x,
        bullets[i].y - enemies[j].y
      );
      if (dist < 10 + enemySize / 2) {
        score += 10;
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        break;
      }
    }
  }
}
```

**💡 ヒント：**
- 弾の移動：`vy` は負の値（上に移動）
- 敵に当たったら、スコア加算 → 弾削除 → 敵削除の順

---

### 問題2：弾を描画する関数を作成

**📍 ファイル：`sketch.js`**

**📍 場所：ファイルの最後に新しい関数を作成**

**📍 現在のコード（関数の構造例）：**

```javascript
function updateBullets() {
  // ... 上で作った関数 ...
}
// ← ここに新しい関数を追加！
```

**追加するコード（新しい関数）：**

```javascript
function drawBullets() {
  // ★ ここを埋めてください
  ____________________________  // ← 弾の色を設定
  noStroke();
  for (const bullet of bullets) {
    circle(bullet.x, bullet.y, 5);
  }
}
```

**追加するコード（答え）：**

```javascript
fill("yellow");
```

**✅ 完成後：**
```javascript
function drawBullets() {
  fill("yellow");
  noStroke();
  for (const bullet of bullets) {
    circle(bullet.x, bullet.y, 5);
  }
}
```

**💡 ヒント：** 敵が赤、プレイヤーがシアンなので、弾は何色がいい？

---

## 📝 虫食い問題 — 段階3：playGame() に弾の処理を統合

### 問題：playGame() に弾の更新と描画を追加

**📍 ファイル：`sketch.js`**

**📍 場所：`playGame()` 関数の中**

**📍 具体的な場所：`drawPlayer();` の直後、敵のループの前**

**📍 現在のコード：**

```javascript
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
  // ★ ここに追加！

  for (const enemy of enemies) {
    moveEnemy(enemy);
    drawEnemy(enemy);
    // ... 当たり判定処理 ...
  }
}
```

**追加するコード：**

```javascript
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

  // ★ OPTION B：弾の処理を追加
  if (OPTION_B_ENABLED) {
    ____________________________  // ← 弾を更新
    ____________________________  // ← 弾を描画
  }

  for (const enemy of enemies) {
    moveEnemy(enemy);
    drawEnemy(enemy);
    // ... 当たり判定処理 ...
  }
}
```

**追加するコード（答え）：**

```javascript
updateBullets();
drawBullets();
```

**✅ 完成後：**
```javascript
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

  if (OPTION_B_ENABLED) {
    updateBullets();
    drawBullets();
  }

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
```

**💡 ヒント：** 作った 2 つの関数（updateBullets と drawBullets）を呼び出すだけ

---

## 🔧 完成コード（主要部分）

```javascript
// ===== CUSTOM AREA =====
let playerColor = "cyan";
let enemyColor = "red";
let backgroundColor = "black";
let playerSize = 40;
let enemySize = 35;
let playerSpeed = 7;
let gameTitle = "隕石をよけろ！";
// =======================

// ★ OPTION B：射撃機能
const OPTION_B_ENABLED = true;
let bullets = [];

let gameState = "start";
let playerX, playerY;
let enemies = [];
let difficultyName = "";
let enemySpeed = 4;
let enemyCount = 1;
let clearTime = 30;
let startTime = 0;
let score = 0;
let resultText = "";

// ... setup(), draw() は変わらない ...

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

  // ★ OPTION B：弾の更新と描画
  if (OPTION_B_ENABLED) {
    updateBullets();
    drawBullets();
  }

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

function keyPressed() {
  if (gameState === "start") {
    if (key === "1") startGame(1);
    if (key === "2") startGame(2);
    if (key === "3") startGame(3);
  } else if (gameState === "end" && key === " ") {
    gameState = "start";
  }
  // ★ OPTION B：スペースキーで弾を発射
  else if (OPTION_B_ENABLED && gameState === "play" && key === " ") {
    bullets.push({
      x: playerX,
      y: playerY - playerSize / 2,
      vy: -8
    });
  }
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y += bullets[i].vy;

    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      continue;
    }

    for (let j = enemies.length - 1; j >= 0; j--) {
      const dist = hypot(
        bullets[i].x - enemies[j].x,
        bullets[i].y - enemies[j].y
      );
      if (dist < 10 + enemySize / 2) {
        score += 10;
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        break;
      }
    }
  }
}

function drawBullets() {
  fill("yellow");
  noStroke();
  for (const bullet of bullets) {
    circle(bullet.x, bullet.y, 5);
  }
}
```

---

## ✅ 実装チェックリスト

- [ ] グローバル変数に `OPTION_B_ENABLED = true` と `bullets = []` を追加
- [ ] keyPressed() でスペースキーに反応して弾を発射
- [ ] updateBullets() で弾の位置を更新
- [ ] updateBullets() で敵との当たり判定を実装
- [ ] drawBullets() で弾を描画
- [ ] playGame() に updateBullets() と drawBullets() を追加
- [ ] ゲームを実行してスペースキーで弾が発射されるか確認
- [ ] 弾が敵に当たると消えるか確認
- [ ] スコアが加算されるか確認

---

## 🧪 テスト方法

### テスト1：弾が発射されるか確認

```
ゲーム中にスペースキーを押す
→ 敵に向かって弾が飛ぶか確認
```

### テスト2：敵に当たったら消えるか確認

```
弾が敵に直撃する
→ 弾と敵が両方消えるか確認
```

### テスト3：スコアが加算されるか確認

```
敵を撃ち落とす
→ スコアが 10 点増えるか確認
```

---

## 💡 応用課題

- [ ] 弾のサイズを大きくする（当たり判定を大きく）
- [ ] 弾の色を敵の色に合わせて変える
- [ ] 弾の速度を変える（vy の値を調整）
- [ ] 一度に複数の弾を発射する

---

## 📞 困ったときは

| 問題 | 原因 | 対応 |
|------|------|------|
| 弾が発射されない | keyPressed() が正しくない | スペースキー処理を確認 |
| 弾が見えない | drawBullets() が呼ばれていない | playGame() の呼び出し確認 |
| 敵が消えない | 当たり判定計算が間違っている | `hypot()` と判定距離を確認 |
| 敵が 1 つだけ消える | ループが途中で止まっている | continue を使って処理を続行 |

---

## 🎓 学習ポイント

✅ **配列の管理** — 複数の弾を管理  
✅ **ループ操作** — 配列から要素を削除（splice）  
✅ **当たり判定** — hypot で距離を計算  
✅ **イベント処理** — キー入力で処理を実行

