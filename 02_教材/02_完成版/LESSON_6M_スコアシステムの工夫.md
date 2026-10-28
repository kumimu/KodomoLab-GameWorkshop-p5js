# LESSON_6M：スコアシステムの工夫 - ゲームの得点ルールを変える

## 🎯 学習目標

得点の計算ルールを変更して、ゲームの遊び方を大きく変える。

- 現在のスコア計算ロジック（基本版）の説明
- 敵の種類ごとに異なる得点を設定する方法
- コンボシステムの実装（連続で敵を倒すと得点増加）
- ボーナス計算ロジック
- 生徒が自分の得点ルールを設計できるようにする

---

## 💡 スコアシステムとは

### ゲームにおけるスコアの役割

**スコア** = プレイヤーの成績を数値で表したもの

```
スコアがシンプル → ゲームが単調
スコアが複雑 → ゲームが奥深い、やり込み要素が増える
```

### このレッスンでできること

- **敵の種類ごとに異なる得点** — 強い敵ほど得点が多い
- **コンボシステム** — 連続で敵を倒すと得点が増える
- **ボーナス計算** — 時間内にクリアするとボーナスがもらえる
- **ハイスコアシステム** — 最高得点を記録・表示

---

## 📚 基本版のスコア計算

### LESSON_4で学んだこと

**敵が画面を通り過ぎる = スコア +1**

```javascript
function moveEnemy(enemy) {
  enemy.y += enemy.speed;

  if (enemy.y > height + enemySize) {
    // 敵が画面の下を通り過ぎた
    enemy.y = random(-300, -50);
    enemy.x = random(enemySize, width - enemySize);
    enemy.speed = enemySpeed + random(0, 2);
    score += 1;  // ← スコア加算
  }
}
```

### 基本的なスコア加算

```javascript
function destroyEnemy(e) {
  score += 10;  // ← 敵撃破時に+10
}
```

---

## 🎮 実装の流れ

### ステップ1：敵の「value」プロパティ

敵ごとに異なる得点を設定する。

```javascript
// 敵を生成するときに value を設定
function spawnEnemy() {
  const type = random() < 0.5 ? 'tank' : 'normal';
  
  let value = 10;
  if (type === 'tank') {
    value = 30;  // tank は高得点
  }
  
  enemies.push({
    x: random(30, width - 30),
    y: -35,
    r: 25,
    type: type,
    value: value  // ← 敵の得点
  });
}
```

### ステップ2：スコア加算時に `value` を使用

```javascript
function destroyEnemy(e) {
  score += e.value;  // 敵の type に応じた得点を加算
  
  burst(e.x, e.y, [255, 100, 100], 15);
  playSound(250, 0.1);
}
```

### ステップ3：コンボシステム

連続で敵を倒すと、得点が増える。

```javascript
// グローバル変数
let combo = 0;
let comboTimer = 0;

function destroyEnemy(e) {
  // コンボで得点が増える
  const comboMultiplier = 1 + floor(combo / 5);
  score += e.value * comboMultiplier;
  
  // コンボをカウント
  combo++;
  comboTimer = 3;  // 3秒以内に次の敵を倒さないとコンボ終了
  
  burst(e.x, e.y, [255, 100, 100], 15);
  playSound(250 + combo * 30, 0.1);  // コンボが増えると音が高くなる
}

// updateGame() 内でコンボタイマーを更新
function updateGame(dt) {
  comboTimer -= dt;
  if (comboTimer <= 0) {
    combo = 0;  // コンボが途切れる
  }
}
```

### ステップ4：ボーナス計算

クリア時にボーナスを計算する。

```javascript
function endGame(win) {
  if (win) {
    // クリアボーナス
    const clearBonus = floor(gameTime) * 100;  // 残り時間 × 100
    score += clearBonus;
    
    const comboBonus = combo * 50;  // コンボボーナス
    score += comboBonus;
    
    notice = 'CLEAR! BONUS: ' + (clearBonus + comboBonus);
  }
  
  gameState = 'over';
}
```

---

## 📝 段階的な実装ガイド

### 段階1：敵の種類ごとに異なる得点（15分程度）

目標：敵の type によって得点が異なる

```javascript
function spawnEnemy() {
  const type = random() < 0.5 ? 'fast' : 'slow';
  
  const value = type === 'fast' ? 15 : 5;
  
  enemies.push({
    x: random(30, width - 30),
    y: -35,
    r: 25,
    type: type,
    value: value
  });
}

function destroyEnemy(e) {
  score += e.value;  // 敵ごとに異なる得点
}
```

**確認ポイント：** fast 敵を倒すと slow 敵より多くスコアが増えるか確認

---

### 段階2：コンボシステムの基本（20分程度）

目標：敵を連続で倒すとスコアが増える

```javascript
let combo = 0;
let comboTimer = 0;

function destroyEnemy(e) {
  const basePoints = e.value;
  const multiplier = 1 + floor(combo / 5);  // 5敵ごとに倍率が上がる
  
  score += basePoints * multiplier;
  
  combo++;
  comboTimer = 3;
}

function updateGame(dt) {
  comboTimer -= dt;
  if (comboTimer <= 0) {
    combo = 0;
  }
}
```

**確認ポイント：** 連続で敵を倒すと、スコアが増えるか確認

---

### 段階3：コンボ表示（15分程度）

目標：画面にコンボ数を表示

```javascript
function draw() {
  // ... 他の描画 ...
  
  // コンボ表示
  if (combo > 1) {
    fill([255, 255, 100]);
    textSize(24);
    textAlign(CENTER);
    text('COMBO ×' + combo, width / 2, 100);
  }
}
```

**確認ポイント：** コンボ数が画面に表示されるか確認

---

### 段階4：ボーナスシステム（25分程度）

目標：クリア時にボーナスを計算

```javascript
function endGame(win) {
  let bonus = 0;
  let bonusText = '';
  
  if (win) {
    // 残り時間ボーナス
    const timeBonus = floor(gameTime) * 100;
    bonus += timeBonus;
    bonusText += 'TIME: ' + timeBonus + '\n';
    
    // コンボボーナス
    const comboBonus = combo * 50;
    bonus += comboBonus;
    bonusText += 'COMBO: ' + comboBonus + '\n';
    
    score += bonus;
    
    notice = 'CLEAR!\nBONUS:\n' + bonusText + 'TOTAL: ' + bonus;
  }
  
  gameState = 'over';
}
```

**確認ポイント：** クリア時にボーナスが表示され、スコアに加算されるか確認

---

## 🧠 理解を深める：コンボシステムの仕組み

### フロー図

```
敵を倒す
  ↓
combo++;  敵倒数カウント
  ↓
comboTimer = 3;  3秒のカウンタスタート
  ↓
毎フレーム
  ├─ comboTimer -= dt
  ├─ comboTimer <= 0？
  │  ├─ NO → コンボ継続中
  │  └─ YES → combo = 0（コンボ終了）
  └─
  ↓
新しい敵を倒す（comboTimer > 0の間に）
  ↓
倍率計算：1 + floor(combo / 5)
  ├─ combo = 1～4：倍率 = 1倍
  ├─ combo = 5～9：倍率 = 2倍
  ├─ combo = 10～14：倍率 = 3倍
  └─
```

### 倍率の例

```
敵の基本得点：10点

combo = 1：10 × 1 = 10点
combo = 2：10 × 1 = 10点
combo = 3：10 × 1 = 10点
combo = 4：10 × 1 = 10点
combo = 5：10 × 2 = 20点（倍率UP！）
combo = 6：10 × 2 = 20点
combo = 10：10 × 3 = 30点（さらにUP！）
```

---

## 💾 完全な実装例

### グローバル変数

```javascript
let score = 0;
let combo = 0;
let comboTimer = 0;
let kills = 0;
let best = 0;
```

### 敵の生成

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
  
  const value = type === 'tank' ? 30 : 10;
  
  enemies.push({
    x: random(enemyR, CONFIG.canvasW - enemyR),
    y: -35,
    r: enemyR,
    speed: random(105, 170),
    type: type,
    value: value  // ← 敵の得点
  });
}
```

### 敵破壊関数

```javascript
function destroyEnemy(e) {
  // コンボで倍率を変える
  const comboMultiplier = 1 + floor(combo / 5);
  score += e.value * comboMultiplier;
  
  kills++;
  combo++;
  comboTimer = 3;  // 3秒以内に次の敵を倒さないとコンボ終了
  
  // パーティクル発生
  burst(e.x, e.y, [255, 106, 158], 15);
  
  // コンボが増えるにつれ音が高くなる
  playSound(250 + min(combo, 20) * 30, 0.1);
}
```

### 毎フレームの更新

```javascript
function updateGame(dt) {
  // コンボタイマーを減らす
  comboTimer -= dt;
  
  if (comboTimer <= 0) {
    combo = 0;  // コンボ終了
  }
  
  // その他の処理...
}
```

### 画面表示

```javascript
function drawUI() {
  // スコア表示
  fill([168, 251, 255]);
  textSize(24);
  textAlign(CENTER);
  text('SCORE: ' + nf(score, 5), 330, 24);
  
  // コンボ表示
  if (combo > 1) {
    fill([255, 242, 140]);
    textAlign(CENTER);
    textSize(20);
    text('COMBO ×' + combo, 790, 82);
  }
  
  // ハイスコア表示
  fill([244, 209, 126]);
  textSize(19);
  text('HIGH SCORE: ' + nf(best, 5), CONFIG.canvasW / 2, CONFIG.canvasH / 2 + 230);
}
```

### クリア時のボーナス

```javascript
function endGame(win) {
  gameState = win ? 'clear' : 'over';
  
  if (score > best) {
    best = score;
    try {
      localStorage.setItem('best-score', String(best));
    } catch (e) {}
  }
  
  if (win) {
    // クリアボーナスを計算
    const timeBonus = floor(gameTime) * 100;
    const comboBonus = combo * 50;
    const totalBonus = timeBonus + comboBonus;
    
    score += totalBonus;
  }
  
  playSound(win ? 880 : 150, 0.5);
}
```

---

## 🎨 生徒の工夫例

### 工夫例1：敵の難易度に応じた得点

```javascript
function spawnEnemy() {
  const difficulty = [0.5, 1.0, 1.5];  // 難易度設定
  const enemyType = ['easy', 'normal', 'hard'];
  
  const rand = random();
  let type, value;
  
  if (rand < 0.5) {
    type = 'easy';
    value = 5;
  } else if (rand < 0.8) {
    type = 'normal';
    value = 10;
  } else {
    type = 'hard';
    value = 30;
  }
  
  enemies.push({ ..., type, value });
}
```

**特徴：** 敵の難易度が得点に反映される

---

### 工夫例2：複雑なコンボシステム

```javascript
function destroyEnemy(e) {
  // コンボ段階による倍率計算
  let multiplier = 1;
  
  if (combo >= 20) multiplier = 5;
  else if (combo >= 15) multiplier = 4;
  else if (combo >= 10) multiplier = 3;
  else if (combo >= 5) multiplier = 2;
  
  score += e.value * multiplier;
  
  combo++;
  comboTimer = 3;
}
```

**特徴：** より複雑なコンボシステムで戦略性が増す

---

### 工夫例3：敵の種類とコンボの組み合わせ

```javascript
function destroyEnemy(e) {
  let basePoints = e.value;
  
  // 敵の種類ボーナス
  if (e.type === 'tank') {
    basePoints *= 1.5;  // 1.5倍
  }
  
  // コンボ倍率
  const comboMultiplier = 1 + floor(combo / 5);
  
  score += basePoints * comboMultiplier;
  
  combo++;
  comboTimer = 3;
}
```

**特徴：** 敵の種類とコンボの両方が得点に影響

---

### 工夫例4：時間経過による倍率変化

```javascript
function destroyEnemy(e) {
  // 経過時間が長いほど倍率が上がる
  const timeMultiplier = 1 + floor(elapsed / 10) * 0.1;
  
  // コンボ倍率
  const comboMultiplier = 1 + floor(combo / 5);
  
  score += e.value * comboMultiplier * timeMultiplier;
  
  combo++;
  comboTimer = 3;
}
```

**特徴：** ゲームが進むにつれ、得点が増えやすくなる

---

### 工夫例5：ボーナスの種類を増やす

```javascript
function endGame(win) {
  if (win) {
    let bonuses = {
      time: floor(gameTime) * 100,        // 残り時間ボーナス
      combo: combo * 50,                   // コンボボーナス
      perfect: kills > 100 ? 5000 : 0,    // パーフェクトボーナス
      speed: kills > 50 ? 2000 : 0        // スピードボーナス
    };
    
    const totalBonus = Object.values(bonuses).reduce((a, b) => a + b, 0);
    score += totalBonus;
  }
}
```

**特徴：** 複数のボーナス条件でゲームの目標が増える

---

### 工夫例6：ボーナス倍率システム

```javascript
function getScoreMultiplier() {
  let multiplier = 1.0;
  
  // 難易度ボーナス
  if (difficulty === 2) multiplier *= 1.5;  // HARD
  else if (difficulty === 1) multiplier *= 1.2;  // NORMAL
  
  // ステージボーナス
  multiplier *= (1 + stageIndex * 0.2);
  
  return multiplier;
}

function destroyEnemy(e) {
  const multiplier = getScoreMultiplier();
  score += e.value * multiplier;
}
```

**特徴：** 難易度やステージに応じてスコア全体が変わる

---

## ❓ 理解度確認クイズ

### クイズ1：敵の value

敵オブジェクトに `value: 30` が設定されている場合、その敵を倒すと何点もらえますか？

```javascript
function destroyEnemy(e) {
  score += e.value;  // ?
}
```

**選択肢：**
- A. 30点
- B. e.value の分だけ
- C. コンボに応じて変わる

**答え：** A（敵の value が30点）

---

### クイズ2：コンボ倍率

`combo = 10` のとき、倍率は何倍ですか？

```javascript
const multiplier = 1 + floor(combo / 5);
```

**選択肢：**
- A. 1倍
- B. 2倍
- C. 3倍

**答え：** C（floor(10 / 5) = 2 → 1 + 2 = 3倍）

---

### クイズ3：コンボタイマー

`comboTimer = 3` のとき、何秒以内に敵を倒さないとコンボが終了しますか？

**選択肢：**
- A. 3フレーム
- B. 3秒
- C. 30秒

**答え：** B（`comboTimer -= dt` で秒単位で減少）

---

### クイズ4：ボーナス計算

`gameTime = 20`（残り20秒）、`combo = 8` のとき、ボーナスはいくつですか？

```javascript
const timeBonus = floor(gameTime) * 100;    // 20 * 100 = ?
const comboBonus = combo * 50;               // 8 * 50 = ?
const totalBonus = timeBonus + comboBonus;
```

**選択肢：**
- A. 2000
- B. 2400
- C. 2900

**答え：** B（2000 + 400 = 2400）

---

## 📌 重要ポイントまとめ

| ポイント | 説明 | コード例 |
|---------|------|---------|
| **敵の value** | 敵ごとの得点 | `value: 30` |
| **コンボ倍率** | `1 + floor(combo / 5)` | combo=5で2倍 |
| **コンボタイマー** | `comboTimer -= dt` | 3秒で終了 |
| **時間ボーナス** | 残り時間 × 定数 | `floor(gameTime) * 100` |
| **コンボボーナス** | コンボ数 × 定数 | `combo * 50` |

---

## 🎓 コーチからのアドバイス

### 「敵の得点を設計したい」

敵の難易度を考えて、得点を決めてください。

```javascript
// 例：敵の難易度と得点
// 敵1（遅い）→ 5点
// 敵2（普通）→ 10点
// 敵3（速い）→ 15点
// 敵4（丈夫）→ 30点
```

### 「コンボが続かない」

`comboTimer` を長くしてみてください。

```javascript
// 短い（3秒）
comboTimer = 3;

// 長い（5秒）
comboTimer = 5;
```

時間が長いほど、コンボが続きやすくなります。

### 「スコア計算が複雑になった」

デバッグするときは、スコア加算の都度、コンソールに出力してください。

```javascript
console.log('敵の得点:', e.value, 'コンボ倍率:', multiplier, '合計:', e.value * multiplier);
```

---

## 🔗 次のステップ

1. **基本的な得点から** — 敵ごとに異なる得点を設定
2. **コンボシステムの追加** — 敵を連続で倒すと得点増加
3. **コンボ表示** — 画面にコンボ数を表示
4. **ボーナスシステム** — クリア時にボーナス計算
5. **さらに工夫** — 複雑な倍率計算、マルチボーナス

---

## 💡 実装のコツ

### コツ1：変数を整理する

```javascript
// 敵の情報
const enemyInfo = {
  normal: { hp: 1, value: 10, speed: 150 },
  tank: { hp: 3, value: 30, speed: 100 },
  fast: { hp: 1, value: 15, speed: 200 }
};
```

敵の情報を一箇所に集めるとバグが減ります。

### コツ2：倍率計算は関数にする

```javascript
function getComboMultiplier(combo) {
  return 1 + floor(combo / 5);
}

function getScoreWithCombo(baseScore, combo) {
  return baseScore * getComboMultiplier(combo);
}

score += getScoreWithCombo(e.value, combo);
```

関数にすることで、計算が再利用できます。

### コツ3：テストする

異なる敵を倒して、スコアが正しく計算されるか確認してください。

```javascript
// 敵1（value=10）×コンボ倍率1 = 10点か？
// 敵2（value=30）×コンボ倍率2 = 60点か？
```

---

## ✅ 成功の目安

- [ ] 敵の種類によってスコアが異なる
- [ ] 敵を連続で倒すとスコアが増える（コンボ）
- [ ] 画面にコンボ数が表示される
- [ ] 敵を倒したときにコンボタイマーがリセットされる
- [ ] クリア時にボーナスが計算されスコアに加算される
- [ ] ハイスコアが記録・表示される

---

## 💪 最後に

スコアシステムは、ゲームの戦略性を大きく左右します。

敵の種類、コンボ、ボーナスの組み合わせで、ゲームがどんどん複雑で面白くなります。

いろいろな計算を試して、プレイヤーが「次はもっと高いスコアを狙いたい！」と思わせるような仕組みを作ってください！

質問があれば、いつでもコーチに聞いてね！

頑張れ！🎮📊✨
