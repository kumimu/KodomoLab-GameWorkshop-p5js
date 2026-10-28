# LESSON_6B：射撃機能 - プレイヤーが反撃できるようにする

## 🎯 学習目標

プレイヤーが敵に反撃できる射撃機能を実装する。

- 弾の配列管理の仕組み
- キー入力で射撃する方法
- 敵との当たり判定（`dist()` 関数の活用）
- 射撃クールタイムの実装
- 複数の弾を発射する工夫

---

## 💡 射撃機能とは

### 基礎版との違い

**基礎版：** プレイヤーは敵を避けるだけ

```
敵：●●●
プレイヤー：▲
→ 避けるしかできない
```

**応用版：** プレイヤーが反撃できる

```
敵：●●●
弾：↑↑↑
プレイヤー：▲
→ 敵を撃破できる！
```

**結果：** ゲームの戦略が大きく変わる。受動的から能動的なゲームになる

---

## 📚 弾の配列管理

### 敵の配列と似ている

LESSON_4で学んだ敵の配列と同じ仕組みを使います。

```javascript
// 敵の配列
let enemies = [];

// 弾の配列（新しく追加）
let bullets = [];
```

### 弾のデータ構造

```javascript
// 1つの弾
{
  x: 300,      // 弾のX座標
  y: 345,      // 弾のY座標
  vy: -690,    // 弾の速度（Y方向）。マイナスは上へ移動
  r: 5         // 弾の半径（サイズ）
}
```

### 複数の弾を管理

```javascript
// 弾が3個ある場合
bullets = [
  { x: 300, y: 345, vy: -690, r: 5 },
  { x: 250, y: 290, vy: -690, r: 5 },
  { x: 350, y: 200, vy: -690, r: 5 }
]
```

敵と同じように、配列で複数の弾を一括管理します。

---

## 🎮 実装の流れ

### ステップ1：グローバル変数に弾の配列を追加

```javascript
// グローバル変数の宣言部分に追加
let bullets = [];      // 弾の配列
let shotTimer = 0;     // 射撃クールタイム
```

### ステップ2：キー入力で射撃する

```javascript
function keyPressed() {
  // スペースキーが押された
  if (key === ' ') {
    shoot();  // 射撃関数を呼ぶ
  }
  return false;
}

function shoot() {
  // クールタイム中は発射できない
  if (shotTimer > 0) return;
  
  // クールタイムを設定（0.18秒間は次の射撃ができない）
  shotTimer = 0.18;
  
  // 弾を生成
  bullets.push({
    x: playerX,
    y: playerY - 20,  // プレイヤーの少し上から発射
    vy: -690,         // 上へ移動
    r: 5
  });
  
  // 射撃音
  playSound(480, 0.05);
}
```

### ステップ3：クールタイムを更新

```javascript
// update 関数内（毎フレーム実行）
function updateGame(dt) {
  // クールタイムを減らす
  shotTimer = max(0, shotTimer - dt);
  
  // その他の更新処理...
}
```

### ステップ4：弾を移動

```javascript
// updateGame() 関数内

// 弾を移動
for (let b of bullets) {
  b.y += b.vy * dt;  // 上へ移動
}

// 画面外に出た弾を削除
bullets = bullets.filter(b => b.y > -20);
```

### ステップ5：敵との当たり判定

```javascript
// updateGame() 関数内

// 弾と敵の当たり判定
for (let b of bullets) {
  for (let e of enemies) {
    // 弾と敵の距離を計算（LESSON_4で学んだ！）
    if (dist(b.x, b.y, e.x, e.y) < b.r + e.r) {
      // 敵に衝突した！
      destroyEnemy(e);
      
      // 弾と敵を削除
      bullets.splice(bullets.indexOf(b), 1);
      enemies.splice(enemies.indexOf(e), 1);
      
      break;  // ループを抜ける
    }
  }
}
```

### ステップ6：弾を描画

```javascript
// draw() 関数内

// 弾の描画
fill([145, 251, 255]);  // シアン色
noStroke();

for (let b of bullets) {
  rect(b.x - 3, b.y - 13, 6, 17);  // 長方形の弾
}
```

---

## 📝 段階的な実装ガイド

### 段階1：基本的な射撃（15分程度）

目標：スペースキーで敵をきとう

```javascript
// グローバル変数を追加
let bullets = [];
let shotTimer = 0;

function shoot() {
  if (shotTimer > 0) return;
  shotTimer = 0.18;
  
  bullets.push({
    x: playerX,
    y: playerY - 20,
    vy: -400,
    r: 5
  });
}

function keyDown(e) {
  if (e.code === 'Space' || e.code === 'KeyZ') {
    shoot();
  }
}

// updateGame()内で弾を移動
for (let b of bullets) {
  b.y += b.vy * dt;
}

// 画面外に出た弾を削除
bullets = bullets.filter(b => b.y > -20 && b.x > 0 && b.x < W);
```

**確認ポイント：** スペースキーを押すと弾が上へ発射されるか確認

**注意：**
- `keyPressed()` ではなく `keyDown()` イベントリスナーを使用
- p5.js の `key` ではなく `e.code` を使用
- `max()` ではなく `Math.max()` を使用

---

### 段階2：弾と敵の当たり判定（20分程度）

目標：敵に弾が当たると敵が消える

```javascript
// 当たり判定用の補助関数（game.js から）
function circle(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;
}

// updateGame()内で当たり判定を追加
for (let b of bullets) {
  for (let e of enemies) {
    if (e.hp > 0 && circle(b, e)) {
      // 敵と弾が接触した
      e.hp--;
      b.y = -100;  // 弾を画面外へ
      
      if (e.hp <= 0) {
        score += e.value;  // スコア加算
        // 敵が破壊されたら他の処理も追加（参照：LESSON_6M）
      }
      break;
    }
  }
}

// 破壊された敵を配列から削除
enemies = enemies.filter(e => e.hp > 0);
```

**確認ポイント：** 敵に弾が当たると敵が消えるか確認

**注意：**
- p5.js の `dist()` 関数は存在しないため、`circle()` ヘルパー関数を使用
- `Math.hypot()` で2点間の距離を計算
- 敵オブジェクトには `hp`（現在のHP）と `value`（得点）が必要

---

### 段階3：連続射撃への工夫（25分程度）

目標：クールタイムを調整して射撃の速度を変える

```javascript
function shoot() {
  // クールタイムの設定
  const interval = 0.15;  // 短いほど連続射撃できる
  
  if (shotTimer > 0) return;
  shotTimer = interval;
  
  bullets.push({
    x: playerX,
    y: playerY - 20,
    vy: -690,
    r: 5
  });
}
```

**確認ポイント：** スペースキーを連続で押すと連続射撃できるか確認

---

### 段階4：複数弾射撃（30分程度）

目標：1回の射撃で複数の弾を発射

```javascript
function shoot() {
  if (shotTimer > 0) return;
  shotTimer = 0.18;
  
  // 3本の弾を発射
  bullets.push({ x: playerX - 10, y: playerY - 20, vy: -690, r: 5 });
  bullets.push({ x: playerX, y: playerY - 20, vy: -690, r: 5 });
  bullets.push({ x: playerX + 10, y: playerY - 20, vy: -690, r: 5 });
}
```

**確認ポイント：** 1回で3本の弾が発射されるか確認

---

## 🧠 理解を深める：射撃のフロー図

### 射撃関数の処理フロー

```
keyPressed()
  ↓
スペースキーが押された？
  ├─ YES → shoot() を呼ぶ
  └─ NO  → 何もしない
  ↓
shoot()
  ↓
shotTimer > 0？（クールタイム中）
  ├─ YES → return（何もしない）
  └─ NO  → 続ける
  ↓
shotTimer = 0.18（クールタイム設定）
  ↓
弾をbullets配列に追加
  ↓
射撃音を鳴らす
```

### 当たり判定のフロー

```
毎フレーム updateGame()
  ↓
全ての弾に対して
  ├─ 弾をY方向に移動
  ├─ 全ての敵に対して
  │   ├─ 弾と敵の距離を計算
  │   ├─ 距離 < 敵のサイズ + 弾のサイズ？
  │   │  ├─ YES → 当たり判定！
  │   │  │       敵を削除、弾を削除、スコア加算
  │   │  └─ NO  → 次の敵へ
  │   └─
  └─ 次の弾へ
```

---

## 💾 完全な実装例

### グローバル変数の追加

```javascript
let bullets = [];
let shotTimer = 0;
```

### 射撃関数

```javascript
function shoot() {
  // クールタイム中は発射できない
  if (shotTimer > 0) return;
  
  // クールタイムを設定
  shotTimer = 0.18;
  
  // 1本の弾を発射
  bullets.push({
    x: playerX,
    y: playerY - 24,
    vy: -690,
    r: 5
  });
  
  // 射撃音
  playSound(480, 0.05);
}
```

### キー入力（新機能）

```javascript
function keyPressed() {
  const code = event.code;
  const k = key.toLowerCase();
  
  // スペースキーまたはZキー
  if (code === 'Space' || k === 'z') {
    shoot();
    return false;
  }
  
  return false;
}
```

### 毎フレームの更新処理

```javascript
function updateGame(dt) {
  // ... 既存の処理 ...
  
  // クールタイムを減らす
  shotTimer = max(0, shotTimer - dt);
  
  // 弾を移動
  for (let b of bullets) {
    b.y += b.vy * dt;
  }
  
  // 画面外に出た弾を削除
  bullets = bullets.filter(b => b.y > -20);
  
  // 弾と敵の当たり判定
  for (let b of bullets) {
    for (let e of enemies) {
      if (e.hp > 0 && dist(b.x, b.y, e.x, e.y) < b.r + e.r) {
        e.hp--;
        b.y = -100;  // 弾を画面外に出す
        
        if (e.hp <= 0) {
          destroyEnemy(e);
        }
        break;
      }
    }
  }
  
  // 消滅した弾を配列から削除
  bullets = bullets.filter(b => b.y > -20 && b.x > 0 && b.x < CONFIG.canvasW);
}
```

### 弾の描画

```javascript
function draw() {
  // ... 背景とかの描画 ...
  
  // 弾を描画
  fill([145, 251, 255]);  // シアン色
  noStroke();
  
  for (let b of bullets) {
    rect(b.x - 3, b.y - 13, 6, 17);  // 弾の形
  }
}
```

---

## 🎨 生徒の工夫例

### 工夫例1：複数の弾を発射

```javascript
function shoot() {
  if (shotTimer > 0) return;
  shotTimer = 0.18;
  
  // 左右に分かれて発射
  bullets.push({ x: playerX - 15, y: playerY - 20, vy: -690, r: 5 });
  bullets.push({ x: playerX, y: playerY - 20, vy: -690, r: 5 });
  bullets.push({ x: playerX + 15, y: playerY - 20, vy: -690, r: 5 });
}
```

**特徴：** 1回で3本発射。当たりやすくなり、敵が倒しやすくなる

---

### 工夫例2：急速射撃モード

```javascript
let rapidFireMode = false;
let rapidFireTimer = 0;

function shoot() {
  // 急速射撃モード中は短いクールタイム
  const interval = rapidFireMode ? 0.08 : 0.18;
  
  if (shotTimer > 0) return;
  shotTimer = interval;
  
  bullets.push({
    x: playerX,
    y: playerY - 20,
    vy: -690,
    r: 5
  });
}
```

**特徴：** パワーアップ時に急速射撃できるようになる

---

### 工夫例3：斜め射撃

```javascript
function shoot(angle = 0) {
  if (shotTimer > 0) return;
  shotTimer = 0.18;
  
  bullets.push({
    x: playerX,
    y: playerY - 20,
    vx: sin(angle) * 300,  // X方向にも移動
    vy: cos(angle) * 400,  // Y方向に移動
    r: 5
  });
}

// 左右キーで角度を変える
function keyPressed() {
  if (key === 'a' || keyCode === LEFT_ARROW) {
    shoot(-0.3);  // 左斜め射撃
  } else if (key === 'd' || keyCode === RIGHT_ARROW) {
    shoot(0.3);   // 右斜め射撃
  } else if (key === ' ') {
    shoot(0);     // 真上
  }
  return false;
}

// updateGame()で弾の移動を追加
for (let b of bullets) {
  b.y += b.vy * dt;
  if (b.vx) b.x += b.vx * dt;  // X方向の移動も考慮
}
```

**特徴：** 斜め射撃で敵の動きに応じた射撃ができる

---

### 工夫例4：弾の大きさを変える

```javascript
function shoot(power = 'normal') {
  if (shotTimer > 0) return;
  shotTimer = 0.18;
  
  let r = 5;
  let vy = -690;
  
  if (power === 'strong') {
    r = 10;    // 大きい弾
    vy = -900; // 速い
  } else if (power === 'weak') {
    r = 3;     // 小さい弾
    vy = -500; // 遅い
  }
  
  bullets.push({
    x: playerX,
    y: playerY - 20,
    vy: vy,
    r: r
  });
}
```

**特徴：** 弾の大きさで威力を表現。大きい弾は敵に大ダメージ

---

### 工夫例5：弾の色で種類を表現

```javascript
function shoot(type = 'normal') {
  if (shotTimer > 0) return;
  shotTimer = 0.18;
  
  bullets.push({
    x: playerX,
    y: playerY - 20,
    vy: -690,
    r: 5,
    type: type  // 弾の種類
  });
}

// 描画時に色を変える
for (let b of bullets) {
  if (b.type === 'fire') {
    fill([255, 100, 0]);   // オレンジ
  } else if (b.type === 'ice') {
    fill([0, 100, 255]);   // 青
  } else {
    fill([145, 251, 255]); // シアン
  }
  
  rect(b.x - 3, b.y - 13, 6, 17);
}
```

**特徴：** 敵の種類によって弾を選べる。敵によって有効な弾が異なる

---

### 工夫例6：ボムアイテム

```javascript
function shoot(isBomb = false) {
  if (shotTimer > 0) return;
  shotTimer = isBomb ? 0.5 : 0.18;  // ボムはクールタイムが長い
  
  bullets.push({
    x: playerX,
    y: playerY - 20,
    vy: -690,
    r: isBomb ? 15 : 5,  // ボムは大きい
    isBomb: isBomb
  });
}

// 当たり判定で敵の倒し方を変える
if (b.isBomb && dist(b.x, b.y, e.x, e.y) < b.r + e.r) {
  // ボムは範囲ダメージ
  for (let target of enemies) {
    if (dist(b.x, b.y, target.x, target.y) < 100) {
      target.hp = 0;
    }
  }
  b.y = -100;
}
```

**特徴：** ボムアイテムで周囲の敵を一気に倒せる

---

## ❓ 理解度確認クイズ

### クイズ1：弾の配列

弾を管理するために配列を使う理由は何ですか？

**選択肢：**
- A. プレイヤーが複数の弾を同時に画面上に表示できるから
- B. コードを短くするから
- C. ゲームが速くなるから

**答え：** A（複数の弾を同時に管理できる）

---

### クイズ2：クールタイム

`shotTimer = 0.18` に設定した場合、次の射撃ができるまでに何秒かかりますか？

**選択肢：**
- A. 0.18秒
- B. 18秒
- C. 1.8秒

**答え：** A（0.18秒 = 180ミリ秒）

---

### クイズ3：当たり判定の計算

以下のコードで、敵と弾が当たったかどうかを判定しています。どの条件が正しいですか？

```javascript
if (dist(b.x, b.y, e.x, e.y) < b.r + e.r)
```

**選択肢：**
- A. 距離が敵のサイズより小さい
- B. 距離が敵のサイズ + 弾のサイズより小さい（当たり判定）
- C. X座標が同じ

**答え：** B（2つのオブジェクトが接触する距離を計算）

---

### クイズ4：弾の削除

以下のコードは何をしていますか？

```javascript
bullets = bullets.filter(b => b.y > -20);
```

**選択肢：**
- A. Y座標が-20より大きい弾を削除する
- B. Y座標が-20より小さい弾を削除する
- C. 画面外に出た弾を削除する

**答え：** B（画面の上を超えた弾を削除して、メモリを節約）

---

## 📌 重要ポイントまとめ

| ポイント | 説明 | コード例 |
|---------|------|---------|
| **弾の配列** | 複数の弾を管理 | `let bullets = []` |
| **クールタイム** | 射撃の速さを制御 | `shotTimer = 0.18` |
| **当たり判定** | `dist()` で距離を計算 | `dist(b.x, b.y, e.x, e.y) < b.r + e.r` |
| **弾の削除** | 配列から不要な弾を削除 | `filter(b => b.y > -20)` |
| **複数弾射撃** | 1回で複数の弾を発射 | `bullets.push(...) × 複数回` |

---

## 🎓 コーチからのアドバイス

### 「当たり判定が難しい」

当たり判定は LESSON_4 で学んだ `dist()` と同じです。

```javascript
// プレイヤーと敵の当たり判定（LESSON_4）
dist(playerX, playerY, e.x, e.y) < playerSize/2 + e.r

// 弾と敵の当たり判定（同じ仕組み）
dist(b.x, b.y, e.x, e.y) < b.r + e.r
```

---

### 「弾が画面外に出ない」

弾の `vy` が負の値になっているか確認してください。

```javascript
vy: -690  // 上へ移動（マイナスだから）
vy: 690   // 下へ移動（プラスだから）
```

---

### 「複数の弾が同時に発射できない」

クールタイムが長すぎないか確認してください。

```javascript
shotTimer = 0.05;  // 短い（連続射撃しやすい）
shotTimer = 0.5;   // 長い（連続射撃しにくい）
```

---

## 🔗 次のステップ

1. **基本的な射撃から** — スペースキーで1本の弾を発射
2. **当たり判定を追加** — 敵に弾が当たると敵が消える
3. **連続射撃** — クールタイムを調整
4. **複数弾射撃** — 1回で複数の弾を発射
5. **さらに工夫** — 急速射撃モード、ボム、斜め射撃など

---

## ✅ 成功の目安

- [ ] スペースキーで弾が発射される
- [ ] 弾が敵に当たると敵が消える
- [ ] 敵と弾が当たるたびにスコアが加算される
- [ ] 連続してスペースキーを押すと連続射撃できる
- [ ] 画面外に出た弾が配列から削除されている（パフォーマンスが落ちない）

---

## 💪 最後に

射撃機能を追加することで、ゲームの遊び方が大きく変わります。

敵を「避ける」から「倒す」へ、ゲームプレイが能動的になります。

段階的に実装を進めて、最後に工夫を加えることが成功のコツです。

質問があれば、いつでもコーチに聞いてね！

頑張れ！🎮✨

---

## 🔗 他の詳細レッスンとの関連性

### LESSON_6A（敵の多様化）との連携 ⭐ 重要

**LESSON_6A で設定される敵の `hp` プロパティが、LESSON_6B の当たり判定の基礎になります。**

LESSON_6A で敵に設定される HP：
```javascript
hp: type === 'tank' ? 3 : 1
```

LESSON_6B で使用される当たり判定：
```javascript
if (e.hp > 0 && circle(b, e)) {
  e.hp--;
  if (e.hp <= 0) destroyEnemy(e);
}
```

**一緒に実装した場合の効果：**
- 敵の種類によって、必要な射撃回数が異なる
- tank は 3 回射撃が必要（難しい敵）
- 敵の強さがゲームプレイに反映される

---

### LESSON_6M（スコアシステムの工夫）との連携 ⭐ 重要

**LESSON_6B で敵を撃破した時点で、LESSON_6M のスコア計算が実行されます。**

LESSON_6B での敵撃破のトリガー：
```javascript
if (e.hp <= 0) destroyEnemy(e);
```

LESSON_6M での destroyEnemy 関数：
```javascript
function destroyEnemy(e) {
  score += e.value * (1 + Math.floor(combo / 5));
  combo++;
  comboTimer = 3;
}
```

**一緒に実装した場合の効果：**
- 敵を撃破するたびにスコアが加算される
- 連続で敵を倒すと、コンボによってスコアが増える
- ゲームの爽快感が格段に上がる

---

### LESSON_6H（ビジュアルカスタマイズ）との連携

**敵撃破時の演出で、敵の見た目（色・形）が重要になります。**

LESSON_6B での敵撃破時の視覚効果：
```javascript
burst(e.x, e.y, e.type === 'tank' ? '#ffb763' : '#ff6a9e', 15);
```

LESSON_6H での敵の色設定が、ここに反映されます。

**一緒に実装した場合の効果：**
- 敵撃破時に、敵と同じ色の爆発エフェクトが発生
- ビジュアル的な統一感が生まれる

---

### LESSON_6G（BGMのカスタマイズ）との連携

**敵撃破時の効果音で、射撃のフィードバックが完成します。**

LESSON_6B での敵撃破時の効果音：
```javascript
sound(250 + Math.min(combo, 20) * 30, 0.1, 'triangle', 0.023);
```

コンボが増えるにつれて、音も高くなります。

**一緒に実装した場合の効果：**
- 敵撃破時に、コンボに応じた周波数の音が鳴る
- 敵撃破の爽快感が音でも表現される

---

## 🔗 関連するレッスン・参考資料

### このレッスンと関連する改造オプション

**組み合わせ例1：射撃機能 + 敵の多様化**
- 敵の種類ごとに異なるダメージを与えたい
- → **[A] 敵の多様化** の詳細レッスンも読む
- 敵の HP を設定すると、敵の種類ごとに撃破に必要な射撃回数が異なる

**組み合わせ例2：射撃機能 + スコアシステムの工夫**
- 敵を撃破したときの得点を複雑にしたい
- → **[M] スコアシステムの工夫** の詳細レッスンも読む
- コンボシステムと組み合わせると、ゲーム性が大きく変わる

**組み合わせ例3：射撃機能 + パーティクル効果**
- 敵を撃破したときの演出をもっと派手にしたい
- → **参考資料 [J] パーティクル効果** を参照
- 爆発エフェクトが敵撃破の爽快感を高める

### 参考資料への関連性

**[C] パワーアップシステムとの関連**
- 射撃速度アップアイテムが出現
- 射撃ボーナス時に連続射撃が可能
- → **参考資料 [C] パワーアップシステム** で詳細を確認

**[K] コンボシステムとの関連**
- 敵を連続で倒すとコンボが増加
- コンボが増えると得点倍率が上がる
- → **参考資料 [K] コンボシステム** で詳細を確認

### 時間が余った場合の発展課題

**課題1：複数弾射撃の工夫**
- 現在：1回の射撃で1本の弾
- 発展：Y字射撃、扇状射撃、ランダム角度射撃など
- コツ：複数の弾オブジェクトを同時に配列に追加

**課題2：異なる種類の弾を実装**
- 弾にも `type` プロパティを追加
- 通常弾、爆発弾、貫通弾など
- → 敵との当たり判定で、弾の種類に応じた処理を追加

**課題3：プレイヤーの位置に応じた射撃**
- 敵の位置をターゲットして射撃
- 敵を予測して射撃
- → 数学計算（角度、距離）を活用

**課題4：参考資料 [D] ボスバトルと組み合わせる**
- ボスに対して射撃が必要
- ボスの攻撃パターンに応じた射撃戦
- → ゲームの難易度設計が学べる

**課題5：射撃の弾数制限**
- 敵を撃破して弾をドロップ
- 弾が有限リソースになる
- → 戦略性が大幅に増す
