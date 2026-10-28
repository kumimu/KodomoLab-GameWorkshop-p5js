# LESSON_6G：BGM のカスタマイズ - ゲーム音楽を自分で作る

## 🎯 学習目標

ゲーム中に鳴る BGM（背景音楽）を自分で作り、複数のパターンを用意して切り替える。

- 周波数シーケンス配列の理解と活用（重要！）
- Web Audio API の基本（`playSound()` 関数の仕組み）
- 複数の BGM パターンを作成する方法
- BGM を切り替える実装
- 生徒が自分で新しい周波数シーケンスを作成できるようにする

---

## 💡 BGM とは

### ゲーム音楽の役割

ゲームをプレイするときの背景音楽のこと。

```
BGM がない場合 → 無音、つまらない
BGM がある場合 → ゲームの雰囲気が出る、盛り上がる
```

### このレッスンでできること

- **基本BGM** — ゲーム中に常に流れている音楽
- **複数パターン** — ステージごとに異なる音楽
- **音楽の変更** — キー入力で音楽を切り替える

---

## 🎵 周波数シーケンス配列（重要！）

### 周波数とは

音の「高さ」を表す数値。

```
周波数が低い（例：100Hz）→ 低い音
周波数が高い（例：1000Hz）→ 高い音
```

### ドレミファソラシド（C Major Scale）

```
| 音 | 周波数（Hz） |
|----|------------|
| ド | 261.63 |
| レ | 293.66 |
| ミ | 329.63 |
| ファ | 349.23 |
| ソ | 392.00 |
| ラ | 440.00 |
| シ | 493.88 |
| ド | 523.25 |
```

### 周波数シーケンスとは

複数の周波数を配列で並べたもの。

```javascript
// ドレミファソラシド
const DO_RE_MI = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
```

この配列を順番に再生すると、「ドレミファソラシド」という音楽が聞こえます。

---

## 🎮 実装の流れ

### ステップ1：周波数シーケンスを定義

```javascript
// グローバル変数の追加
const BGM_PATTERNS = {
  // パターン1：Happy（明るい）
  happy: [262, 330, 392, 262, 294, 330, 349, 330],
  
  // パターン2：Dark（暗い）
  dark: [110, 165, 220, 165, 130, 195, 220, 195],
  
  // パターン3：Fast（速い）
  fast: [330, 440, 330, 440, 330, 440, 330, 440],
  
  // パターン4：Slow（遅い）
  slow: [110, 110, 110, 220, 220, 220, 110, 110]
};

let currentBGM = BGM_PATTERNS.happy;  // 現在のBGM
```

### ステップ2：BGM 再生ロジック

```javascript
let bgmTimer = 0;
let bgmIndex = 0;  // 現在の音のインデックス

function updateBGM(dt) {
  if (!bgmEnabled) return;  // BGM がOFFなら何もしない
  
  bgmTimer -= dt;
  
  if (bgmTimer <= 0) {
    // 次の音を再生
    bgmTimer = 0.22;  // 1/4.5秒ごとに音を再生
    
    const freq = currentBGM[bgmIndex % currentBGM.length];
    playSound(freq, 0.11);
    
    bgmIndex++;
  }
}
```

### ステップ3：BGM パターンを切り替える

```javascript
function keyPressed() {
  const k = key.toLowerCase();
  
  if (k === '1') {
    currentBGM = BGM_PATTERNS.happy;
    notice = 'BGM: Happy に変更';
    noticeTime = 1;
  } else if (k === '2') {
    currentBGM = BGM_PATTERNS.dark;
    notice = 'BGM: Dark に変更';
    noticeTime = 1;
  } else if (k === '3') {
    currentBGM = BGM_PATTERNS.fast;
    notice = 'BGM: Fast に変更';
    noticeTime = 1;
  } else if (k === '4') {
    currentBGM = BGM_PATTERNS.slow;
    notice = 'BGM: Slow に変更';
    noticeTime = 1;
  }
  
  return false;
}
```

---

## 📚 周波数シーケンス配列の詳細

### 配列のインデックス

```javascript
const melody = [262, 330, 392, 262];

melody[0]  // 262（最初の音）
melody[1]  // 330（2番目の音）
melody[2]  // 392（3番目の音）
melody[3]  // 262（4番目の音）
```

### 配列の長さを超えたときの処理

```javascript
// melody の長さは 4

bgmIndex = 0;  melody[0 % 4] = melody[0] = 262
bgmIndex = 1;  melody[1 % 4] = melody[1] = 330
bgmIndex = 2;  melody[2 % 4] = melody[2] = 392
bgmIndex = 3;  melody[3 % 4] = melody[3] = 262
bgmIndex = 4;  melody[4 % 4] = melody[0] = 262（最初に戻る）
bgmIndex = 5;  melody[5 % 4] = melody[1] = 330

// この処理のおかげで、ループが無限に続く
```

**「%」（モジロ演算子）** は、配列をループさせるために使います。

### 実装例：ドレミファソラシド

```javascript
const DO_RE_MI = [
  261.63,  // ド
  293.66,  // レ
  329.63,  // ミ
  349.23,  // ファ
  392.00,  // ソ
  440.00,  // ラ
  493.88,  // シ
  523.25   // ド（1オクターブ上）
];

// この配列を再生すると「ドレミファソラシド」と聞こえる
```

---

## 📝 段階的な実装ガイド

### 段階1：基本的な BGM（10分程度）

目標：1つの BGM パターンを再生する

```javascript
// グローバル変数
const BGM = [220, 330, 440, 330, 261.63, 392, 523, 392];
let bgmTimer = 0;
let bgmIndex = 0;

// updateGame()内で BGM を更新
function updateGame(dt) {
  bgmTimer -= dt;
  
  if (bgmTimer <= 0) {
    bgmTimer = 0.22;
    const freq = BGM[bgmIndex % BGM.length];
    playSound(freq, 0.11);
    bgmIndex++;
  }
}
```

**確認ポイント：** ゲーム中に音楽が流れるか確認

---

### 段階2：複数パターンの BGM（15分程度）

目標：3種類以上の BGM パターンを用意

```javascript
const BGM_PATTERNS = {
  pattern1: [262, 330, 392, 262, 294, 330, 349, 330],
  pattern2: [110, 165, 220, 165, 130, 195, 220, 195],
  pattern3: [330, 440, 330, 440, 330, 440, 330, 440]
};

let currentBGM = BGM_PATTERNS.pattern1;
```

**確認ポイント：** `currentBGM` を変えて、異なる音楽が再生されるか確認

---

### 段階3：BGM を切り替える（20分程度）

目標：キー入力で BGM パターンを切り替える

```javascript
function keyPressed() {
  if (key === '1') {
    currentBGM = BGM_PATTERNS.pattern1;
  } else if (key === '2') {
    currentBGM = BGM_PATTERNS.pattern2;
  } else if (key === '3') {
    currentBGM = BGM_PATTERNS.pattern3;
  }
  return false;
}
```

**確認ポイント：** 1, 2, 3キーで BGM が切り替わるか確認

---

### 段階4：ステージごとに BGM を自動切り替え（25分程度）

目標：ステージが進むと BGM が自動で切り替わる

```javascript
function updateGame(dt) {
  const stage = STAGES[stageIndex];
  
  // ステージに応じた BGM を選ぶ
  if (stageIndex === 0) {
    currentBGM = BGM_PATTERNS.happy;
  } else if (stageIndex === 1) {
    currentBGM = BGM_PATTERNS.dark;
  } else if (stageIndex === 2) {
    currentBGM = BGM_PATTERNS.fast;
  }
  
  // BGM を再生
  bgmTimer -= dt;
  if (bgmTimer <= 0) {
    bgmTimer = 0.22;
    const freq = currentBGM[bgmIndex % currentBGM.length];
    playSound(freq, 0.11);
    bgmIndex++;
  }
}
```

**確認ポイント：** ステージを選ぶと、異なる BGM が再生されるか確認

---

## 🧠 理解を深める：周波数シーケンスの仕組み

### フロー図

```
1フレーム経過
  ↓
bgmTimer -= dt
  ↓
bgmTimer <= 0？
  ├─ NO → 何もしない、次のフレームへ
  └─ YES → 以下を実行
    ↓
bgmTimer = 0.22（リセット）
    ↓
freq = currentBGM[bgmIndex % currentBGM.length]
（現在の周波数を取得）
    ↓
playSound(freq, 0.11)
（その周波数の音を0.11秒間再生）
    ↓
bgmIndex++
（次の周波数へ）
```

### 複数パターンの BGM が再生される仕組み

```
パターン1：[262, 330, 392, 262]
パターン2：[110, 165, 220, 165]
パターン3：[330, 440, 330, 440]

currentBGM = パターン1 として再生開始
  ↓
262 → 330 → 392 → 262 → 262 → 330 → ...（ループ）
  ↓
キー「2」を押す
  ↓
currentBGM = パターン2 に変更
  ↓
110 → 165 → 220 → 165 → 110 → 165 → ...（新しいパターンでループ）
```

---

## 💾 完全な実装例

### グローバル変数

```javascript
const BGM_PATTERNS = {
  happy: [262, 330, 392, 262, 294, 330, 349, 330],
  dark: [110, 165, 220, 165, 130, 195, 220, 195],
  fast: [330, 440, 330, 440, 330, 440, 330, 440],
  slow: [110, 110, 110, 220, 220, 220, 110, 110]
};

let currentBGM = BGM_PATTERNS.happy;
let bgmTimer = 0;
let bgmIndex = 0;
let bgmEnabled = true;
```

### BGM 更新関数

```javascript
function updateBGM(dt) {
  if (!bgmEnabled) return;  // BGM OFFなら実行しない
  
  bgmTimer -= dt;
  
  if (bgmTimer <= 0) {
    bgmTimer = 0.22;  // 次の音までの時間
    
    const freq = currentBGM[bgmIndex % currentBGM.length];
    playSound(freq, 0.11);
    
    bgmIndex++;
  }
}
```

### BGM 切り替え（キー入力）

```javascript
function keyPressed() {
  const k = key.toLowerCase();
  
  // M キー：BGM のON/OFF
  if (k === 'm') {
    bgmEnabled = !bgmEnabled;
    notice = bgmEnabled ? 'BGM ON' : 'BGM OFF';
    noticeTime = 1;
    return false;
  }
  
  // 1-4 キー：BGM パターン切り替え
  if (k === '1') {
    currentBGM = BGM_PATTERNS.happy;
    bgmIndex = 0;  // 最初から再生
    notice = 'BGM: Happy';
  } else if (k === '2') {
    currentBGM = BGM_PATTERNS.dark;
    bgmIndex = 0;
    notice = 'BGM: Dark';
  } else if (k === '3') {
    currentBGM = BGM_PATTERNS.fast;
    bgmIndex = 0;
    notice = 'BGM: Fast';
  } else if (k === '4') {
    currentBGM = BGM_PATTERNS.slow;
    bgmIndex = 0;
    notice = 'BGM: Slow';
  }
  
  noticeTime = 1;
  return false;
}
```

### updateGame()内での呼び出し

```javascript
function updateGame(dt) {
  // BGM を更新
  updateBGM(dt);
  
  // その他のゲーム処理...
}
```

---

## 🎨 生徒の工夫例

### 工夫例1：オリジナル周波数シーケンス

```javascript
// 著作権フリーな有名なメロディ
const TWINKLE_TWINKLE = [
  262, 262, 392, 392, 440, 440, 392,
  349, 349, 330, 330, 294, 294, 262
];

// または、自分で作った完全オリジナル
const MY_ORIGINAL = [200, 250, 300, 250, 200, 250, 300, 350];

BGM_PATTERNS.twinkle = TWINKLE_TWINKLE;
BGM_PATTERNS.original = MY_ORIGINAL;
```

**特徴：** 有名なメロディやオリジナルメロディで個性が出る

---

### 工夫例2：ステージごとに自動で BGM を変更

```javascript
function updateGame(dt) {
  // ステージに応じた BGM を設定
  const bgmByStage = [
    BGM_PATTERNS.happy,
    BGM_PATTERNS.dark,
    BGM_PATTERNS.fast,
    BGM_PATTERNS.slow
  ];
  
  // ステージが変わったら BGM も変わる
  if (currentBGM !== bgmByStage[stageIndex]) {
    currentBGM = bgmByStage[stageIndex];
    bgmIndex = 0;
  }
  
  updateBGM(dt);
}
```

**特徴：** ステージクリア時に自動で新しい音楽に切り替わる

---

### 工夫例3：BGM の速度を変える

```javascript
let bgmSpeed = 1.0;  // 1.0 = 通常速度

function updateBGM(dt) {
  bgmTimer -= dt;
  
  // 速度を変える
  const interval = 0.22 / bgmSpeed;
  
  if (bgmTimer <= 0) {
    bgmTimer = interval;
    const freq = currentBGM[bgmIndex % currentBGM.length];
    playSound(freq, 0.11);
    bgmIndex++;
  }
}

// ゲームが進むと BGM が速くなる
function keyPressed() {
  if (key === '+') {
    bgmSpeed += 0.1;  // 速くなる
  } else if (key === '-') {
    bgmSpeed = max(0.5, bgmSpeed - 0.1);  // 遅くなる
  }
  return false;
}
```

**特徴：** 難易度が上がると BGM も速くなり、ゲームの雰囲気が変わる

---

### 工夫例4：複数の音を同時に再生（ハーモニー）

```javascript
const BGM_HAPPY = [262, 330, 392, 262, 294, 330, 349, 330];
const BGM_BASS = [131, 165, 196, 131, 147, 165, 175, 165];  // 1オクターブ下

function updateBGM(dt) {
  bgmTimer -= dt;
  
  if (bgmTimer <= 0) {
    bgmTimer = 0.22;
    
    const freq1 = BGM_HAPPY[bgmIndex % BGM_HAPPY.length];
    const freq2 = BGM_BASS[bgmIndex % BGM_BASS.length];
    
    // メロディとベースを同時に再生
    playSound(freq1, 0.11);
    playSound(freq2, 0.11);
    
    bgmIndex++;
  }
}
```

**特徴：** 2つの周波数を同時に再生すると、ハーモニーが生まれる

---

### 工夫例5：敵の種類に応じた効果音を BGM に組み込む

```javascript
// 敵を倒した時に周波数を追加
let currentBGM = [262, 330, 392, 262];

function destroyEnemy(e) {
  score += 10;
  
  // 倒した敵の種類に応じた周波数を BGM に追加
  if (e.type === 'fast') {
    currentBGM.push(523);  // 高い音を追加
  } else if (e.type === 'slow') {
    currentBGM.push(220);  // 低い音を追加
  }
}
```

**特徴：** ゲームの進行に応じて BGM が動的に変わる

---

### 工夫例6：ボス戦時に BGM が変わる

```javascript
const BGM_BOSS = [110, 165, 220, 274, 220, 165, 110, 110];

function spawnBoss() {
  boss = { ... };
  
  // ボス出現時に BGM を変更
  currentBGM = BGM_BOSS;
  bgmIndex = 0;
  notice = '⚠ BOSS INCOMING';
  noticeTime = 3;
}

function updateGame(dt) {
  // ボス戦中は BGM_BOSS を再生
  if (boss) {
    currentBGM = BGM_BOSS;
  } else {
    currentBGM = BGM_PATTERNS.happy;  // 通常モード
  }
  
  updateBGM(dt);
}
```

**特徴：** ボス戦になると、緊張感のある BGM に自動で切り替わる

---

## ❓ 理解度確認クイズ

### クイズ1：周波数シーケンスとは

以下のコードで、再生される音の順序は？

```javascript
const melody = [262, 330, 392, 262];
```

**選択肢：**
- A. 262 のみが何度も再生される
- B. 262 → 330 → 392 → 262 → 262 → 330 → ... と繰り返される
- C. 全ての周波数が同時に再生される

**答え：** B（配列の要素を順番に再生してループ）

---

### クイズ2：モジロ演算子の役割

```javascript
currentBGM[bgmIndex % currentBGM.length]
```

このコードで、`%` の役割は何ですか？

**選択肢：**
- A. 周波数を掛ける
- B. 周波数を割る
- C. 配列の範囲内に保つ（ループさせる）

**答え：** C（配列を超えたら最初に戻す）

---

### クイズ3：BGM の速度

以下のコードで、BGM の速度はどう変わりますか？

```javascript
// 基本
bgmTimer = 0.22;

// 変更後
bgmTimer = 0.11;
```

**選択肢：**
- A. 速くなる（0.11秒で次の音が再生される）
- B. 遅くなる
- C. 変わらない

**答え：** A（時間が短いほど、音が速く再生される）

---

### クイズ4：複数パターンの切り替え

キー「2」を押したとき、どうなりますか？

```javascript
if (k === '2') {
  currentBGM = BGM_PATTERNS.dark;
  bgmIndex = 0;
}
```

**選択肢：**
- A. 現在の BGM が即座に止まり、新しい BGM が最初から再生される
- B. 現在の BGM が続き、その後新しい BGM に切り替わる
- C. 2つの BGM が同時に再生される

**答え：** A（`currentBGM` を変更し、`bgmIndex = 0` で最初に戻す）

---

## 📌 重要ポイントまとめ

| ポイント | 説明 | コード例 |
|---------|------|---------|
| **周波数シーケンス** | 複数の周波数を配列で保存 | `[262, 330, 392, 262]` |
| **モジロ演算子** | 配列をループさせる | `bgmIndex % currentBGM.length` |
| **BGM タイマー** | 音と音の間隔を制御 | `bgmTimer = 0.22` |
| **BGM 切り替え** | `currentBGM` を変更 | `currentBGM = BGM_PATTERNS.dark` |
| **ドレミファソラシド** | 標準的な周波数 | `[261.63, 293.66, 329.63, ...]` |

---

## 🎓 コーチからのアドバイス

### 「周波数シーケンスを自分で作りたい」

以下の周波数表を参考に、好きなメロディを配列にしてください。

**ドレミファソラシド（C Major）**
```
ド=262, レ=294, ミ=330, ファ=349, ソ=392, ラ=440, シ=494, ド=523
```

**例：「ドド、レレ、ミミ、ミミ」**
```javascript
const melody = [262, 262, 294, 294, 330, 330, 330, 330];
```

### 「BGM の音が出ない」

以下を確認してください。

1. `bgmEnabled` が `true` になっているか
2. `playSound()` 関数が正しく実装されているか
3. ブラウザの音声が ON になっているか

### 「BGM が長い」

長いメロディを作りたい場合は、配列を大きくします。

```javascript
const longMelody = [
  262, 330, 392, 262, 294, 330, 349, 330,
  262, 330, 392, 262, 294, 330, 349, 330
];
```

配列の要素が多いほど、BGM が長くなります。

---

## 🔗 次のステップ

1. **基本的な BGM から** — 1つのシンプルなパターンで始める
2. **複数パターンを作成** — 3〜4種類のパターンを用意
3. **キー入力で切り替え** — 1, 2, 3 キーで切り替える
4. **ステージと連動** — ステージが進むと BGM も変わる
5. **さらに工夫** — ハーモニー、速度変更、ダイナミックな変更

---

## 🎵 周波数表（参考）

### 主な周波数（Hz）

| 音 | C | D | E | F | G | A | B |
|----|---|---|---|---|---|---|---|
| **1オクターブ下** | 131 | 147 | 165 | 175 | 196 | 220 | 247 |
| **標準** | 262 | 294 | 330 | 349 | 392 | 440 | 494 |
| **1オクターブ上** | 523 | 587 | 659 | 698 | 784 | 880 | 988 |
| **2オクターブ上** | 1047 | 1175 | 1319 | 1397 | 1568 | 1760 | 1976 |

---

## ✅ 成功の目安

- [ ] 基本的な BGM パターンが再生される
- [ ] 複数の BGM パターンが用意されている
- [ ] キー入力で BGM パターンが切り替わる
- [ ] BGM がスムーズにループしている（途切れたり、重複しない）
- [ ] M キーで BGM のON/OFFが切り替わる
- [ ] ステージが変わると、対応する BGM が再生される

---

## 💪 最後に

BGM は、ゲームの雰囲気を大きく左右します。

シンプルなシーケンスでも、工夫次第で面白い音楽が生まれます。

いろいろなパターンを試して、自分だけのオリジナル BGM を作ってください！

質問があれば、いつでもコーチに聞いてね！

頑張れ！🎮🎵✨

---

## 🔗 他の詳細レッスンとの関連性

### LESSON_6H（ビジュアルカスタマイズ）との連携

**BGM とビジュアルを統一することで、ゲーム全体の雰囲気が完成します。**

LESSON_6G での BGM パターン：
```javascript
// Happy パターン
const happy = [262, 330, 392, 262, 294, 330, 349, 330];

// Dark パターン  
const dark = [110, 165, 220, 165, 130, 195, 220, 195];
```

LESSON_6H での背景色設定：
```javascript
// Happy ステージ
ctx.fillStyle = '#071029';  // 明るい背景

// Dark ステージ
ctx.fillStyle = '#260b21';  // 暗い背景
```

**一緒に実装した場合の効果：**
- 明るい BGM には明るい背景
- 暗い BGM には暗い背景
- ゲーム全体の統一感が生まれる

---

### 他のレッスンとの関連性（低い）

**LESSON_6G は比較的独立した機能です。**

- LESSON_6A（敵の多様化）：敵撃破時の効果音を変えることで、さらに工夫できます
- LESSON_6B（射撃機能）：敵撃破時の周波数を敵の種類に応じて変えることで、爽快感が増します
- LESSON_6M（スコアシステム）：コンボ数に応じて BGM の速度を変えることで、ゲームの緊迫感を表現できます

ただし、これらはすべてオプションです。LESSON_6G 単独での実装も十分に価値があります。

---

## 🔗 関連するレッスン・参考資料

### このレッスンと関連する改造オプション

**組み合わせ例1：BGM のカスタマイズ + ビジュアルカスタマイズ**
- BGM が変わるとき、背景色も同時に変わる
- → **[H] ビジュアルカスタマイズ** の詳細レッスンも読む
- 音と見た目の両方でゲームの雰囲気が変わる

**組み合わせ例2：BGM のカスタマイズ + 効果音**
- BGM と効果音が調和するように設計
- → **参考資料 [I] 効果音の追加** を参照
- 敵撃破時の効果音が BGM と同じスケール（周波数）を使用

**組み合わせ例3：BGM のカスタマイズ + ステージシステム**
- ステージごとに異なる BGM が再生される
- → **参考資料 [E] ステージシステム** を参照
- ゲーム全体の一貫性が高まる

### 時間が余った場合の発展課題

**課題1：複数の BGM パターンを作成**
- 現在：3～4パターン
- 発展：8パターン以上のオリジナル音楽
- コツ：異なる周波数シーケンスで、全く異なるメロディを作成

**課題2：BGM を動的に変更**
- ゲームの難易度が上がるに従い、BGM も速くなる
- エネルギー（HP）が減ると、BGM が不安定になる
- → ゲームの緊迫感が表現される

**課題3：周波数シーケンスの工夫**
- 参考資料 **[K] コンボシステム** との組み合わせ
- コンボが増えるに従い、BGM の周波数が上がる
- → 音でプレイヤーの興奮度を表現

**課題4：参考資料 [D] ボスバトルの BGM**
- ボスが出現したとき、BGM が変わる
- 緊張感のあるメロディに切り替え
- → ボス戦の期待感が高まる

**課題5：著作権フリーなメロディの引用**
- 市販曲のメロディを周波数で再現
- 「トゥインクル、トゥインクル、リトルスター」など
- → 有名なメロディでゲームの親しみやすさが上がる
