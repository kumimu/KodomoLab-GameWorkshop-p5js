# 虫食い問題：OPTION G — BGM のカスタマイズ

**難易度：★★☆** | **実装時間：20～30分** | **学習：配列・タイマー・音声処理**

---

## 🎯 目標

ゲーム中に定期的にメロディを再生し、BGM を追加する。

**完成時のゲーム：**
- ゲーム開始時に BGM が流れ始める
- ドレミファソラシドのメロディが繰り返される
- ゲーム終了時に BGM も止まる

---

## 📝 虫食い問題 — 段階1：BGM に必要な変数を追加

### 問題：グローバル変数に BGM 設定を追加

**📍 ファイル：`sketch.js`**

**📍 場所：「CUSTOM AREA」の下**

現在のコード：
```javascript
let gameTitle = "隕石をよけろ！";
// ================================================  ← ここの下に追加！

let gameState = "start"; // start / play / end
let playerX;
```

**追加するコード：**

```javascript
let gameTitle = "隕石をよけろ！";
// ================================================

// ★ OPTION G：BGM のカスタマイズ
const OPTION_G_ENABLED = true;
const BGM_MELODY = [262, 294, 330, 349, 392, 440, 493, 523];  // ドレミファソラシド
// ★ ここを埋めてください
let _________________________ = 0;  // ← BGM の再生タイマー
let _________________________ = 0;  // ← BGM のメロディインデックス

let gameState = "start"; // start / play / end
```

**💡 ヒント：** タイマーは `bgmTimer`、インデックスは `bgmIndex` という名前がわかりやすい

**答え：**

```javascript
let bgmTimer = 0;
let bgmIndex = 0;
```

**✅ 追加後の確認：**
```
grep で確認：Ctrl + F で「bgmTimer」を検索
→ 「let bgmTimer = 0;」が見つかる？
```

---

## 📝 虫食い問題 — 段階2：playGame() に BGM 再生処理を追加

### 問題：定期的に周波数を再生

**📍 ファイル：`sketch.js`**

**📍 場所：`playGame()` 関数の中**

**📍 具体的な場所：最初の「if (remaining <= 0)」の下**

現在のコード：
```javascript
function playGame() {
  const elapsed = floor((millis() - startTime) / 1000);
  const remaining = clearTime - elapsed;

  if (remaining <= 0) {
    resultText = "CLEAR!";
    gameState = "end";
    return;
  }
  // ← ここに追加！（drawGameInfo() の上）

  drawGameInfo(remaining);
  movePlayer();
  drawPlayer();
  // ... 敵の処理 ...
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

  // ★ OPTION G：BGM 再生
  if (OPTION_G_ENABLED) {
    ____________________________  // ← タイマーをインクリメント
    if (bgmTimer % 15 === 0) {    // 15フレームごと（約0.25秒）
      const freq = BGM_MELODY[bgmIndex % BGM_MELODY.length];
      sound(freq, 0.1);
      ____________________________  // ← bgmIndex をインクリメント
    }
  }

  drawGameInfo(remaining);
  movePlayer();
  drawPlayer();
  
  // ... 敵の処理 ...
}
```

**💡 ヒント：**
- タイマーをインクリメント：`bgmTimer++`
- インデックスをインクリメント：`bgmIndex++`

**答え：**

```javascript
bgmTimer++;
// ...
bgmIndex++;
```

**✅ 追加後の確認：**
```
1. Ctrl + S で保存
2. F5 でリロード
3. ゲーム開始
4. 音が聞こえる？
```

---

## 📝 虫食い問題 — 段階3：ゲーム開始時に BGM を初期化

### 問題：startGame() で BGM 変数をリセット

**📍 ファイル：`sketch.js`**

**📍 場所：`startGame()` 関数の中**

**📍 具体的な場所：`enemies = [];` の直後**

現在のコード：
```javascript
function startGame(level) {
  if (level === 1) {
    // ... 難易度設定 ...
  }

  playerX = width / 2;
  playerY = height - 55;
  score = 0;
  startTime = millis();
  resultText = "";
  enemies = [];
  // ← ここに追加！（for ループの上）

  for (let i = 0; i < enemyCount; i++) {
    // ... 敵の生成処理 ...
  }

  gameState = "play";
}
```

**追加するコード：**

```javascript
function startGame(level) {
  if (level === 1) {
    // ... 難易度設定 ...
  }

  playerX = width / 2;
  playerY = height - 55;
  score = 0;
  startTime = millis();
  resultText = "";
  enemies = [];

  // ★ OPTION G：BGM 初期化
  if (OPTION_G_ENABLED) {
    ____________________________  // ← bgmTimer をリセット
    ____________________________  // ← bgmIndex をリセット
  }

  for (let i = 0; i < enemyCount; i++) {
    // ... 敵の生成処理 ...
  }

  gameState = "play";
}
```

**💡 ヒント：** 両方とも 0 に戻す

**答え：**

```javascript
bgmTimer = 0;
bgmIndex = 0;
```

**✅ 追加後の確認：**
```
1. ゲーム開始時に BGM タイマーがリセットされる
2. ゲーム再開時に BGM が最初から再生される
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

// ★ OPTION G：BGM のカスタマイズ
const OPTION_G_ENABLED = true;
const BGM_MELODY = [262, 294, 330, 349, 392, 440, 493, 523];  // ドレミファソラシド
let bgmTimer = 0;
let bgmIndex = 0;

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

  // ★ OPTION G：BGM 初期化
  if (OPTION_G_ENABLED) {
    bgmTimer = 0;
    bgmIndex = 0;
  }

  for (let i = 0; i < enemyCount; i++) {
    enemies.push({
      x: random(enemySize, width - enemySize),
      y: random(-300, -50),
      speed: enemySpeed + random(0, 2)
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

  // ★ OPTION G：BGM 再生
  if (OPTION_G_ENABLED) {
    bgmTimer++;
    if (bgmTimer % 15 === 0) {  // 15フレームごと
      const freq = BGM_MELODY[bgmIndex % BGM_MELODY.length];
      sound(freq, 0.1);
      bgmIndex++;
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
```

---

## ✅ 実装チェックリスト

- [ ] グローバル変数に `OPTION_G_ENABLED`, `BGM_MELODY`, `bgmTimer`, `bgmIndex` を追加
- [ ] playGame() に BGM 再生処理を追加
- [ ] startGame() に BGM 初期化処理を追加
- [ ] ゲームを実行して BGM が流れるか確認
- [ ] ドレミファソラシド のメロディが聞こえるか確認
- [ ] ゲーム終了時に BGM が止まるか確認

---

## 🧪 テスト方法

### テスト1：BGM が流れるか確認

```
ゲーム開始
→ ドレミファソラシドのメロディが繰り返し聞こえるか確認
```

### テスト2：BGM の速度を確認

```
15フレームごとに再生されているか確認
→ 必要に応じて % 15 の値を変更（小さくすると速くなる）
```

---

## 💡 応用課題

- [ ] 周波数配列を別のメロディに変更する
- [ ] BGM の速度を変更する（% の値を調整）
- [ ] BGM の音量を変更する（`sound(freq, 0.1)` の 0.1 を調整）
- [ ] ゲームオーバー時に効果音を鳴らす

---

## 📊 周波数リファレンス

| 音名 | 周波数（Hz） |
|------|-------------|
| ド（C4） | 262 |
| レ（D4） | 294 |
| ミ（E4） | 330 |
| ファ（F4） | 349 |
| ソ（G4） | 392 |
| ラ（A4） | 440 |
| シ（B4） | 493 |
| ド（C5） | 523 |

---

## 📞 困ったときは

| 問題 | 原因 | 対応 |
|------|------|------|
| 音が出ない | ブラウザの音声設定 | ブラウザのスピーカー設定確認 |
| メロディが単調 | 周波数が間違っている | BGM_MELODY の値を確認 |
| メロディが速すぎる / 遅い | フレーム間隔が不正 | % の値を調整 |

---

## 🎓 学習ポイント

✅ **配列操作** — メロディを配列で管理  
✅ **タイマー処理** — 定期的な処理の実装  
✅ **モジロ演算** — % を使ったループ制御

