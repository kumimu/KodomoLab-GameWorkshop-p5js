# LESSON_6：応用版へのチャレンジ - 1つのオプション改造

## 概要

LESSON_1〜5 で基礎版（避けゲー）を完成させました。

LESSON_6 では、**応用版（NEON DODGE）の機能から 1つを選んで、自分だけのゲームに改造します**。

同じオプションを選んだ友達とも、**全く異なるゲーム**になるように工夫しましょう。

---

## オプション一覧

### 🎮 ゲームロジック系（難易度：★★☆）
複雑なゲーム機能を追加することで、ゲームの遊び方そのものを変える

- **[A] 敵の多様化**：敵を複数の種類に分ける
- **[B] 射撃機能**：プレイヤーが敵に反撃できるようにする
- **[C] パワーアップシステム**：ゲーム中にパワーアップアイテムが出現
- **[D] ボスバトル**：ラスボスが出現する
- **[E] ステージシステム**：複数のステージで難易度が変わる
- **[F] 隠しコマンド**：特定のキー操作で秘密ステージが出現

### 🎨 ビジュアル・音声系（難易度：★☆☆）
ゲームの見た目・音を変えて、プレイヤーの印象を大きく変える

- **[G] BGM のカスタマイズ**：ゲーム中の音楽を変更
- **[H] ビジュアルカスタマイズ**：敵やプレイヤーの色・形・サイズを変更
- **[I] 効果音の追加**：敵撃破時や得点時の音を追加
- **[J] パーティクル効果**：爆発やエフェクトを追加

### 🚀 高度なオプション（難易度：★★★）
ゲームシステムそのものを大きく改造する

- **[K] コンボシステム**：連続で敵を倒すと得点が増える
- **[L] 難易度調整**：敵の速度・生成頻度・ゲーム時間を変更
- **[M] スコアシステムの工夫**：得点の計算ルールを変える
- **[N] ボーナスステージ**：特定の条件でボーナスが発生

---

## どのオプションを選ぶ？

### 選び方のコツ

**「このゲーム、こんなふうに変えたら面白そうだな」と思うものを選びましょう。**

例：
- 「敵をもっと種類を増やしたい」 → **[A] 敵の多様化**
- 「敵に反撃したい」 → **[B] 射撃機能**
- 「ゲームの音楽を変えたい」 → **[G] BGM のカスタマイズ**
- 「得点をもっと複雑にしたい」 → **[M] スコアシステムの工夫**

**同じオプションを選んでも、工夫次第で全く違うゲームになります！**

---

## 次のステップ

下記から選んだオプションの詳細を読んで、改造に挑戦しましょう。

### ゲームロジック系
- [A - 敵の多様化](#a-敵の多様化)
- [B - 射撃機能](#b-射撃機能)
- [C - パワーアップシステム](#c-パワーアップシステム)
- [D - ボスバトル](#d-ボスバトル)
- [E - ステージシステム](#e-ステージシステム)
- [F - 隠しコマンド](#f-隠しコマンド)

### ビジュアル・音声系
- [G - BGM のカスタマイズ](#g-bgm-のカスタマイズ)
- [H - ビジュアルカスタマイズ](#h-ビジュアルカスタマイズ)
- [I - 効果音の追加](#i-効果音の追加)
- [J - パーティクル効果](#j-パーティクル効果)

### 高度なオプション
- [K - コンボシステム](#k-コンボシステム)
- [L - 難易度調整](#l-難易度調整)
- [M - スコアシステムの工夫](#m-スコアシステムの工夫)
- [N - ボーナスステージ](#n-ボーナスステージ)

---

# A - 敵の多様化

## 説明

基礎版では、敵は「上から落ちてくる同じ形」です。

敵を **複数の種類に分ける** ことで、ゲーム性が大きく変わります。

## 実装の流れ

### ステップ 1：敵に「type」プロパティを追加

```javascript
// 基礎版
enemies.push({
  x: random(enemySize, width - enemySize),
  y: random(-300, -50),
  speed: enemySpeed + random(0, 2)
});

// 応用版：type を追加
const type = random() < 0.5 ? 'fast' : 'slow';

enemies.push({
  x: random(enemySize, width - enemySize),
  y: random(-300, -50),
  speed: enemySpeed + random(0, 2),
  type: type  // ← 敵の種類を記録
});
```

### ステップ 2：敵のタイプに応じて動きを変える

```javascript
// draw() 関数内で敵の移動処理

for (let e of enemies) {
  e.y += e.speed * dt;
  
  // type に応じて異なる動き
  if (e.type === 'zig') {
    e.x += sin(elapsed * 5 + e.phase) * 110 * dt;  // 左右に揺れる
  } else if (e.type === 'spin') {
    e.rotation += 5;  // 回転する
  }
}
```

### ステップ 3：敵の種類ごとに見た目を変える

```javascript
for (let e of enemies) {
  push();
  translate(e.x, e.y);
  
  // タイプごとに色を変える
  if (e.type === 'fast') {
    fill([255, 100, 100]);  // 赤 = 速い
  } else if (e.type === 'slow') {
    fill([100, 100, 255]);  // 青 = 遅い
  }
  
  circle(0, 0, enemySize);
  pop();
}
```

## 生徒の工夫例

### 例 1：敵の速度で分ける
```javascript
const type = random() < 0.3 ? 'slow' : random() < 0.7 ? 'normal' : 'fast';

if (type === 'slow') {
  e.speed = enemySpeed * 0.5;
} else if (type === 'normal') {
  e.speed = enemySpeed;
} else {
  e.speed = enemySpeed * 1.5;
}
```

### 例 2：敵の大きさで分ける
```javascript
const type = random() < 0.5 ? 'big' : 'small';

if (type === 'big') {
  e.size = enemySize * 1.5;
  e.speed = enemySpeed * 0.7;  // 大きい敵は遅い
} else {
  e.size = enemySize * 0.7;
  e.speed = enemySpeed * 1.3;  // 小さい敵は速い
}
```

### 例 3：敵の動きで分ける
```javascript
const type = random() < 0.3 ? 'straight' : random() < 0.6 ? 'wave' : 'spiral';

if (type === 'wave') {
  e.x += sin(elapsed * 3) * 150 * dt;
} else if (type === 'spiral') {
  e.x += cos(elapsed * 4) * 120 * dt;
  e.y += sin(elapsed * 4) * 30 * dt;
}
```

## ヒント

- **得点を変える**：倒しにくい敵はより多くの得点をゲット
- **見た目を工夫**：色だけでなく、形も変えてみる（円・四角・三角）
- **効果音を追加**：敵の種類ごとに異なる音を鳴らす

---

# B - 射撃機能

## 説明

基礎版ではプレイヤーは「避けるだけ」です。

射撃機能を追加することで、**プレイヤーが敵に反撃できる**ようになります。

## 実装の流れ

### ステップ 1：弾の配列を作成

```javascript
let bullets = [];  // グローバル変数に追加
let shotTimer = 0;
```

### ステップ 2：射撃関数を作成

```javascript
function shoot() {
  if (shotTimer > 0) return;  // クールタイム中は発射できない
  shotTimer = 0.18;  // 次の射撃まで 0.18 秒待つ
  
  bullets.push({
    x: playerX,
    y: playerY - 20,
    vy: -400,  // 上に移動
    r: 5
  });
  
  playSound(500, 0.1);  // 射撃音
}
```

### ステップ 3：キー入力で射撃

```javascript
function keyPressed() {
  if (key === ' ') {  // スペースキー
    shoot();
  }
}
```

### ステップ 4：弾の移動と当たり判定

```javascript
// update 関数内

// 弾を移動
for (let b of bullets) {
  b.y += b.vy * dt;
}

// 敵との当たり判定
for (let b of bullets) {
  for (let e of enemies) {
    if (dist(b.x, b.y, e.x, e.y) < b.r + e.r) {
      score += 10;
      enemies.splice(enemies.indexOf(e), 1);  // 敵を削除
      bullets.splice(bullets.indexOf(b), 1);  // 弾を削除
    }
  }
}
```

## 生徒の工夫例

### 例 1：複数の弾を発射
```javascript
function shoot() {
  bullets.push({ x: playerX - 15, y: playerY - 20, vy: -400, r: 5 });
  bullets.push({ x: playerX, y: playerY - 20, vy: -400, r: 5 });
  bullets.push({ x: playerX + 15, y: playerY - 20, vy: -400, r: 5 });
}
```

### 例 2：連続射撃
```javascript
let isRapidFire = false;

function shoot() {
  const interval = isRapidFire ? 0.08 : 0.18;
  if (shotTimer > 0) return;
  shotTimer = interval;
  
  bullets.push({
    x: playerX,
    y: playerY - 20,
    vy: -400,
    r: 5
  });
}
```

### 例 3：斜め射撃
```javascript
function shoot(angle = 0) {
  bullets.push({
    x: playerX,
    y: playerY - 20,
    vx: sin(angle) * 300,
    vy: cos(angle) * 400,
    r: 5
  });
}
```

## ヒント

- **射撃音を変える**：敵の種類ごとに異なる周波数の音
- **弾のサイズを変える**：大きい弾と小さい弾で威力を変える
- **敵に被弾ダメージを追加**：複数回被弾で敵が破壊される

---

# C - パワーアップシステム

## 説明

敵を倒すとパワーアップアイテムが出現し、プレイヤーが拾うと一時的に能力がアップします。

## 実装の流れ

### ステップ 1：パワーアップの種類を決める

```javascript
const pickupTypes = {
  heart: { name: '♥ ライフ +1', effect: 'life' },
  star: { name: '★ 無敵', effect: 'invincible', duration: 5 },
  shield: { name: '◆ シールド', effect: 'shield', duration: 3 },
  rapid: { name: '⚡ 連続射撃', effect: 'rapidFire', duration: 8 }
};
```

### ステップ 2：敵撃破時にアイテムを生成

```javascript
function destroyEnemy(e) {
  score += 10;
  
  // ランダムでパワーアップを出現
  const types = Object.keys(pickupTypes);
  const randomType = types[floor(random(types.length))];
  
  pickups.push({
    x: e.x,
    y: e.y,
    type: randomType,
    t: 0
  });
}
```

### ステップ 3：プレイヤーとアイテムの当たり判定

```javascript
for (let p of pickups) {
  if (dist(p.x, p.y, playerX, playerY) < 20) {
    // アイテムを拾った
    if (p.type === 'heart') {
      playerLives++;
    } else if (p.type === 'star') {
      playerInvincible = 5;  // 5秒間無敵
    } else if (p.type === 'shield') {
      playerShield = true;
    }
    
    pickups.splice(pickups.indexOf(p), 1);
  }
}
```

## 生徒の工夫例

### 例 1：新しいパワーアップを追加
```javascript
// 爆弾：周囲の敵を全て破壊
bomb: { name: '💣 爆弾', effect: 'bomb', duration: 0 }

// 減速：敵が遅くなる
slow: { name: '❄️ 減速', effect: 'slow', duration: 10 }
```

### 例 2：出現確率を変える
```javascript
const rand = random();

if (rand < 0.1) {
  pickups.push({ x: e.x, y: e.y, type: 'heart' });
} else if (rand < 0.2) {
  pickups.push({ x: e.x, y: e.y, type: 'star' });
} else if (rand < 0.4) {
  pickups.push({ x: e.x, y: e.y, type: 'shield' });
}
```

### 例 3：パワーアップの見た目を工夫
```javascript
for (let p of pickups) {
  push();
  translate(p.x, p.y);
  
  // 回転しながら浮かぶ
  rotate(p.t * 3);
  
  fill(pickupColors[p.type]);
  circle(0, 0, 15 + sin(p.t * 5) * 3);
  
  pop();
}
```

## ヒント

- **パワーアップの持続時間を表示**：画面上にカウントダウンを表示
- **同時に複数のパワーアップを持つ**：複数の効果を同時に有効化
- **パワーアップの効果を視覚化**：プレイヤーの見た目が変わる

---

# D - ボスバトル

## 説明

ゲーム終盤にボス敵が出現します。ボスは複数の射撃パターンを持ち、倒すとゲームクリア。

## 実装の流れ

### ステップ 1：ボスデータを作成

```javascript
let boss = null;

function spawnBoss() {
  boss = {
    x: width / 2,
    y: 100,
    r: 40,
    hp: 20,
    maxhp: 20,
    t: 0,
    shotTimer: 0
  };
}
```

### ステップ 2：ボスを描画

```javascript
if (boss) {
  push();
  translate(boss.x, boss.y);
  rotate(boss.t * 0.5);
  
  fill([255, 100, 100]);
  rect(-40, -40, 80, 80);
  
  pop();
  
  // HP バーを表示
  fill([100, 100, 100]);
  rect(50, 20, 100, 10);
  fill([255, 100, 100]);
  rect(50, 20, 100 * boss.hp / boss.maxhp, 10);
}
```

### ステップ 3：ボスの射撃パターン

```javascript
if (boss) {
  boss.t += dt;
  boss.shotTimer -= dt;
  
  if (boss.shotTimer <= 0) {
    boss.shotTimer = 0.5;
    
    // 複数方向に射撃
    for (let i = 0; i < 8; i++) {
      const angle = (TWO_PI / 8) * i;
      enemyBullets.push({
        x: boss.x,
        y: boss.y,
        vx: cos(angle) * 150,
        vy: sin(angle) * 150,
        r: 8
      });
    }
  }
}
```

## 生徒の工夫例

### 例 1：複数の射撃パターン
```javascript
// パターン 1：円形
// パターン 2：直線
// パターン 3：螺旋

const pattern = floor(boss.t / 3) % 3;

if (pattern === 0) {
  // 円形
} else if (pattern === 1) {
  // 直線
} else {
  // 螺旋
}
```

### 例 2：複数ステージのボス
```javascript
const bosses = [
  { name: '火の精', color: [255, 100, 0], hp: 15 },
  { name: '氷の精', color: [0, 100, 255], hp: 20 },
  { name: '雷の精', color: [255, 255, 0], hp: 25 }
];

boss = { ...bosses[stageIndex], x: width / 2, y: 100 };
```

### 例 3：ボスの移動パターン
```javascript
// ボスが左右に移動しながら射撃
boss.x = width / 2 + sin(boss.t * 2) * 200;
boss.y = 100 + cos(boss.t * 1) * 50;
```

## ヒント

- **複数フェーズに分ける**：HP が減ると射撃パターンが変わる
- **ボスの移動速度を変える**：難易度が上がると速くなる
- **クリア後のエフェクト**：ボス撃破時に派手なパーティクル

---

# E - ステージシステム

## 説明

複数のステージを用意し、クリアするごとに難易度が上がります。

## 実装の流れ

### ステップ 1：ステージデータを作成

```javascript
const STAGES = [
  {
    name: 'ステージ 1',
    enemySpeed: 3,
    spawnRate: 0.8,
    duration: 30,
    bgColor: [0, 0, 50]
  },
  {
    name: 'ステージ 2',
    enemySpeed: 5,
    spawnRate: 0.5,
    duration: 45,
    bgColor: [50, 0, 0]
  },
  {
    name: 'ステージ 3',
    enemySpeed: 7,
    spawnRate: 0.3,
    duration: 60,
    bgColor: [50, 50, 0]
  }
];

let currentStage = 0;
```

### ステップ 2：ステージを切り替える

```javascript
function nextStage() {
  currentStage++;
  
  if (currentStage >= STAGES.length) {
    // ゲームクリア
    gameState = 'clear';
    return;
  }
  
  // 次のステージを開始
  const stage = STAGES[currentStage];
  enemySpeed = stage.enemySpeed;
  gameTime = stage.duration;
}
```

### ステップ 3：ステージ情報を画面に表示

```javascript
function draw() {
  background(STAGES[currentStage].bgColor);
  
  // ステージ名を表示
  fill(255);
  textSize(20);
  text('現在：' + STAGES[currentStage].name, 20, 30);
  
  // 残り時間を表示
  text('残り時間：' + floor(gameTime) + '秒', 20, 60);
}
```

## 生徒の工夫例

### 例 1：ステージごとに敵の種類を変える
```javascript
const stage = STAGES[currentStage];

// ステージ 1：単純な敵だけ
// ステージ 2：速い敵が増える
// ステージ 3：全ての種類の敵が登場
```

### 例 2：ステージボーナスを追加
```javascript
if (gameTime <= 0) {
  // クリア条件を満たした
  if (gameTime > -5) {
    // 時間に余裕があればボーナス
    score += 1000;
  }
  nextStage();
}
```

### 例 3：ステージのテーマを作る
```javascript
const STAGES = [
  { name: '森のステージ', bgColor: [0, 100, 0], enemyColor: [0, 200, 0] },
  { name: '火山のステージ', bgColor: [100, 0, 0], enemyColor: [255, 100, 0] },
  { name: '宇宙のステージ', bgColor: [0, 0, 100], enemyColor: [200, 200, 255] }
];
```

---

# F - 隠しコマンド

## 説明

特定のキー操作をすると、隠しステージが出現するなどの特別なイベントが発生します。

## 実装の流れ

### ステップ 1：キー履歴を記録

```javascript
let keyHistory = [];
const SECRET_COMMAND = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
                        'b', 'a'];

function keyPressed() {
  keyHistory.push(keyCode);
  
  if (keyHistory.length > SECRET_COMMAND.length) {
    keyHistory.shift();
  }
}
```

### ステップ 2：コマンドを検出

```javascript
function checkSecretCommand() {
  if (keyHistory.length === SECRET_COMMAND.length) {
    let match = true;
    for (let i = 0; i < SECRET_COMMAND.length; i++) {
      if (keyHistory[i] !== SECRET_COMMAND[i]) {
        match = false;
        break;
      }
    }
    
    if (match) {
      activateSecret();
    }
  }
}

function activateSecret() {
  // 隠しステージを有効化
  STAGES.push({
    name: '秘密のステージ',
    enemySpeed: 10,
    duration: 120
  });
  
  notice = '✦ シークレットステージが解禁されました！';
}
```

## 生徒の工夫例

### 例 1：複数の隠しコマンド
```javascript
const COMMANDS = {
  secret1: ['a', 'a', 'a'],
  secret2: ['b', 'b', 'b'],
  secret3: ['z', 'x', 'c']
};
```

### 例 2：隠しコマンドでゲームモード変更
```javascript
function activateSecret() {
  godMode = true;  // 無敵モード
  infiniteLives = true;  // 無限ライフ
}
```

### 例 3：簡単な隠しコマンド
```javascript
// 複雑なコマンドではなく、シンプルなもの
// 例：スペースキーを 10 回連続押すと発動
```

---

# G - BGM のカスタマイズ

## 説明

ゲーム中に鳴る BGM（BGM）を自分好みに変更します。

## 実装の流れ

### ステップ 1：BGM シーケンスを定義

```javascript
// 基礎版（基本的なBGM）
const BGM_BASIC = [220, 330, 440, 330, 261.63, 392, 523, 392];

// 応用版：複数のパターン
const BGM_PATTERNS = {
  happy: [262, 330, 392, 262, 294, 330, 349, 330],
  dark: [110, 165, 220, 165, 130, 195, 220, 195],
  fast: [330, 440, 330, 440, 330, 440, 330, 440],
  slow: [110, 110, 110, 220, 220, 220, 110, 110]
};

let currentBGM = BGM_BASIC;
```

### ステップ 2：BGM 再生ロジック

```javascript
let bgmTimer = 0;

function updateBGM(dt) {
  bgmTimer -= dt;
  if (bgmTimer <= 0) {
    bgmTimer = 0.22;  // 1/4.5 秒ごとに音を再生
    
    const freq = currentBGM[floor(elapsed / 0.22) % currentBGM.length];
    playSound(freq, 0.11);
  }
}
```

### ステップ 3：BGM パターンを切り替える

```javascript
function keyPressed() {
  if (key === '1') {
    currentBGM = BGM_PATTERNS.happy;
    notice = 'BGM: Happy に変更';
  } else if (key === '2') {
    currentBGM = BGM_PATTERNS.dark;
    notice = 'BGM: Dark に変更';
  }
}
```

## 生徒の工夫例

### 例 1：オリジナル BGM を作成
```javascript
const MY_BGM = [262, 294, 330, 349, 392, 440, 494, 523];  // ドレミファソラシド
```

### 例 2：ステージごとに異なる BGM
```javascript
if (currentStage === 0) {
  currentBGM = BGM_PATTERNS.happy;
} else if (currentStage === 1) {
  currentBGM = BGM_PATTERNS.dark;
}
```

### 例 3：BGM の速度を変える
```javascript
// BGM を速くする
const bgmInterval = isRapidMode ? 0.11 : 0.22;
```

---

# H - ビジュアルカスタマイズ

## 説明

プレイヤーや敵の色・形・サイズを変更して、ゲーム画面の見た目を大きく変えます。

## 実装の流れ

### ステップ 1：プレイヤーの色を変更

```javascript
// 基本設定
let playerColor = [102, 250, 255];  // シアン

function drawPlayer() {
  push();
  translate(playerX, playerY);
  
  fill(playerColor);  // プレイヤーの色
  circle(0, 0, playerSize);
  
  pop();
}

// キー入力で色変更
function keyPressed() {
  if (key === '1') playerColor = [255, 100, 100];  // 赤
  if (key === '2') playerColor = [100, 255, 100];  // 緑
  if (key === '3') playerColor = [100, 100, 255];  // 青
}
```

### ステップ 2：敵の形を変更

```javascript
function drawEnemy(e) {
  push();
  translate(e.x, e.y);
  
  fill(enemyColor);
  
  // 基本：円
  if (e.type === 'circle') {
    circle(0, 0, enemySize);
  }
  // 四角
  else if (e.type === 'square') {
    rect(-enemySize / 2, -enemySize / 2, enemySize, enemySize);
  }
  // 三角
  else if (e.type === 'triangle') {
    triangle(0, -enemySize / 2, -enemySize / 2, enemySize / 2, enemySize / 2, enemySize / 2);
  }
  
  pop();
}
```

### ステップ 3：背景色を変更

```javascript
let bgColor = [7, 12, 33];  // 基本：濃紺

function draw() {
  background(bgColor);
  // ...
}

// ステージごとに背景色を変更
if (currentStage === 0) {
  bgColor = [7, 12, 33];      // 濃紺
} else if (currentStage === 1) {
  bgColor = [50, 20, 20];     // 暗い赤
} else if (currentStage === 2) {
  bgColor = [20, 20, 50];     // 暗い青
}
```

## 生徒の工夫例

### 例 1：キャラクターをカスタマイズ
```javascript
// プレイヤーを三角形に
triangle(playerX, playerY - 20, playerX - 15, playerY + 15, playerX + 15, playerY + 15);

// 敵を星形に
// または、敵を多角形に
```

### 例 2：グラデーション背景
```javascript
// 上が青、下が黒のグラデーション背景を作成
```

### 例 3：敵の大きさを動的に変える
```javascript
// 時間経過で敵が大きくなったり小さくなったりする
let enemySize = 35 + sin(elapsed * 2) * 10;
```

---

# I - 効果音の追加

## 説明

敵撃破時や得点時に異なる効果音を追加して、ゲームをより楽しくします。

## 実装の流れ

### ステップ 1：効果音の種類を定義

```javascript
const SOUNDS = {
  hit: { freq: 400, duration: 0.1 },
  destroy: { freq: 800, duration: 0.2 },
  powerup: { freq: 1200, duration: 0.3 },
  levelup: { freq: [523, 659, 784], duration: 0.5 }
};
```

### ステップ 2：敵撃破時に効果音

```javascript
function destroyEnemy(e) {
  score += 10;
  
  // 敵撃破音
  playSound(SOUNDS.destroy.freq, SOUNDS.destroy.duration);
}
```

### ステップ 3：パワーアップ時に効果音

```javascript
function collectPowerup(p) {
  if (p.type === 'heart') {
    playSound(SOUNDS.powerup.freq, SOUNDS.powerup.duration);
  }
}
```

## 生徒の工夫例

### 例 1：敵の種類ごとに異なる音
```javascript
if (e.type === 'fast') {
  playSound(800, 0.1);  // 高い音
} else if (e.type === 'slow') {
  playSound(400, 0.1);  // 低い音
}
```

### 例 2：スコアに応じた音
```javascript
// 得点が高いほど、高い周波数の音が鳴る
const freq = 300 + (score / 100) * 100;
playSound(freq, 0.1);
```

### 例 3：複数音の組み合わせ
```javascript
// 複数の音を連続して再生
playSound(523, 0.1);  // ド
setTimeout(() => playSound(659, 0.1), 100);  // ミ
setTimeout(() => playSound(784, 0.1), 200);  // ソ
```

---

# J - パーティクル効果

## 説明

敵撃破時や得点時に、小さな粒が飛び散るエフェクトを追加します。

## 実装の流れ

### ステップ 1：パーティクルシステムを作成

```javascript
let particles = [];

function burst(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = random(TWO_PI);
    const speed = random(50, 200);
    
    particles.push({
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      color: color,
      life: 0.8
    });
  }
}
```

### ステップ 2：敵撃破時にパーティクル発生

```javascript
function destroyEnemy(e) {
  score += 10;
  
  // パーティクルを発生
  burst(e.x, e.y, [255, 100, 100], 16);
}
```

### ステップ 3：パーティクルを描画・更新

```javascript
function draw() {
  // パーティクルの更新と描画
  for (let p of particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    
    if (p.life > 0) {
      push();
      fill(p.color[0], p.color[1], p.color[2], p.life * 255);
      circle(p.x, p.y, 3);
      pop();
    }
  }
  
  // ライフが尽きたパーティクルを削除
  particles = particles.filter(p => p.life > 0);
}
```

## 生徒の工夫例

### 例 1：パーティクルの色を変える
```javascript
// 敵の種類ごとに異なる色
if (e.type === 'fast') {
  burst(e.x, e.y, [255, 100, 100], 16);  // 赤
} else if (e.type === 'slow') {
  burst(e.x, e.y, [100, 100, 255], 16);  // 青
}
```

### 例 2：爆発エフェクトを大きくする
```javascript
burst(e.x, e.y, [255, 200, 0], 32);  // より多くの粒
```

### 例 3：パーティクルの移動方向を変える
```javascript
// 放射状ではなく、上方向に飛び散る
particles.push({
  x: x,
  y: y,
  vx: random(-100, 100),
  vy: random(-200, -50),  // 上方向
  color: color,
  life: 0.8
});
```

---

# K - コンボシステム

## 説明

連続で敵を倒すと、得点が増える仕組みです。

---

# L - 難易度調整

## 説明

敵の速度、生成頻度、ゲーム時間などを調整して、ゲームの難易度を変更します。

---

# M - スコアシステムの工夫

## 説明

得点の計算ルールを変更して、ゲームの遊び方を大きく変えます。

---

# N - ボーナスステージ

## 説明

特定の条件を満たすと、ボーナスステージが出現します。

---

## 最後に

**あなたのオプション改造が、ゲーム全体の印象を大きく変えます。**

同じオプション を選んだ友達とも全く違うゲームになるように、思いっきり工夫しましょう！

質問や困ったことがあれば、先生に聞いてくださいね。
