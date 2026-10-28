# LESSON_6A：敵の多様化 - 複数の種類の敵を作る

## 🎯 学習目標

敵に「type」プロパティを追加して、複数の種類の敵を区別し、敵のタイプに応じた異なる動きや見た目を実装する。

- 敵に「type」プロパティを追加する仕組み
- `if` 文で敵のタイプに応じた処理を分岐させる
- 敵のタイプごとに色・形・速度を変える方法
- 段階的な実装ステップ（最小限 → 工夫例）
- 生徒が自分で工夫できるヒント集

---

## 💡 敵の多様化とは

### 基礎版との違い

**基礎版：** 敵は全て同じ

- 色：赤
- 形：円形
- 動き：真っすぐ下へ落ちてくる
- 速度：同じ

```
敵1：●  敵2：●  敵3：●
全て同じ敵が落ちてくる
```

**応用版：** 敵を複数の種類に分ける

- **敵タイプ1（速い敵）** — 赤い敵、速度が速い
- **敵タイプ2（遅い敵）** — 青い敵、速度が遅い
- **敵タイプ3（揺れる敵）** — 緑の敵、左右に揺れながら落ちる

```
敵1(速):◆  敵2(遅):■  敵3(揺):✱
種類が異なる敵が落ちてくる
```

**結果：** ゲームの戦略性が大きく変わる

---

## 📚 敵のデータ構造（復習）

### LESSON_4で学んだこと

敵は「オブジェクト」という、複数のデータをまとめたものです。

```javascript
// 基礎版の敵
{
  x: 150,           // 敵のX座標
  y: -100,          // 敵のY座標
  speed: 6.5,       // 敵の速度
  r: 25             // 敵の半径（サイズ）
}
```

### 応用版では「type」プロパティを追加

```javascript
// 応用版の敵
{
  x: 150,           // 敵のX座標
  y: -100,          // 敵のY座標
  speed: 6.5,       // 敵の速度
  r: 25,            // 敵の半径
  type: "fast"      // ← 新しい！敵の種類を記録
}
```

**「type」は「種類」という意味です。**

---

## 🎮 実装の流れ

### ステップ1：敵の「type」を決める

敵を生成するときに、ランダムに敵の種類を決めます。

```javascript
// 敵を生成する関数（NEON DODGE 応用版対応）
function enemySpawn() {
  const d = STAGES[stageIndex];
  const r = rand(14, 27);
  
  // ← ここに敵のtype決定を追加
  const type = Math.random() < 0.17 ? 'zig' : Math.random() < 0.12 ? 'tank' : 'normal';
  // - 17% の確率で「zig」（揺れる敵）
  // - 12% の確率で「tank」（丈夫な敵）
  // - 71% の確率で 'normal'（通常の敵）
  
  enemies.push({
    x: rand(r, W - r),
    y: -35,
    r: r,
    hp: type === 'tank' ? 3 : 1,  // tankは3回必要、他は1回
    maxhp: type === 'tank' ? 3 : 1,
    v: rand(105, 170) * d.enemySpeed * (difficulty === 0 ? 0.75 : difficulty === 2 ? 1.45 : 1),
    type: type,  // ← 敵のtypeを保存
    phase: rand(0, TAU),
    value: type === 'tank' ? 30 : 10  // tankは得点が多い
  });
}

// 定数の確認
// W = 960（ゲーム画面の幅）
// TAU = Math.PI * 2（2π）
// rand() は独自の乱数生成関数。p5.jsの random() とは異なります
```

### ステップ2：敵の動きを変える

敵のタイプに応じて、異なる動きを実装します。

```javascript
// update() 関数内で敵を移動させるループ（NEON DODGE 応用版対応）
for (let e of enemies) {
  // 敵を下へ移動（全敵共通）
  e.y += e.v * dt;  // NEON DODGEでは speed ではなく v を使用
  
  // type に応じて異なる動きを追加
  if (e.type === 'zig') {
    // 「zig」敵は左右に揺れる
    e.x += Math.sin(elapsed * 5 + e.phase) * 110 * dt;
  } else if (e.type === 'tank') {
    // 「tank」敵は特に追加動きなし（速度で区別）
    // 見た目は回転で表現（描画時に実装）
  }
  // 「normal」敵は何もしない（真っすぐ落ちる）
}

// 注意：NEON DODGEでは canvas API を使用しているため、
// p5.js の sin() ではなく Math.sin() を使用します
```

### ステップ3：敵の見た目を変える

敵を描画するときに、タイプごとに色や形を変えます。

```javascript
// 敵を描画する部分（canvas API対応）
for (let e of enemies) {
  ctx.save();  // p5.js の push() に相当
  ctx.translate(e.x, e.y);
  ctx.rotate(elapsed * (e.type === 'zig' ? 3 : 1));
  
  // タイプごとに色を変える
  if (e.type === 'normal') {
    ctx.fillStyle = '#ff668e';  // 赤
  } else if (e.type === 'zig') {
    ctx.fillStyle = '#66ffb4';  // 緑
  } else if (e.type === 'tank') {
    ctx.fillStyle = '#ffb763';  // オレンジ
  }
  
  ctx.fill();
  
  // タイプごとに形を変える
  // 多角形を描画する補助関数を使用
  if (e.type === 'tank') {
    // 6角形（hexagon）
    polygon(0, 0, e.r, 6);  // polygon 関数を呼び出し
  } else {
    // 4角形（square）
    polygon(0, 0, e.r, 4);
  }
  
  ctx.restore();  // p5.js の pop() に相当
}

// polygon() 関数（game.js に定義）
function polygon(x, y, r, n, rot = 0) {
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    let a = rot + i * TAU / n;
    let xx = x + Math.cos(a) * r;
    let yy = y + Math.sin(a) * r;
    i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy);
  }
  ctx.closePath();
}

// 注意：
// - fillStyle では 16進数カラーコード（'#rrggbb' 形式）を使用
// - ctx.save() / ctx.restore() で描画状態を管理
// - polygon() は game.js で既に定義されています
```

---

## 📝 段階的な実装ガイド

### 段階1：最小限の実装（10分程度）

目標：敵を2種類だけにする（速い敵と遅い敵）

```javascript
// スポーン時に敵のタイプを決める
function enemySpawn() {
  const d = STAGES[stageIndex];
  const r = random(14, 27);
  const type = Math.random() < 0.5 ? 'fast' : 'slow';
  
  const baseSpeed = type === 'fast' ? 170 : 105;
  
  enemies.push({
    x: Math.random() * (W - r * 2) + r,
    y: -35,
    r: r,
    hp: 1,
    maxhp: 1,
    v: baseSpeed * d.enemySpeed,  // 注意：speed ではなく v を使用
    type: type
  });
}
```

**確認ポイント：** ゲームをプレイして、敵の速度が異なるか確認

**注意：**
- `speed` ではなく `v` プロパティを使用
- `random()` ではなく `Math.random()` を使用  
- 敵の高さと位置計算が NEON DODGE の仕様に従っています

---

### 段階2：見た目の工夫（15分程度）

目標：敵の種類ごとに色を変える

```javascript
// 敵の描画時に色を変える
for (let e of enemies) {
  ctx.save();
  ctx.translate(e.x, e.y);
  
  // 敵のタイプで色を分ける（Canvas API で実装）
  if (e.type === 'fast') {
    ctx.fillStyle = '#ff6464';  // 赤：速い敵
  } else {
    ctx.fillStyle = '#6464ff';  // 青：遅い敵
  }
  
  ctx.beginPath();
  ctx.arc(0, 0, e.r, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}
```

**確認ポイント：** 赤い敵が速く、青い敵が遅いか確認

**注意：**
- p5.js の `fill()` と `circle()` ではなく Canvas API を使用
- `ctx.save()` / `ctx.restore()` で描画状態を管理
- 16進数カラーコード（`'#rrggbb'`）を使用

---

### 段階3：動きの工夫（20分程度）

目標：敵の種類ごとに異なる動きを追加

```javascript
// 敵の更新時に、タイプに応じた動きを追加
for (let e of enemies) {
  e.y += e.v * dt;
  
  if (e.type === 'zig') {
    // 左右に揺れる動き
    e.x += Math.sin(elapsed * 5 + e.phase) * 100 * dt;
  } else if (e.type === 'spin') {
    // 螺旋運動
    e.x += Math.cos(elapsed * 3) * 80 * dt;
  }
  // 他の敵は普通に落ちるだけ
}
```

**確認ポイント：** 敵の動きが異なるか確認

**注意：**
- p5.js の `sin()` / `cos()` ではなく `Math.sin()` / `Math.cos()` を使用
- `speed` ではなく `v` を使用

---

### 段階4：複雑な実装（30分程度）

目標：敵の種類ごとに得点を変える

```javascript
// 敵を撃破するときに、タイプに応じた得点を付与
function destroyEnemy(e) {
  let points = 10;
  
  if (e.type === 'tank') {
    points = 50;  // tankは高得点
  } else if (e.type === 'fast') {
    points = 15;  // fastはそこそこ
  }
  
  score += points;
  
  // その他の処理...
}
```

**確認ポイント：** 異なるタイプの敵を倒すと、スコアが異なるか確認

---

## 🧠 理解を深める：敵のタイプ分岐図

### フローチャート

```
敵を生成
  ↓
ランダムな値を決める
  ↓
確率で敵のタイプを決定
  ├─ 0.0 ～ 0.2 → type = 'tank'（20%）
  ├─ 0.2 ～ 0.4 → type = 'zig'（20%）
  └─ 0.4 ～ 1.0 → type = 'normal'（60%）
  ↓
敵のデータに type を保存
  ↓
毎フレーム、type に応じた処理
  ├─ 'tank'    → 回転する、得点が多い
  ├─ 'zig'     → 左右に揺れる
  └─ 'normal'  → 何もしない（真っすぐ落ちる）
  ↓
敵を描画
  ├─ 'tank'    → オレンジ色、6角形
  ├─ 'zig'     → 緑色、4角形
  └─ 'normal'  → 赤色、4角形
```

---

## 💾 完全な実装例

### 敵のスポーン（敵を生成）

```javascript
function spawnEnemy() {
  const enemyR = random(14, 27);
  const rand_type = random();
  
  let type = 'normal';
  if (rand_type < 0.17) {
    type = 'zig';
  } else if (rand_type < 0.29) {
    type = 'tank';
  }
  
  const enemySpeed = random(105, 170);
  
  enemies.push({
    x: random(enemyR, CONFIG.canvasW - enemyR),
    y: -35,
    r: enemyR,
    hp: type === 'tank' ? 3 : 1,
    maxhp: type === 'tank' ? 3 : 1,
    speed: enemySpeed,
    type: type,
    phase: random(TWO_PI),
    value: type === 'tank' ? 30 : 10
  });
}
```

### 敵の更新（毎フレームの移動処理）

```javascript
// updateGame()関数内
for (let e of enemies) {
  // 基本的な下への移動
  e.y += e.speed * dt;
  
  // type に応じた追加の動き
  if (e.type === 'zig') {
    // 左右に揺れる
    e.x += sin(elapsed * 5 + e.phase) * 110 * dt;
  } else if (e.type === 'tank') {
    // 特に追加の動きはなし（ゆっくり落ちるだけ）
  }
}
```

### 敵の描画

```javascript
// draw()内の敵描画ループ
for (let e of enemies) {
  push();
  translate(e.x, e.y);
  rotate(elapsed * (e.type === 'zig' ? 3 : 1));
  
  // 色の設定
  if (e.type === 'tank') {
    fill([255, 160, 93]);
  } else {
    fill([255, 102, 142]);
  }
  
  noStroke();
  
  // 形の設定
  if (e.type === 'tank') {
    drawPolygon(0, 0, e.r, 6);
  } else {
    drawPolygon(0, 0, e.r, 4);
  }
  
  pop();
}
```

---

## 🎨 生徒の工夫例

### 工夫例1：敵の大きさで分ける

```javascript
function spawnEnemy() {
  const type = random() < 0.5 ? 'big' : 'small';
  
  const r = type === 'big' ? 35 : 15;
  const speed = type === 'big' ? 4 : 8;  // 大きい敵は遅い、小さい敵は速い
  
  enemies.push({
    x: random(r, CONFIG.canvasW - r),
    y: -35,
    r: r,
    speed: speed,
    type: type
  });
}
```

**特徴：** 敵の大きさが視覚的にわかりやすい

---

### 工夫例2：3種類以上の敵

```javascript
function spawnEnemy() {
  const rand = random();
  
  let type, speed, color;
  
  if (rand < 0.3) {
    type = 'fast';
    speed = 10;
    color = [255, 100, 100];  // 赤：速い
  } else if (rand < 0.6) {
    type = 'normal';
    speed = 6;
    color = [100, 100, 255];  // 青：普通
  } else if (rand < 0.8) {
    type = 'slow';
    speed = 3;
    color = [100, 255, 100];  // 緑：遅い
  } else {
    type = 'boss';
    speed = 2;
    color = [255, 200, 0];    // 黄色：超遅い
  }
  
  enemies.push({
    x: random(25, CONFIG.canvasW - 25),
    y: -35,
    r: 20,
    speed: speed,
    type: type,
    color: color
  });
}
```

**特徴：** 敵が4種類になり、ゲームの難易度が大きく変わる

---

### 工夫例3：敵の動きをさらに複雑に

```javascript
for (let e of enemies) {
  e.y += e.speed * dt;
  
  if (e.type === 'zig') {
    e.x += sin(elapsed * 5 + e.phase) * 100 * dt;
    
  } else if (e.type === 'spiral') {
    // 螺旋運動
    e.x += cos(elapsed * 4) * 120 * dt;
    e.y += sin(elapsed * 4) * 30 * dt;
    
  } else if (e.type === 'random') {
    // ランダムな動き
    if (frameCount % 30 === 0) {  // 30フレームごと
      e.vx = random(-100, 100);
    }
    e.x += (e.vx || 0) * dt;
  }
}
```

**特徴：** 敵の動きがより多様になり、ゲームの戦略性が増す

---

### 工夫例4：敵の種類ごとに得点をコンボ倍率

```javascript
function destroyEnemy(e) {
  let basePoints = 10;
  
  if (e.type === 'tank') {
    basePoints = 50;
  } else if (e.type === 'fast') {
    basePoints = 15;
  } else if (e.type === 'slow') {
    basePoints = 5;
  }
  
  // コンボで倍率を変える
  const comboMultiplier = 1 + floor(combo / 5);
  score += basePoints * comboMultiplier;
}
```

**特徴：** 敵の種類とコンボの両方で得点が変わる

---

### 工夫例5：敵の種類に応じた効果音

```javascript
function destroyEnemy(e) {
  score += 10;
  
  // 敵のタイプに応じた異なる周波数の音
  if (e.type === 'fast') {
    playSound(800, 0.1);  // 高い音
  } else if (e.type === 'slow') {
    playSound(300, 0.1);  // 低い音
  } else if (e.type === 'tank') {
    playSound(500, 0.2);  // 長めの音
  }
}
```

**特徴：** 敵の種類が音でもわかるようになる

---

## ❓ 理解度確認クイズ

### クイズ1：敵のtypeとは

敵オブジェクトに `type: 'fast'` を追加する理由は何ですか？

**選択肢：**
- A. 敵が速く移動するように
- B. 敵の種類を区別して、タイプごとに異なる処理ができるようにする
- C. ゲームのスコアを増やすために

**答え：** B

---

### クイズ2：敵のタイプ分岐

以下のコードで、敵がどのタイプになる確率は？

```javascript
const rand_type = random();
let type = 'normal';

if (rand_type < 0.17) {
  type = 'zig';
} else if (rand_type < 0.29) {
  type = 'tank';
}
```

- zig：17%、tank：12%、normal：71%
- zig：17%、tank：12%、normal：100%
- zig：0.17%、tank：0.29%、normal：残り

**答え：** A（zig：17%、tank：12%、normal：71%）

---

### クイズ3：敵の動きの実装

敵の type が `'zig'` のとき、敵はどんな動きをしますか？

```javascript
if (e.type === 'zig') {
  e.x += sin(elapsed * 5 + e.phase) * 110 * dt;
}
```

**選択肢：**
- A. 左右に揺れながら落ちる
- B. 螺旋を描きながら落ちる
- C. ランダムに移動する

**答え：** A（`sin()` は左右の揺れを表現）

---

### クイズ4：複数敵タイプの場合

敵の type が3種類以上の場合、プレイヤーにとってゲームはどう変わりますか？

**選択肢：**
- A. 難易度が下がる
- B. 戦略性が増す。敵ごとに異なる対応が必要になる
- C. 変わらない

**答え：** B

---

## 📌 重要ポイントまとめ

| ポイント | 説明 | 活用例 |
|---------|------|--------|
| **type プロパティ** | 敵の種類を識別する | `e.type === 'fast'` |
| **確率的な分岐** | `random()` で敵のタイプを決定 | `if (rand < 0.3) type = 'fast'` |
| **タイプ別処理** | `if` 文で敵ごとに異なる処理 | 移動、描画、得点 |
| **視覚的な区別** | 色・形・サイズで敵を区別 | 敵の種類が一目でわかる |
| **戦略性の向上** | 敵の種類ごとに異なる対応が必要 | ゲームが複雑・面白くなる |

---

## 🎓 コーチからのアドバイス

### 「敵の種類を増やしすぎたら」

最初は2〜3種類からはじめてください。敵の種類が多すぎると、コードが複雑になり、バグが増えます。

### 「敵の速度差を大きくしたい」

```javascript
// 敵の速度に大きな差をつける
if (e.type === 'fast') {
  speed = 10;
} else if (e.type === 'slow') {
  speed = 2;
}
```

速度差が大きいほど、ゲームの戦略性が増します。

### 「敵の見た目を工夫したい」

色だけでなく、形のサイズも変えるとより面白くなります。

```javascript
// 敵のサイズも変える
if (e.type === 'tank') {
  r = 35;  // 大きい
} else {
  r = 15;  // 小さい
}
```

---

## 🔗 次のステップ

1. **まずは2種類の敵から** — 速い敵と遅い敵だけにしてテスト
2. **色を変える** — 敵の種類が見た目でわかるように
3. **動きを変える** — `sin()` や `cos()` を使って敵を揺らす
4. **得点を変える** — 敵の種類ごとに異なる得点を設定
5. **さらに工夫** — 敵の種類を増やしたり、複雑な動きを追加

---

## 🚀 実装のコツ

### コツ1：まずは `type` をコンソールで確認

```javascript
console.log('敵のtype:', e.type);  // コンソール（F12）に表示
```

敵が正しいタイプで作成されているか確認します。

### コツ2：`if` 文で必ずすべてのケースをテスト

```javascript
if (e.type === 'fast') {
  // fast の場合
} else if (e.type === 'slow') {
  // slow の場合
} else {
  // それ以外（通常はないはず）
  console.log('不明なタイプ:', e.type);
}
```

想定外のタイプがないか確認します。

### コツ3：敵の配列を確認

```javascript
console.log('敵の数:', enemies.length);
console.log('最初の敵:', enemies[0]);
```

敵が正しく生成されているか確認します。

---

## ✅ 成功の目安

- [ ] 敵が2種類以上に分けられている
- [ ] 敵のタイプによって移動速度が異なる
- [ ] 敵の種類によって色が異なる
- [ ] ゲームをプレイすると、敵の種類の違いが一目でわかる
- [ ] 敵の種類に応じた処理が正しく動作している

---

## 💪 最後に

敵を多様化することで、ゲーム全体の遊び方が大きく変わります。

最初は simple な実装から始めて、段階的に工夫を追加していくことが成功のコツです。

質問があれば、いつでもコーチに聞いてね！

頑張れ！🎮✨

---

## 🔗 他の詳細レッスンとの関連性

### LESSON_6M（スコアシステムの工夫）との連携 ⭐ 重要

**LESSON_6A で実装する内容が、LESSON_6M の前提条件になります。**

LESSON_6A で敵に設定する `type` と `value` プロパティ：
```javascript
enemies.push({
  type: type,           // ← 敵の種類
  value: type === 'tank' ? 30 : 10  // ← 敵の得点
});
```

LESSON_6M で使用するこれらのプロパティ：
```javascript
function destroyEnemy(e) {
  score += e.value * (1 + Math.floor(combo / 5));
  // type に応じた得点が計算される
}
```

**一緒に実装した場合の効果：**
- 敵の種類によって、敵を倒したときの得点が異なる
- 難しい敵（tank）を倒すと、より多くのポイントがもらえる
- ゲームの戦略性が大幅に向上

---

### LESSON_6B（射撃機能）との連携

**LESSON_6A で敵に設定する `hp` プロパティが、LESSON_6B で敵撃破の判定に使われます。**

LESSON_6A で敵に設定する HP：
```javascript
hp: type === 'tank' ? 3 : 1  // tank は 3 回射撃が必要
```

LESSON_6B で使用される当たり判定：
```javascript
if (e.hp > 0 && circle(b, e)) {
  e.hp--;
  if (e.hp <= 0) destroyEnemy(e);
}
```

**一緒に実装した場合の効果：**
- 敵の種類によって、撃破に必要な射撃回数が異なる
- 敵の強さがゲームプレイに直結する
- 敵の種類を判断しながら射撃戦略を立てる必要が生まれる

---

### LESSON_6H（ビジュアルカスタマイズ）との連携

**LESSON_6A の `type` に基づいて、敵の見た目を区別します。**

LESSON_6A で設定する type：
```javascript
const type = Math.random() < 0.17 ? 'zig' : ...
```

LESSON_6H での敵の描画：
```javascript
if (e.type === 'tank') {
  ctx.fillStyle = '#ffb763';  // オレンジ
} else if (e.type === 'zig') {
  ctx.fillStyle = '#66ffb4';  // 緑
}
```

**一緒に実装した場合の効果：**
- 敵の種類が見た目で一目瞭然
- プレイヤーが敵の行動を予測しやすくなる

---

### LESSON_6G（BGMのカスタマイズ）との連携（オプション）

敵を撃破したときの効果音を、敵の種類に応じて変更することで、ゲーム全体の雰囲気が統一されます。

---

## 🔗 関連するレッスン・参考資料

### このレッスンと関連する改造オプション

**組み合わせ例1：敵の多様化 + ビジュアルカスタマイズ**
- 敵の種類を増やした後、敵の形や色をもっと工夫したい
- → **[H] ビジュアルカスタマイズ** の詳細レッスンも読む
- 敵の見た目が敵のタイプをより強調できるようになる

**組み合わせ例2：敵の多様化 + スコアシステムの工夫**
- 敵の種類ごとに異なる得点を設定したい
- → **[M] スコアシステムの工夫** の詳細レッスンも読む
- 強い敵ほど得点が多いという仕組みが作れる

**組み合わせ例3：敵の多様化 + 難易度調整**
- 敵の種類によって出現頻度や速度を変えたい
- → **参考資料 [L] 難易度調整** を参照
- 敵の種類ごとに異なる難易度調整が可能

### 時間が余った場合の発展課題

**課題1：敵の種類をさらに増やす**
- 現在：2～3種類の敵
- 発展：5種類以上の敵を追加
- コツ：敵のタイプごとに異なる特性を持たせる（速度、大きさ、形、得点など）

**課題2：敵の動きをより複雑にする**
- 現在：上下移動 + 左右の揺れ
- 発展：参考資料 **[L] 難易度調整** を参照して、敵の生成パターンを複雑化
- 例：ステージが進むと、敵の混合率（fast/slow の割合）が変わる

**課題3：参考資料 [E] ステージシステムと組み合わせる**
- 各ステージで敵の構成が異なる
- ステージ1：遅い敵が多い
- ステージ2：普通の敵が中心
- ステージ3：速い敵が大半
- → ゲーム全体の難易度設計が学べる

**課題4：敵に HP を追加（参考資料 [B] 射撃機能で学ぶ）**
- 敵の種類によって異なる HP を設定
- 強い敵 = 複数回射撃が必要
- → ゲームのバランス設計が学べる
