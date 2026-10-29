# 虫食い問題：OPTION H — ビジュアルカスタマイズ

**難易度：★★☆** | **実装時間：20～30分** | **学習：座標変換・回転処理**

---

## 🎯 目標

敵を回転させたり、プレイヤーに光の効果を追加したりして、ゲーム画面を派手にする。

**完成時のゲーム：**
- 敵が回転しながら落ちてくる
- プレイヤーの周りに光の効果が出る

---

## 📝 虫食い問題 — 段階1：敵の回転処理を追加

### 問題：敵を回転させて描く

**📍 ファイル：`sketch.js`**

**📍 場所：`drawEnemy()` 関数の中**

**📍 具体的な場所：`fill(enemyColor);` の下**

**📍 現在のコード：**

```javascript
function drawEnemy(enemy) {
  fill(enemyColor);
  noStroke();

  // ★ ここを埋めてください
  if (true) {  // OPTION_H_ENABLED に変更予定
    push();
    ____________________________  // ← 敵の位置に原点を移動
    ____________________________  // ← 敵を回転（frameCount を使ったアニメーション）
    circle(0, 0, enemySize);  // 原点中心に敵を描く
    pop();
  } else {
    circle(enemy.x, enemy.y, enemySize);
  }
}
```

**追加するコード（答え）：**

```javascript
translate(enemy.x, enemy.y);
rotate(frameCount * 0.05);
```

**✅ 完成後：**
```javascript
function drawEnemy(enemy) {
  fill(enemyColor);
  noStroke();

  if (true) {
    push();
    translate(enemy.x, enemy.y);
    rotate(frameCount * 0.05);
    circle(0, 0, enemySize);
    pop();
  } else {
    circle(enemy.x, enemy.y, enemySize);
  }
}
```

**💡 ヒント：**
- `translate(x, y)` — 原点を敵の位置に移動
- `rotate(frameCount * 0.05)` — frameCount は時間経過で回転

---

## 📝 虫食い問題 — 段階2：プレイヤーに光の効果を追加

### 問題：プレイヤーの周りに光の円を描く

**📍 ファイル：`sketch.js`**

**📍 場所：`drawPlayer()` 関数の中**

**📍 具体的な場所：プレイヤーの本体を描く前（triangle の上）**

**📍 現在のコード：**

```javascript
function drawPlayer() {
  fill(playerColor);
  noStroke();

  // ★ ここを埋めてください
  if (true) {  // OPTION_H_ENABLED に変更予定
    // プレイヤーの周りに半透明の光を描く
    ____________________________  // ← 光の色を半透明に設定
    circle(playerX, playerY, playerSize + 20);
  }

  // プレイヤーの本体
  triangle(
    playerX, playerY - playerSize / 2,
    playerX - playerSize / 2, playerY + playerSize / 2,
    playerX + playerSize / 2, playerY + playerSize / 2
  );
}
```

**追加するコード（答え）：**

```javascript
fill(playerColor, 100);
```

**✅ 完成後：**
```javascript
function drawPlayer() {
  fill(playerColor);
  noStroke();

  if (true) {
    fill(playerColor, 100);
    circle(playerX, playerY, playerSize + 20);
  }

  fill(playerColor);
  triangle(
    playerX, playerY - playerSize / 2,
    playerX - playerSize / 2, playerY + playerSize / 2,
    playerX + playerSize / 2, playerY + playerSize / 2
  );
}
```

**💡 ヒント：** `fill()` の 2 番目の引数は透明度（0 = 透明、255 = 完全不透明、100 = 半透明）

---

## 📝 虫食い問題 — 段階3：グローバル変数に OPTION_H フラグを追加

### 問題：OPTION_H のフラグを追加

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

// ★ OPTION H：ビジュアルカスタマイズ
// ★ ここを埋めてください
_________________________ = true;

let gameState = "start";
```

**追加するコード（答え）：**

```javascript
const OPTION_H_ENABLED = true;
```

**✅ 完成後：**
```javascript
// ★ OPTION H：ビジュアルカスタマイズ
const OPTION_H_ENABLED = true;
```

**💡 ヒント：** 他のオプション（OPTION_A, OPTION_B など）と同じ形式

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

// ★ OPTION H：ビジュアルカスタマイズ
const OPTION_H_ENABLED = true;

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

function drawEnemy(enemy) {
  fill(enemyColor);
  noStroke();

  // ★ OPTION H：敵を回転させて描く
  if (OPTION_H_ENABLED) {
    push();
    translate(enemy.x, enemy.y);
    rotate(frameCount * 0.05);
    circle(0, 0, enemySize);
    pop();
  } else {
    circle(enemy.x, enemy.y, enemySize);
  }
}

function drawPlayer() {
  fill(playerColor);
  noStroke();

  // ★ OPTION H：プレイヤーに光の効果を追加
  if (OPTION_H_ENABLED) {
    fill(playerColor, 100);  // 透明度を設定
    circle(playerX, playerY, playerSize + 20);
  }

  fill(playerColor);
  triangle(
    playerX, playerY - playerSize / 2,
    playerX - playerSize / 2, playerY + playerSize / 2,
    playerX + playerSize / 2, playerY + playerSize / 2
  );
}
```

---

## ✅ 実装チェックリスト

- [ ] グローバル変数に `OPTION_H_ENABLED = true` を追加
- [ ] drawEnemy() で敵を回転させて描く（push/translate/rotate/pop）
- [ ] drawPlayer() でプレイヤーに光の効果を追加
- [ ] ゲームを実行して敵が回転するか確認
- [ ] プレイヤーの周りに光が見えるか確認

---

## 🧪 テスト方法

### テスト1：敵が回転するか確認

```
ゲーム開始
→ 敵が回転しながら落ちてくるか確認
```

### テスト2：プレイヤーの光が見えるか確認

```
ゲーム画面でプレイヤーを観察
→ 周りに光の円が見えるか確認
```

### テスト3：回転速度を調整

```
frameCount * 0.05 の 0.05 を変更してみる
→ 0.1 にすると 2 倍速、0.025 にすると 0.5 倍速
```

---

## 💡 応用課題

- [ ] 敵の回転速度を変更する（frameCount の係数を調整）
- [ ] プレイヤーの光の大きさを変更する（playerSize + 20 の値を調整）
- [ ] プレイヤーの光も回転させてみる
- [ ] 敵にも光の効果を追加する

---

## 🎨 座標変換の仕組み

**敵を回転させる処理の流れ：**

```
push()                      // 描画状態を保存
translate(x, y)             // 敵の位置に原点を移動
rotate(角度)                // 回転する
circle(0, 0, size)          // 原点を中心に円を描く
pop()                       // 描画状態を復元
```

**なぜ座標変換が必要か：**
- p5.js では、`rotate()` は常に原点 (0, 0) を中心に回転する
- 敵の位置で回転させたいなら、まず `translate()` で原点を敵の位置に移動する必要がある

---

## 📞 困ったときは

| 問題 | 原因 | 対応 |
|------|------|------|
| 敵が画面の左上で回転する | translate() がない | push/translate/pop の流れを確認 |
| 敵が回転しない | rotate() の値が 0 | frameCount * 0.05 を確認 |
| プレイヤーの光が見えない | 色が透明すぎる | fill(playerColor, 100) の 100 を大きくする |

---

## 🎓 学習ポイント

✅ **座標変換** — translate で原点移動、rotate で回転  
✅ **グラフィック状態の保存** — push/pop で状態を保存・復元  
✅ **アニメーション** — frameCount を使ったアニメーション  
✅ **透明度** — fill の 4 番目引数で透明度を制御

