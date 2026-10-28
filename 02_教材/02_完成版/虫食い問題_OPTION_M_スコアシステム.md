# 虫食い問題：OPTION M — スコアシステムの工夫

**難易度：★★★** | **実装時間：30～45分** | **学習：オブジェクト・計算ロジック・スコア管理**

---

## 🎯 目標

敵のタイプに応じて異なる得点を設定し、コンボシステムを追加する。

**完成時のゲーム：**
- 敵は通常敵（10点）とレア敵（50点）の 2 種類
- 連続で敵を倒すとコンボが増える
- コンボが 5 の倍数ごとに得点倍率が上がる

---

## 📝 虫食い問題 — 段階1：敵オブジェクトに value プロパティを追加

### 問題1：敵の初期化時に value を設定

**startGame() 関数内の敵の生成部分を修正：**

```javascript
function startGame(level) {
  // ... 難易度設定 ...

  playerX = width / 2;
  playerY = height - 55;
  score = 0;
  startTime = millis();
  resultText = "";
  enemies = [];

  for (let i = 0; i < enemyCount; i++) {
    const isRare = random() < 0.15;  // 15% の確率でレア敵
    enemies.push({
      x: random(enemySize, width - enemySize),
      y: random(-300, -50),
      speed: enemySpeed + random(0, 2),
      // ★ ここを埋めてください
      value: ________________________  // ← レア敵なら 50、通常なら 10
    });
  }

  gameState = "play";
}
```

**💡 ヒント：** 三項演算子を使う：`条件 ? 真の値 : 偽の値`

**答え：**

```javascript
value: isRare ? 50 : 10
```

---

## 📝 虫食い問題 — 段階2：グローバル変数にコンボ変数を追加

### 問題：コンボを管理するグローバル変数を追加

**CUSTOM AREA の下に追加：**

```javascript
// ★ OPTION M：スコアシステムの工夫
const OPTION_M_ENABLED = true;
// ★ ここを埋めてください
let _________________________ = 0;  // ← 現在のコンボ数
let _________________________ = 0;  // ← コンボの継続時間タイマー
```

**💡 ヒント：** `combo` と `comboTimer` という名前が分かりやすい

**答え：**

```javascript
let combo = 0;
let comboTimer = 0;
```

---

## 📝 虫食い問題 — 段階3：敵が消えた時のスコア計算ロジック

### 問題：敵がクリアされた時、コンボを考慮してスコアを計算

**moveEnemy() 関数の敵が画面下に消える部分を修正：**

```javascript
function moveEnemy(enemy) {
  enemy.y += enemy.speed;

  if (enemy.y > height + enemySize) {
    enemy.y = random(-300, -50);
    enemy.x = random(enemySize, width - enemySize);
    enemy.speed = enemySpeed + random(0, 2);

    // ★ ここを埋めてください
    if (OPTION_M_ENABLED) {
      const baseScore = ________________________;  // ← 敵の基礎得点
      const comboMultiplier = ________________________;  // ← コンボの倍率（1 + floor(combo / 5)）
      score += baseScore * comboMultiplier;
      ________________________;  // ← コンボをインクリメント
      ________________________;  // ← コンボタイマーをリセット（180 = 3秒）
    } else {
      score += 1;
    }
  }
}
```

**💡 ヒント：**
- 敵の基礎得点：`enemy.value`
- コンボ倍率：`1 + floor(combo / 5)` （0個 → 1倍、5個 → 2倍、10個 → 3倍）
- コンボインクリメント：`combo++`
- コンボタイマー：`comboTimer = 180`

**答え：**

```javascript
const baseScore = enemy.value;
const comboMultiplier = 1 + floor(combo / 5);
score += baseScore * comboMultiplier;
combo++;
comboTimer = 180;
```

---

## 📝 虫食い問題 — 段階4：playGame() にコンボ更新処理を追加

### 問題：毎フレーム、コンボタイマーを減らす

**playGame() 関数の最初に追加：**

```javascript
function playGame() {
  const elapsed = floor((millis() - startTime) / 1000);
  const remaining = clearTime - elapsed;

  if (remaining <= 0) {
    resultText = "CLEAR!";
    gameState = "end";
    return;
  }

  // ★ ここを埋めてください
  if (OPTION_M_ENABLED) {
    if (comboTimer > 0) {
      ________________________;  // ← コンボタイマーをデクリメント
    } else {
      ________________________;  // ← タイマーが 0 以下なら、コンボをリセット
    }
  }

  drawGameInfo(remaining);
  movePlayer();
  drawPlayer();
  
  // ... 敵の処理 ...
}
```

**💡 ヒント：**
- デクリメント：`comboTimer--`
- リセット：`combo = 0`

**答え：**

```javascript
comboTimer--;
// ...
combo = 0;
```

---

## 📝 虫食い問題 — 段階5：画面にコンボを表示

### 問題：drawGameInfo() にコンボ表示を追加

**drawGameInfo() 関数を修正：**

```javascript
function drawGameInfo(remaining) {
  fill("white");
  textAlign(LEFT);
  textSize(18);
  text("難易度: " + difficultyName, 20, 28);
  text("残り時間: " + remaining, 20, 52);
  text("SCORE: " + score, 20, 76);

  // ★ ここを埋めてください
  if (OPTION_M_ENABLED && combo > 0) {
    fill("yellow");
    textSize(14);
    ________________________;  // ← コンボをテキスト表示
  }
}
```

**💡 ヒント：** `text("COMBO: " + combo + "x", 20, 100)` という形式

**答え：**

```javascript
text("COMBO: " + combo + "x", 20, 100);
```

---

## 📝 虫食い問題 — 段階6：ゲーム開始時にコンボをリセット

### 問題：startGame() でコンボ変数を初期化

**startGame() 関数の敵の初期化の前に追加：**

```javascript
function startGame(level) {
  // ... 難易度設定 ...

  playerX = width / 2;
  playerY = height - 55;
  score = 0;
  startTime = millis();
  resultText = "";
  enemies = [];

  // ★ ここを埋めてください
  if (OPTION_M_ENABLED) {
    ________________________;  // ← combo をリセット
    ________________________;  // ← comboTimer をリセット
  }

  // ... 敵の生成処理 ...

  gameState = "play";
}
```

**答え：**

```javascript
combo = 0;
comboTimer = 0;
```

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

// ★ OPTION M：スコアシステムの工夫
const OPTION_M_ENABLED = true;
let combo = 0;
let comboTimer = 0;

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

  // ★ OPTION M：コンボ初期化
  if (OPTION_M_ENABLED) {
    combo = 0;
    comboTimer = 0;
  }

  for (let i = 0; i < enemyCount; i++) {
    const isRare = random() < 0.15;
    enemies.push({
      x: random(enemySize, width - enemySize),
      y: random(-300, -50),
      speed: enemySpeed + random(0, 2),
      // ★ OPTION M：敵の得点を設定
      value: OPTION_M_ENABLED ? (isRare ? 50 : 10) : 1
    });
  }

  gameState = "play";
}

function playGame() {
  const elapsed = floor((millis() - startTime) / 1000);
  const remaining = clearTime - elapsed;

  if (remaining <= 0) {
    resultText = "CLEAR!";
    gameState = "end";
    return;
  }

  // ★ OPTION M：コンボタイマー更新
  if (OPTION_M_ENABLED) {
    if (comboTimer > 0) {
      comboTimer--;
    } else {
      combo = 0;
    }
  }

  drawGameInfo(remaining);
  movePlayer();
  drawPlayer();

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

function drawGameInfo(remaining) {
  fill("white");
  textAlign(LEFT);
  textSize(18);
  text("難易度: " + difficultyName, 20, 28);
  text("残り時間: " + remaining, 20, 52);
  text("SCORE: " + score, 20, 76);

  // ★ OPTION M：コンボ表示
  if (OPTION_M_ENABLED && combo > 0) {
    fill("yellow");
    textSize(14);
    text("COMBO: " + combo + "x", 20, 100);
  }
}

function moveEnemy(enemy) {
  enemy.y += enemy.speed;

  if (enemy.y > height + enemySize) {
    enemy.y = random(-300, -50);
    enemy.x = random(enemySize, width - enemySize);
    enemy.speed = enemySpeed + random(0, 2);

    // ★ OPTION M：コンボを考慮したスコア計算
    if (OPTION_M_ENABLED) {
      const baseScore = enemy.value;
      const comboMultiplier = 1 + floor(combo / 5);
      score += baseScore * comboMultiplier;
      combo++;
      comboTimer = 180;
    } else {
      score += 1;
    }
  }
}
```

---

## ✅ 実装チェックリスト

- [ ] グローバル変数に `OPTION_M_ENABLED`, `combo`, `comboTimer` を追加
- [ ] startGame() で敵に value プロパティを設定
- [ ] startGame() でコンボ変数を初期化
- [ ] moveEnemy() でコンボを計算してスコア加算
- [ ] playGame() でコンボタイマーを更新
- [ ] drawGameInfo() でコンボを表示
- [ ] ゲームを実行して敵撃破でスコアが加算されるか確認
- [ ] コンボが増えるか確認
- [ ] コンボ倍率でスコアが増えるか確認

---

## 🧪 テスト方法

### テスト1：敵撃破でスコアが加算されるか確認

```
ゲーム中に敵を避ける
→ 敵が画面下に消える
→ スコアが加算される（通常敵 10 点、レア敵 50 点）
```

### テスト2：コンボが増えるか確認

```
敵を連続で避ける
→ "COMBO: 1x" が表示される
→ 敵を避けるたびにコンボが増える
```

### テスト3：コンボ倍率でスコアが変わるか確認

```
コンボが 5 になったら、次の敵でスコアが 2 倍になるか確認
コンボが 10 になったら、次の敵でスコアが 3 倍になるか確認
```

### テスト4：コンボが途切れるか確認

```
敵を避けずに一定時間待つ
→ コンボが 0 に戻る
→ スコア倍率が 1 倍に戻る
```

---

## 💡 応用課題

- [ ] 敵の種類を 3 種類以上に増やす
- [ ] コンボ倍率の計算式を変更する
- [ ] コンボボーナスで追加効果音を鳴らす
- [ ] コンボが 10 を超えたら画面全体を光らせる

---

## 📊 スコア計算の例

| 敵タイプ | 基礎得点 | コンボ 0-4 | コンボ 5-9 | コンボ 10+ |
|---------|---------|----------|----------|----------|
| 通常敵 | 10点 | 10点 | 20点 | 30点 |
| レア敵 | 50点 | 50点 | 100点 | 150点 |

---

## 📞 困ったときは

| 問題 | 原因 | 対応 |
|------|------|------|
| スコアが加算されない | moveEnemy() の処理が実行されていない | コンソール（F12）でエラー確認 |
| コンボが表示されない | drawGameInfo() に追加されていない | 表示部分を確認 |
| コンボが永遠に続く | comboTimer の減少が正しくない | playGame() の timer 更新確認 |
| コンボ倍率が変わらない | floor() の計算が間違っている | console.log() で値を確認 |

---

## 🎓 学習ポイント

✅ **オブジェクト設計** — 敵オブジェクトにプロパティを追加  
✅ **計算ロジック** — コンボ倍率の計算  
✅ **状態管理** — コンボの保持と更新  
✅ **画面表示** — 情報をリアルタイム表示

