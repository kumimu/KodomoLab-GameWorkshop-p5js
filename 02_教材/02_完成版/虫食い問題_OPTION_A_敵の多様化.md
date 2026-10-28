# 虫食い問題：OPTION A — 敵の多様化

**難易度：★★★** | **実装時間：30～45分** | **学習：条件分岐・敵オブジェクトの拡張**

---

## 🎯 目標

敵に「タイプ」を追加して、敵の種類ごとに異なる動きと見た目を実装する。

**完成時のゲーム：**
- 敵が 2 種類に分かれる（通常敵・速い敵）
- 速い敵は小さく、速く移動
- 敵の出現比率は約 70% 通常、30% 速い敵

---

## 📝 虫食い問題 — 段階1：敵に type を追加

### 問題：敵の初期化時に type プロパティを設定

**LESSON_5 の startGame() 関数内：**

```javascript
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
      // ★ ここを埋めてください
      type: ________________________  // ← 敵のタイプをランダムに設定
    });
  }

  gameState = "play";
}
```

**💡 ヒント：** `random()` を使って、30% の確率で 'fast'、70% の確率で 'normal' に分ける

**答え（クリックで展開）：**

```javascript
type: random() < 0.3 ? 'fast' : 'normal'
```

---

### 問題解説

**条件式の読み方：**

```javascript
random() < 0.3 ? 'fast' : 'normal'
```

- `random()` — 0 から 1 の間の乱数を生成
- `random() < 0.3` — 30% の確率で true（0 から 0.3 の間）
- `? 'fast'` — 条件が true なら 'fast'
- `: 'normal'` — 条件が false なら 'normal'

**つまり：** 30% の敵は「速い敵」、70% の敵は「通常の敵」

---

## 📝 虫食い問題 — 段階2：敵の再生成時に type を更新

### 問題：敵が画面下に出た時、type を再設定

**LESSON_5 の moveEnemy() 関数内：**

```javascript
function moveEnemy(enemy) {
  enemy.y += enemy.speed;

  if (enemy.y > height + enemySize) {
    enemy.y = random(-300, -50);
    enemy.x = random(enemySize, width - enemySize);
    // ★ ここを埋めてください
    enemy.type = ________________________;  // ← 敵を再生成する時も type を設定
    enemy.speed = enemySpeed + random(0, 2);
    score += 1;
  }
}
```

**💡 ヒント：** 敵を新しく生成する時も、タイプをランダムに決める

**答え：**

```javascript
enemy.type = random() < 0.3 ? 'fast' : 'normal'
```

---

## 📝 虫食い問題 — 段階3：敵のタイプに応じて移動速度と見た目を変更

### 問題1：敵のタイプに応じて、移動速度を変更

**moveEnemy() 関数を修正：**

```javascript
function moveEnemy(enemy) {
  // ★ ここを埋めてください
  if (enemy.type === 'fast') {
    // 速い敵は 1.5 倍速で移動
    _______________________________
  } else {
    enemy.y += enemy.speed;
  }

  if (enemy.y > height + enemySize) {
    // ... 敵の再生成処理 ...
  }
}
```

**💡 ヒント：** 速い敵は `enemy.speed * 1.5` で移動

**答え：**

```javascript
enemy.y += enemy.speed * 1.5;
```

---

### 問題2：敵のタイプに応じて、見た目を変更

**drawEnemy() 関数を修正：**

```javascript
function drawEnemy(enemy) {
  fill(enemyColor);
  noStroke();
  
  // ★ ここを埋めてください
  if (enemy.type === 'fast') {
    // 速い敵は小さく描く（0.8 倍）
    _______________________________
  } else {
    circle(enemy.x, enemy.y, enemySize);
  }
}
```

**💡 ヒント：** 敵のサイズは `enemySize * 0.8` にする

**答え：**

```javascript
circle(enemy.x, enemy.y, enemySize * 0.8);
```

---

## 🔧 完成コード

全体を修正した sketch.js は以下の通り：

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

// ★ OPTION A：敵の多様化
const OPTION_A_ENABLED = true;

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
      // ★ OPTION A：敵のタイプをランダムに設定
      type: OPTION_A_ENABLED ? (random() < 0.3 ? 'fast' : 'normal') : 'normal'
    });
  }

  gameState = "play";
}

function moveEnemy(enemy) {
  // ★ OPTION A：敵のタイプに応じて速度を変更
  if (OPTION_A_ENABLED && enemy.type === 'fast') {
    enemy.y += enemy.speed * 1.5;
  } else {
    enemy.y += enemy.speed;
  }

  if (enemy.y > height + enemySize) {
    enemy.y = random(-300, -50);
    enemy.x = random(enemySize, width - enemySize);
    // ★ OPTION A：敵を再生成する時も type を設定
    if (OPTION_A_ENABLED) {
      enemy.type = random() < 0.3 ? 'fast' : 'normal';
    }
    enemy.speed = enemySpeed + random(0, 2);
    score += 1;
  }
}

function drawEnemy(enemy) {
  fill(enemyColor);
  noStroke();
  
  // ★ OPTION A：敵のタイプに応じて見た目を変更
  if (OPTION_A_ENABLED && enemy.type === 'fast') {
    circle(enemy.x, enemy.y, enemySize * 0.8);
  } else {
    circle(enemy.x, enemy.y, enemySize);
  }
}

// ... その他の関数は変わらない ...
```

---

## ✅ 実装チェックリスト

- [ ] グローバル変数に `OPTION_A_ENABLED = true` を追加
- [ ] startGame() で敵を生成するときに type を設定
- [ ] moveEnemy() で敵の type に応じて移動速度を変更
- [ ] moveEnemy() で敵の再生成時に type を再設定
- [ ] drawEnemy() で敵の type に応じて見た目を変更
- [ ] ゲームを実行して、敵が 2 種類表示されるか確認
- [ ] 速い敵の方が速く移動するか確認

---

## 🧪 テスト方法

### テスト1：敵が 2 種類に分かれているか確認

```
実行してゲームを開始
→ 敵が大きいのと小さいのが混在しているか確認
→ 小さい敵の方が速く移動しているか確認
```

### テスト2：敵の再生成時に type が変わっているか確認

```
ゲームプレイ中に敵を避ける
→ 敵が画面下に消えて、画面上に戻ってくる
→ 戻ってきた敵が異なるタイプか確認（大きさが変わる可能性）
```

### テスト3：コンソールで type を確認

```javascript
// drawEnemy() に追加
console.log('敵のタイプ:', enemy.type);

// ブラウザの開発者ツール（F12）で、敵の type が表示されるか確認
```

---

## 💡 応用課題

**時間が余ったら、さらに工夫してみよう：**

- [ ] 敵のタイプを 3 種類以上に増やす
- [ ] タイプごとに敵の色を変える
- [ ] 敵のタイプによって得点を変える（速い敵は高得点）
- [ ] タイプごとに敵の形を変える（円→四角形など）

---

## 📞 困ったときは

| 問題 | 原因 | 対応 |
|------|------|------|
| 敵が全て同じサイズ | type 設定がされていない | startGame() の type 設定を確認 |
| 敵の速度が変わらない | moveEnemy() の条件分岐が間違っている | if (enemy.type === 'fast') を確認 |
| エラーが出た | 変数名のスペルが違う | `enemy.type` の綴りを確認 |

---

## 🎓 学習ポイント

このオプションで学べること：

✅ **オブジェクトのプロパティ拡張** — 敵オブジェクトに新しい情報を追加  
✅ **条件分岐** — 敵のタイプに応じて異なる処理  
✅ **ランダム生成** — 確率を使った敵の振り分け  
✅ **ゲーム設計** — 敵に多様性を持たせることでゲームを面白くする

