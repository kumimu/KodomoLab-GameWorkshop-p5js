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
// 敵を生成する関数（既存）
function spawnEnemy() {
  const enemyR = random(14, 27);
  
  // ← ここに敵のtype決定を追加
  const rand_type = random();
  let type = 'normal';
  
  if (rand_type < 0.17) {
    type = 'zig';    // 17%の確率で「zig」（揺れる敵）
  } else if (rand_type < 0.29) {
    type = 'tank';   // 12%の確率で「tank」（丈夫な敵）
  }
  // それ以外は 'normal'（71%の確率）
  
  enemies.push({
    x: random(enemyR, CONFIG.canvasW - enemyR),
    y: -35,
    r: enemyR,
    hp: type === 'tank' ? 3 : 1,  // tankは3回必要、他は1回
    maxhp: type === 'tank' ? 3 : 1,
    speed: random(105, 170),
    type: type,  // ← 敵のtypeを保存
    phase: random(TWO_PI),
    value: type === 'tank' ? 30 : 10  // tankは得点が多い
  });
}
```

### ステップ2：敵の動きを変える

敵のタイプに応じて、異なる動きを実装します。

```javascript
// draw()関数内で敵を移動させるループ
for (let e of enemies) {
  // 敵を下へ移動（全敵共通）
  e.y += e.speed * dt;
  
  // type に応じて異なる動きを追加
  if (e.type === 'zig') {
    // 「zig」敵は左右に揺れる
    e.x += sin(elapsed * 5 + e.phase) * 110 * dt;
  } else if (e.type === 'tank') {
    // 「tank」敵は回転する（見た目の工夫）
    e.rotation = (e.rotation || 0) + 5;
  }
  // 「normal」敵は何もしない（真っすぐ落ちる）
}
```

### ステップ3：敵の見た目を変える

敵を描画するときに、タイプごとに色や形を変えます。

```javascript
// 敵を描画する部分
for (let e of enemies) {
  push();
  translate(e.x, e.y);
  
  // タイプごとに色を変える
  if (e.type === 'normal') {
    fill([255, 102, 142]);  // 赤
  } else if (e.type === 'zig') {
    fill([102, 255, 180]);  // 緑
  } else if (e.type === 'tank') {
    fill([255, 160, 93]);   // オレンジ
  }
  
  // タイプごとに形を変える
  if (e.type === 'tank') {
    // 多角形（6角形）
    drawPolygon(0, 0, e.r, 6);
  } else {
    // 四角形
    drawPolygon(0, 0, e.r, 4);
  }
  
  pop();
}
```

---

## 📝 段階的な実装ガイド

### 段階1：最小限の実装（10分程度）

目標：敵を2種類だけにする（速い敵と遅い敵）

```javascript
// スポーン時に敵のタイプを決める
function spawnEnemy() {
  const type = random() < 0.5 ? 'fast' : 'slow';
  
  const speed = type === 'fast' ? 8 : 4;
  
  enemies.push({
    x: random(30, CONFIG.canvasW - 30),
    y: -35,
    r: 25,
    speed: speed,
    type: type
  });
}
```

**確認ポイント：** ゲームをプレイして、敵の速度が異なるか確認

---

### 段階2：見た目の工夫（15分程度）

目標：敵の種類ごとに色を変える

```javascript
// 敵の描画時に色を変える
for (let e of enemies) {
  push();
  translate(e.x, e.y);
  
  // 敵のタイプで色を分ける
  if (e.type === 'fast') {
    fill([255, 100, 100]);  // 赤：速い敵
  } else {
    fill([100, 100, 255]);  // 青：遅い敵
  }
  
  circle(0, 0, e.r * 2);
  
  pop();
}
```

**確認ポイント：** 赤い敵が速く、青い敵が遅いか確認

---

### 段階3：動きの工夫（20分程度）

目標：敵の種類ごとに異なる動きを追加

```javascript
// 敵の更新時に、タイプに応じた動きを追加
for (let e of enemies) {
  e.y += e.speed * dt;
  
  if (e.type === 'zig') {
    // 左右に揺れる動き
    e.x += sin(elapsed * 5 + e.phase) * 100 * dt;
  } else if (e.type === 'spin') {
    // 螺旋運動
    e.x += cos(elapsed * 3) * 80 * dt;
  }
  // 他の敵は普通に落ちるだけ
}
```

**確認ポイント：** 敵の動きが異なるか確認

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
