# LESSON_6H：ビジュアルカスタマイズ - ゲーム画面の色と形を変える

## 🎯 学習目標

プレイヤー、敵、背景の色・形・サイズを変更して、ゲーム画面の見た目を大きく変える。

- プレイヤーの色・形を変更する方法
- 敵の見た目を変更する方法
- 背景色の変更
- p5.js の描画関数（`fill()`、`circle()`、`rect()` など）の活用
- 描画の細かい制御（`push()`、`pop()`、`translate()`、`rotate()`）
- 生徒が独自のキャラクターデザインを作成できるようにする

---

## 💡 ビジュアルカスタマイズとは

### ゲーム画面の重要性

**見た目がしょぼいゲーム** vs **見た目がかっこいいゲーム**

同じゲーム性でも、見た目で大きく印象が変わります。

### このレッスンでできること

- **プレイヤーキャラ** — 色・形・サイズを変更
- **敵キャラ** — 敵ごとに異なるデザイン
- **背景** — 単なる色から、パターン背景へ
- **効果** — `rotate()`、`translate()` で動的な表現

---

## 🎨 p5.js の色表現

### RGB カラーモデル

p5.js では、色を RGB（赤・緑・青）で表現します。

```javascript
// RGB の範囲：0〜255
fill([255, 0, 0]);    // 赤
fill([0, 255, 0]);    // 緑
fill([0, 0, 255]);    // 青
fill([255, 255, 0]);  // 黄色
fill([255, 0, 255]);  // マゼンタ
fill([0, 255, 255]);  // シアン
fill([255, 255, 255]); // 白
fill([0, 0, 0]);      // 黒
```

### よく使う色

```javascript
const COLORS = {
  red: [255, 100, 100],
  green: [100, 255, 100],
  blue: [100, 100, 255],
  yellow: [255, 255, 100],
  cyan: [100, 255, 255],
  magenta: [255, 100, 255],
  orange: [255, 160, 100],
  purple: [200, 100, 255]
};

fill(COLORS.red);  // 赤で塗りつぶし
```

---

## 📚 重要な描画関数

### `fill()` — 色を設定

```javascript
fill([255, 0, 0]);  // 赤に設定
circle(100, 100, 50);  // 赤い円が描かれる
```

### `circle()` — 円を描く

```javascript
circle(x, y, size);

circle(300, 200, 40);  // (300, 200) に半径40の円
```

### `rect()` — 四角形を描く

```javascript
rect(x, y, width, height);

rect(250, 150, 100, 50);  // (250, 150) から幅100, 高さ50の四角形
```

### `triangle()` — 三角形を描く

```javascript
triangle(x1, y1, x2, y2, x3, y3);

triangle(300, 200, 250, 300, 350, 300);  // 三角形
```

### `push()` と `pop()` — 描画状態の保存・復元

```javascript
push();     // 現在の描画状態を保存
fill([255, 0, 0]);
translate(100, 100);
rotate(PI / 4);
circle(0, 0, 50);
pop();      // 描画状態を復元（fillや回転は元に戻る）
```

### `translate()` — 座標を移動

```javascript
push();
translate(300, 200);  // 原点を(300, 200)に移動
circle(0, 0, 50);     // (300, 200)に円が描かれる
pop();
```

### `rotate()` — 回転

```javascript
push();
translate(300, 200);
rotate(PI / 4);  // 45度回転
rect(-25, -25, 50, 50);  // 回転した四角形
pop();
```

---

## 🎮 実装の流れ

### ステップ1：プレイヤーの色を変更

```javascript
// グローバル変数
let playerColor = [102, 250, 255];  // シアン色

function drawPlayer() {
  push();
  translate(playerX, playerY);
  
  fill(playerColor);  // プレイヤーの色を使用
  
  // 三角形（矢印型）
  beginShape();
  vertex(0, -playerSize * 1.6);      // 上
  vertex(-playerSize, playerSize);   // 左下
  vertex(0, playerSize * 0.45);      // 中央下
  vertex(playerSize, playerSize);    // 右下
  endShape(CLOSE);
  
  pop();
}

// キー入力で色を変更
function keyPressed() {
  if (key === '1') playerColor = [255, 100, 100];  // 赤
  if (key === '2') playerColor = [100, 255, 100];  // 緑
  if (key === '3') playerColor = [100, 100, 255];  // 青
  return false;
}
```

### ステップ2：敵の色を変更

```javascript
function drawEnemy(e) {
  push();
  translate(e.x, e.y);
  
  // 敵のタイプによって色を変更
  if (e.type === 'tank') {
    fill([255, 160, 93]);   // オレンジ
  } else if (e.type === 'zig') {
    fill([100, 255, 180]);  // 緑
  } else {
    fill([255, 102, 142]);  // 赤（デフォルト）
  }
  
  circle(0, 0, e.r * 2);
  
  pop();
}
```

### ステップ3：背景色の変更

```javascript
// ゲーム画面の背景色を変更
function draw() {
  // デフォルト背景
  background([7, 12, 33]);  // 濃紺
  
  // または、ステージに応じて背景色を変更
  const stage = STAGES[stageIndex];
  background(stage.bg);  // ステージの背景色
}
```

### ステップ4：敵の形を変更

```javascript
function drawEnemy(e) {
  push();
  translate(e.x, e.y);
  rotate(elapsed * (e.type === 'zig' ? 3 : 1));
  
  // 敵のタイプによって形を変更
  if (e.type === 'tank') {
    // 6角形
    fill([255, 160, 93]);
    drawPolygon(0, 0, e.r, 6);
  } else {
    // 4角形
    fill([255, 102, 142]);
    drawPolygon(0, 0, e.r, 4);
  }
  
  pop();
}
```

---

## 📝 段階的な実装ガイド

### 段階1：プレイヤーの色を変更（10分程度）

目標：プレイヤーの色を変更して、キー入力で色を切り替える

```javascript
let playerColor = [102, 250, 255];

function drawPlayer() {
  push();
  translate(playerX, playerY);
  fill(playerColor);
  
  // プレイヤーの形（三角形）
  beginShape();
  vertex(0, -20);
  vertex(-15, 15);
  vertex(0, 5);
  vertex(15, 15);
  endShape(CLOSE);
  
  pop();
}

function keyPressed() {
  if (key === '1') playerColor = [255, 100, 100];
  if (key === '2') playerColor = [100, 255, 100];
  if (key === '3') playerColor = [100, 100, 255];
  return false;
}
```

**確認ポイント：** 1, 2, 3キーを押すと、プレイヤーの色が変わるか確認

---

### 段階2：敵の色を変更（15分程度）

目標：敵の種類によって色が異なる

```javascript
function drawEnemy(e) {
  push();
  translate(e.x, e.y);
  
  if (e.type === 'normal') {
    fill([255, 100, 100]);  // 赤
  } else if (e.type === 'fast') {
    fill([100, 255, 100]);  // 緑
  } else if (e.type === 'slow') {
    fill([100, 100, 255]);  // 青
  }
  
  circle(0, 0, e.r * 2);
  
  pop();
}
```

**確認ポイント：** 異なる敵が異なる色で描かれるか確認

---

### 段階3：背景を変更（15分程度）

目標：ステージに応じて背景色が変わる

```javascript
const STAGES = [
  {
    name: 'ステージ1',
    bg: [0, 0, 50],        // 濃い青
    accent: [100, 200, 255]
  },
  {
    name: 'ステージ2',
    bg: [50, 0, 0],        // 濃い赤
    accent: [255, 100, 100]
  },
  {
    name: 'ステージ3',
    bg: [0, 50, 0],        // 濃い緑
    accent: [100, 255, 100]
  }
];

function draw() {
  const stage = STAGES[stageIndex];
  background(stage.bg);  // ステージの背景色
}
```

**確認ポイント：** ステージを選ぶと、背景色が変わるか確認

---

### 段階4：敵の形を変更（20分程度）

目標：敵の種類によって形が異なる（円・四角形・多角形など）

```javascript
function drawEnemy(e) {
  push();
  translate(e.x, e.y);
  
  if (e.type === 'tank') {
    fill([255, 160, 93]);
    drawPolygon(0, 0, e.r, 6);  // 6角形
  } else if (e.type === 'zig') {
    fill([100, 255, 180]);
    rect(-e.r, -e.r, e.r * 2, e.r * 2);  // 四角形
  } else {
    fill([255, 102, 142]);
    circle(0, 0, e.r * 2);  // 円
  }
  
  pop();
}
```

**確認ポイント：** 敵の種類によって形が異なるか確認

---

## 🧠 理解を深める：`push()` と `pop()`

### なぜ必要なのか

```javascript
// push() と pop() がない場合
fill([255, 0, 0]);
translate(100, 100);
circle(0, 0, 50);

fill([0, 255, 0]);
rect(200, 200, 100, 100);  // ← これが (200 + 100, 200 + 100) に描かれる！
                           // translate が継続しているから
```

### push() と pop() を使う場合

```javascript
push();
fill([255, 0, 0]);
translate(100, 100);
circle(0, 0, 50);
pop();  // translate と fill がリセット

fill([0, 255, 0]);
rect(200, 200, 100, 100);  // (200, 200) に描かれる。正しい！
```

**重要：** `push()` で状態を保存、`pop()` で復元することで、他の描画に影響しない

---

## 💾 完全な実装例

### グローバル変数

```javascript
let playerColor = [102, 250, 255];

const STAGE_COLORS = {
  stage1: { bg: [7, 16, 41], accent: [78, 245, 255] },
  stage2: { bg: [38, 11, 33], accent: [255, 173, 91] },
  stage3: { bg: [16, 9, 40], accent: [220, 163, 255] }
};
```

### プレイヤーの描画

```javascript
function drawPlayer() {
  push();
  translate(playerX, playerY);
  
  // プレイヤーは無敵時間中は透明度が低い
  if (player.inv > 0 && floor(elapsed * 12) % 2 === 0) {
    fill(playerColor[0], playerColor[1], playerColor[2], 90);  // 透明
  } else {
    // 無敵状態なら黄色
    let c = player.star > 0 ? [255, 233, 108] : playerColor;
    fill(c);
  }
  
  noStroke();
  
  // 矢印型（三角形）
  beginShape();
  vertex(0, -player.r * 1.6);
  vertex(-player.r, player.r);
  vertex(0, player.r * 0.45);
  vertex(player.r, player.r);
  endShape(CLOSE);
  
  pop();
}
```

### 敵の描画

```javascript
function drawEnemy(e) {
  push();
  translate(e.x, e.y);
  rotate(elapsed * (e.type === 'zig' ? 3 : 1));
  
  // 敵のタイプによって色を変更
  if (e.type === 'tank') {
    fill([255, 160, 93]);
  } else {
    fill([255, 102, 142]);
  }
  
  noStroke();
  
  // 敵のタイプによって形を変更
  if (e.type === 'tank') {
    drawPolygon(0, 0, e.r, 6);  // 6角形
  } else {
    drawPolygon(0, 0, e.r, 4);  // 4角形
  }
  
  pop();
}
```

### 背景の描画

```javascript
function draw() {
  const stage = STAGES[stageIndex];
  background(stage.bg);
  
  // グリッド背景を描画（オシャレ効果）
  stroke(stage.accent);
  strokeWeight(1);
  let offset = (elapsed * 40) % 40;
  for (let x = 0; x < width; x += 40) {
    line(x, 0, x, height);
  }
  for (let y = offset; y < height; y += 40) {
    line(0, y, width, y);
  }
}
```

### キー入力で色を変更

```javascript
function keyPressed() {
  const k = key.toLowerCase();
  
  if (k === '1') playerColor = [255, 100, 100];  // 赤
  if (k === '2') playerColor = [100, 255, 100];  // 緑
  if (k === '3') playerColor = [100, 100, 255];  // 青
  
  return false;
}
```

---

## 🎨 生徒の工夫例

### 工夫例1：プレイヤーをカスタマイズ

```javascript
// 敵やプレイヤーの形を星形に変更
function drawCustomShape(points, size) {
  beginShape();
  for (let i = 0; i < points; i++) {
    const angle = (TWO_PI / points) * i;
    const x = cos(angle) * size;
    const y = sin(angle) * size;
    vertex(x, y);
  }
  endShape(CLOSE);
}

// 使用例：星形（5点）
fill([255, 255, 100]);
drawCustomShape(5, 30);
```

**特徴：** プレイヤーが星形になる

---

### 工夫例2：グラデーション背景

```javascript
function drawGradientBackground() {
  // 上が青、下が黒のグラデーション
  for (let y = 0; y < height; y++) {
    const ratio = y / height;
    const r = 0;
    const g = 100 * (1 - ratio);
    const b = 200 * (1 - ratio);
    
    stroke([r, g, b]);
    line(0, y, width, y);
  }
}

function draw() {
  drawGradientBackground();
}
```

**特徴：** グラデーション背景でより美しいビジュアル

---

### 工夫例3：敵のサイズを動的に変更

```javascript
function drawEnemy(e) {
  push();
  translate(e.x, e.y);
  
  // 時間に応じてサイズが変わる
  const scale = 1 + sin(elapsed * 3) * 0.2;
  
  fill([255, 100, 100]);
  circle(0, 0, e.r * 2 * scale);
  
  pop();
}
```

**特徴：** 敵が明滅するように見える

---

### 工夫例4：敵の内側に円を描く（眼のような表現）

```javascript
function drawEnemy(e) {
  push();
  translate(e.x, e.y);
  
  // 敵の本体
  fill([255, 100, 100]);
  circle(0, 0, e.r * 2);
  
  // 敵の眼
  fill([0, 0, 0]);
  circle(-e.r * 0.5, -e.r * 0.3, e.r * 0.3);
  circle(e.r * 0.5, -e.r * 0.3, e.r * 0.3);
  
  pop();
}
```

**特徴：** 敵が眼を持つキャラクターに見える

---

### 工夫例5：プレイヤーが回転する

```javascript
function drawPlayer() {
  push();
  translate(playerX, playerY);
  rotate(elapsed * 2);  // 常に回転
  
  fill(playerColor);
  rect(-15, -15, 30, 30);  // 回転する四角形
  
  pop();
}
```

**特徴：** プレイヤーが回転し、ダイナミックに見える

---

### 工夫例6：敵にハイライトを付ける

```javascript
function drawEnemy(e) {
  push();
  translate(e.x, e.y);
  
  // 敵の本体
  fill([255, 100, 100]);
  circle(0, 0, e.r * 2);
  
  // ハイライト（左上）
  fill([255, 255, 255], 150);  // 白、透明度
  circle(-e.r * 0.5, -e.r * 0.5, e.r * 0.5);
  
  pop();
}
```

**特徴：** ハイライトで敵が立体的に見える

---

## ❓ 理解度確認クイズ

### クイズ1：RGB カラー

`fill([255, 0, 0])` で何色が塗りつぶされますか？

**選択肢：**
- A. 赤
- B. 緑
- C. 青

**答え：** A（255 = 赤, 0 = 緑, 0 = 青）

---

### クイズ2：`push()` と `pop()`

以下のコードで、2番目の四角形は何色で描かれますか？

```javascript
push();
fill([255, 0, 0]);
rect(100, 100, 50, 50);
pop();

rect(200, 200, 50, 50);  // 何色？
```

**選択肢：**
- A. 赤
- B. 黒（デフォルト色）
- C. 描画されない

**答え：** B（`pop()` で fill の設定がリセット）

---

### クイズ3：`translate()`

以下のコードで、円は何処に描かれますか？

```javascript
push();
translate(100, 100);
circle(0, 0, 50);
pop();
```

**選択肢：**
- A. (0, 0) に描かれる
- B. (100, 100) に描かれる
- C. (0, 0) と (100, 100) の両方に描かれる

**答え：** B（`translate(100, 100)` で原点が (100, 100) に移動）

---

### クイズ4：`rotate()`

`rotate(PI / 4)` で何度回転しますか？

**選択肢：**
- A. 45度
- B. 90度
- C. 180度

**答え：** A（PI / 4 ラジアン = 45度）

---

## 📌 重要ポイントまとめ

| ポイント | 説明 | コード例 |
|---------|------|---------|
| **RGB カラー** | 0〜255で色を指定 | `fill([255, 100, 100])` |
| **`circle()`** | 円を描く | `circle(x, y, size)` |
| **`rect()`** | 四角形を描く | `rect(x, y, w, h)` |
| **`triangle()`** | 三角形を描く | `triangle(x1, y1, x2, y2, x3, y3)` |
| **`push()` / `pop()`** | 描画状態を保存・復元 | `push()` ... `pop()` |
| **`translate()`** | 座標を移動 | `translate(x, y)` |
| **`rotate()`** | 回転 | `rotate(radians)` |

---

## 🎓 コーチからのアドバイス

### 「色が見分けにくい」

RGB値を調整してみてください。明るさを大きく変えると見分けやすくなります。

```javascript
// 見分けやすい色
fill([255, 0, 0]);      // 明るい赤
fill([0, 255, 0]);      // 明るい緑
fill([0, 0, 255]);      // 明るい青
```

### 「複数の形を組み合わせたい」

`beginShape()` と `vertex()` を使って、好きな形を作ることができます。

```javascript
beginShape();
vertex(0, -30);
vertex(20, -10);
vertex(30, 0);
vertex(20, 10);
vertex(0, 30);
vertex(-20, 10);
vertex(-30, 0);
vertex(-20, -10);
endShape(CLOSE);
```

### 「敵がちらちら点滅する」

`sin()` や `cos()` を使って、スムーズに明滅させることができます。

```javascript
const brightness = sin(elapsed * 3) * 127 + 128;
fill([255, brightness, brightness]);
```

---

## 🔗 次のステップ

1. **基本的な色変更から** — プレイヤーとか敵の色を変更
2. **背景を変更** — ステージごとに異なる背景
3. **敵の形を変更** — 円・四角形・多角形
4. **詳細な描画** — ハイライト、影、眼
5. **さらに工夫** — グラデーション、回転、動的なサイズ変更

---

## ✅ 成功の目安

- [ ] プレイヤーの色がキー入力で変わる
- [ ] 敵の種類によって色が異なる
- [ ] 背景色がステージに応じて変わる
- [ ] 敵の形が複数種類ある（円・四角形・多角形など）
- [ ] `push()` と `pop()` を正しく使用している
- [ ] `translate()` と `rotate()` で動的な表現ができている

---

## 💪 最後に

ビジュアルカスタマイズは、ゲームの第一印象を左右します。

シンプルなコードからでも、工夫次第で素晴らしいビジュアルが生まれます。

いろいろな色・形・効果を試して、自分だけのオリジナルゲームを作ってください！

質問があれば、いつでもコーチに聞いてね！

頑張れ！🎮🎨✨
