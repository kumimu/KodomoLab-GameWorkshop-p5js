# LESSON_6：基礎版から応用版へ - プログラム的な工夫

## 概要
「避けゲー」から「NEON DODGE」へ。**同じ p5.js のまま**で、プログラム的な工夫により、ゲームがどう成長するか学びます。

### このレッスンのポイント
- 敵の種類を増やす工夫（if 文と type プロパティ）
- シューティング機能の実装（配列管理）
- パワーアップシステムの設計
- ステージシステムで難易度を効率的に管理
- スコアシステムの多様性
- ボスバトルの実装

---

## 第1部：2つのゲームの比較

### 基礎版「避けゲー」と応用版「NEON DODGE」

| 項目 | 基礎版 | 応用版 |
|------|--------|--------|
| **ライブラリ** | p5.js | **p5.js（同じ）** |
| **画面サイズ** | 600 × 400 px | 900 × 600 px |
| **敵の種類** | 1種類 | 3種類（通常・ジグザグ・タンク） |
| **プレイヤー機能** | 移動のみ | 移動 + 射撃 |
| **ステージ** | 1ステージ（難易度3段階） | 4ステージ（秘密ステージ含む） |
| **難易度** | 敵速度・個数・時間 | ステージごとに自動調整 |
| **パワーアップ** | なし | 4種類（ハート・スター・シールド・ラピッド） |
| **ボス** | なし | あり（ステージの最後） |
| **音声** | なし | あり（Web Audio API） |
| **隠し要素** | なし | コナミコマンドで秘密ステージ解禁 |
| **コード行数** | 約200行 | 約1000行 |

---

## 第2部：敵の多様性化

### 基礎版：敵は1種類

```javascript
// 敵は常に「落ちてくるだけ」
enemies.push({
  x: random(enemySize, width - enemySize),
  y: random(-300, -50),
  speed: enemySpeed + random(0, 2)
});
```

### 応用版：敵を「タイプ」で分類

```javascript
// 敵のタイプを決める（確率で分岐）
const rand_type = random();
let type = 'normal';

if (rand_type < 0.17) {
  type = 'zig';      // 17%：ジグザグ移動
} else if (rand_type < 0.29) {
  type = 'tank';     // 12%：耐久型
}
// 残り 71%：通常敵

// オブジェクトに「type」プロパティを持たせる
enemies.push({
  x: random(enemyR, width - enemyR),
  y: -35,
  r: enemyR,
  hp: type === 'tank' ? 3 : 1,        // タンクは体力3
  maxhp: type === 'tank' ? 3 : 1,
  speed: enemySpeed,
  type: type,                          // ★ ここが重要
  phase: random(TWO_PI),
  value: type === 'tank' ? 30 : 10    // 得点もタイプで変更
});
```

### 敵ごとに異なる動きを実装

```javascript
// 敵の移動（draw 関数内）
for (let e of enemies) {
  e.y += e.speed * dt;
  
  // type に応じて異なる動きをさせる
  if (e.type === 'zig') {
    e.x += sin(elapsed * 5 + e.phase) * 110 * dt;  // 左右に揺れる
  }
  // タンクは真下に落ちるだけ（何もしない）
}
```

### 敵の描画でも type を参照

```javascript
for (let e of enemies) {
  // タンクは6角形、他は4角形
  let sides = e.type === 'tank' ? 6 : 4;
  
  // タンクはオレンジ、他はピンク
  let color = e.type === 'tank' ? [255, 160, 93] : [255, 102, 142];
  
  fill(color);
  drawPolygon(e.x, e.y, e.r, sides);
}
```

**学ぶポイント**
- オブジェクトのプロパティで「敵の種類」を記録
- if 文で敵の種類に応じた処理を分岐
- 同じ配列で複数タイプを効率的に管理

---

## 第3部：シューティング機能

### 基礎版：避けるだけ
```javascript
// 基礎版にはシューティング機能なし
```

### 応用版：プレイヤーも射撃可能

```javascript
// グローバル変数
let bullets = [];      // 弾の配列
let shotTimer = 0;     // 連射制御用

// 射撃関数
function shoot() {
  const rapid = player.fire > 0;  // 連続射撃中？
  const interval = rapid ? 0.085 : 0.18;  // 連続射撃ならより早く
  
  if (shotTimer > 0) return;  // クールタイム中なら発射できない
  shotTimer = interval;
  
  // 通常射撃：1発
  bullets.push({
    x: player.x,
    y: player.y - 24,
    vy: -690,  // 上に高速移動
    r: 5
  });
  
  // 連続射撃中なら左右にも発射
  if (rapid) {
    bullets.push(
      { x: player.x - 10, y: player.y - 18, vy: -640, vx: -90, r: 4 },
      { x: player.x + 10, y: player.y - 18, vy: -640, vx: 90, r: 4 }
    );
  }
  
  playSound(rapid ? 600 : 480, 0.05);
}

// update 関数内で発射判定
if (keyIsDown(32)) shoot();  // スペースキーで連続射撃

// 弾の移動（draw 関数内）
for (let b of bullets) {
  b.y += b.vy * dt;
  if (b.vx) b.x += b.vx * dt;
}

// 敵との当たり判定
for (let b of bullets) {
  for (let e of enemies) {
    if (dist(b.x, b.y, e.x, e.y) < b.r + e.r) {
      e.hp--;      // 敵に被弾
      b.y = -100;  // 弾を削除
      
      if (e.hp <= 0) {
        destroyEnemy(e);  // 敵撃破
      }
    }
  }
}
```

**学ぶポイント**
- 弾も敵と同じく「配列で管理」
- 当たり判定は敵と同じく dist 関数で実装
- 連射速度の違いで「通常射撃」と「連続射撃」を表現

---

## 第4部：パワーアップシステム

### 基礎版：パワーアップなし

### 応用版：複数種類のパワーアップ

```javascript
const CONFIG = {
  // ... 他の設定
  playerSpeed: 380,
  playerSize: 19,
};

// プレイヤーにパワーアップ用のプロパティを追加
let player = {
  x: width / 2,
  y: height - 76,
  r: 19,
  lives: 3,
  inv: 1,
  star: 0,      // ★ スター（無敵）の残り秒数
  shield: 0,    // ◆ シールド（次の被弾を無効化）の残り秒数
  fire: 0       // ⚡ 連続射撃の残り秒数
};

// パワーアップアイテムの生成
function dropPickup(x, y) {
  const r = random();
  
  if (r < 0.085) {
    pickups.push({ x, y, type: 'heart', r: 13, t: 0 });
  } else if (r < 0.17) {
    pickups.push({ x, y, type: 'star', r: 13, t: 0 });
  } else if (r < 0.255) {
    pickups.push({ x, y, type: 'shield', r: 13, t: 0 });
  } else if (r < 0.34) {
    pickups.push({ x, y, type: 'rapid', r: 13, t: 0 });
  }
}

// プレイヤーとアイテムの当たり判定
for (let p of pickups) {
  if (dist(p.x, p.y, player.x, player.y) < p.r + player.r) {
    if (p.type === 'heart') {
      player.lives = min(5, player.lives + 1);
    } else if (p.type === 'star') {
      player.star = 7;  // 7秒間無敵
    } else if (p.type === 'shield') {
      player.shield = 15;  // シールド有効化
    } else if (p.type === 'rapid') {
      player.fire = 12;  // 12秒間連続射撃
    }
  }
}

// 時間経過でパワーアップ効果を減らす
player.star = max(0, player.star - dt);
player.shield = max(0, player.shield - dt);
player.fire = max(0, player.fire - dt);
```

**学ぶポイント**
- パワーアップを「時間制御」で表現
- プレイヤーのプロパティで複数の効果を同時管理
- 敵撃破時のドロップは確率で決定

---

## 第5部：ステージシステム

### 基礎版：難易度選択で値を変更

```javascript
function startGame(level) {
  if (level === 1) {
    enemySpeed = 4;
    enemyCount = 1;
    clearTime = 30;
  } else if (level === 2) {
    enemySpeed = 6;
    enemyCount = 2;
    clearTime = 45;
  } else {
    enemySpeed = 8;
    enemyCount = 3;
    clearTime = 60;
  }
}
```

### 応用版：ステージオブジェクトで設定を一括管理

```javascript
const STAGES = [
  {
    name: 'NEON CITY',
    accent: [78, 245, 255],           // ステージの色
    bg: [7, 16, 41],
    enemySpeed: 1,
    spawn: 0.88,        // 敵の生成頻度（小さいほど頻繁）
    goal: 45            // クリア条件（秒数）
  },
  {
    name: 'LAVA CORE',
    accent: [255, 173, 91],
    bg: [38, 11, 33],
    enemySpeed: 1.28,   // より速い敵
    spawn: 0.66,        // より多くの敵
    goal: 55
  },
  {
    name: 'VOID GALAXY',
    accent: [220, 163, 255],
    bg: [16, 9, 40],
    enemySpeed: 1.52,
    spawn: 0.52,
    goal: 65
  },
  {
    name: 'SECRET MATRIX',
    accent: [131, 255, 146],
    bg: [7, 27, 20],
    enemySpeed: 1.8,
    spawn: 0.44,
    goal: 75,
    secret: true        // 隠しステージフラグ
  }
];

// ステージ情報にアクセス
const stage = STAGES[stageIndex];

// ステージに応じた背景色
background(stage.bg);

// ステージに応じた敵の速度
const enemySpeed = random(105, 170) * stage.enemySpeed;

// ステージに応じた敵の生成頻度
spawnTimer = random(0.65, 1.2) * stage.spawn;

// ゲーム時間がステージの目標に達したらボス出現
if (elapsed >= stage.goal) {
  spawnBoss();
}
```

**学ぶポイント**
- 「オブジェクトの配列」で複数のステージを効率的に管理
- ステージごとに異なる難易度を数値で制御
- 新しいステージ追加が簡単

---

## 第6部：スコアシステム

### 基礎版：生存時間 = スコア

```javascript
score = (millis() - startTime) / 1000;
```

**単純：時間を消費しただけ**

### 応用版：複数の稼ぎ方

```javascript
let kills = 0;      // 撃破した敵の数
let combo = 0;      // 現在のコンボ数
let comboTimer = 0; // コンボの時間制限

// 敵を撃破したとき
function destroyEnemy(e) {
  // スコア計算：敵の価値 × 難易度 × コンボ倍率
  score += e.value * (1 + floor(combo / 5));
  
  kills++;
  combo++;
  comboTimer = 3;  // 3秒以内に次の敵を倒さないとコンボリセット
  
  // 12敵撃破ごとにスターモード
  if (kills > 0 && kills % 12 === 0) {
    player.star = 4;  // スター時間中、得点が 2倍
    notice = '★ STAR MODE!';
  }
}

// 毎フレーム
comboTimer -= dt;
if (comboTimer <= 0) combo = 0;  // コンボ時間切れでリセット
```

**スコアシステムの多様性**
- **敵の種類ごとに価値が違う**（タンクは得点高い）
- **コンボで倍率が上がる**（連続撃破で得点増加）
- **スター中は全得点 2倍**（戦略的にスター獲得を狙う）

---

## 第7部：ボスバトル

### 基礎版：ボスなし

### 応用版：ステージの最後に登場

```javascript
// ボスデータ
let boss = {
  x: width / 2,
  y: -90,
  r: 68,
  hp: 38 + stageIndex * 15,  // ステージが進むほど強い
  maxhp: 38 + stageIndex * 15,
  t: 0,                       // 経過時間
  shot: 1.1                   // 射撃クールタイム
};

// ボスの射撃パターン（複数方向から発射）
if (boss.shot <= 0) {
  boss.shot = 0.75;
  
  for (let i = -2; i <= 2; i++) {
    let angle = PI / 2 + i * 0.22 + sin(boss.t) * 0.1;
    
    enemyBullets.push({
      x: boss.x,
      y: boss.y + 35,
      vx: cos(angle) * 240,
      vy: sin(angle) * 240,
      r: 8
    });
  }
}

// ボスの移動（画面内に出てきて、左右に揺れる）
boss.y += (min(110, boss.y + 90) - boss.y) * dt * 2;
boss.x = width / 2 + sin(boss.t * 1.3) * 280;

// ボスへのダメージ判定
if (boss && dist(b.x, b.y, boss.x, boss.y) < b.r + boss.r) {
  boss.hp--;
  
  if (boss.hp <= 0) {
    score += 500;
    boss = null;
    endGame(true);  // ゲームクリア
  }
}
```

**ボス実装のポイント**
- ボスも敵と同じく「当たり判定」で管理
- 敵弾の配列に敵の弾も追加して統一管理
- ステージ進行に応じて強さ（HP）を変動

---

## 第8部：隠しコマンド（コナミコマンド）

### キー入力を記録して検出

```javascript
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                        'b', 'a'];
let keyHistory = [];

function keyPressed() {
  // キーコードを記録
  let currentKey = '';
  if (keyCode === 38) currentKey = 'ArrowUp';
  else if (keyCode === 40) currentKey = 'ArrowDown';
  else if (keyCode === 37) currentKey = 'ArrowLeft';
  else if (keyCode === 39) currentKey = 'ArrowRight';
  else currentKey = key.toLowerCase();
  
  keyHistory.push(currentKey);
  if (keyHistory.length > 10) keyHistory.shift();
  
  // コナミコマンドが入力されたか確認
  if (keyHistory.join('|') === konamiSequence.join('|')) {
    secretUnlocked = true;
    stageIndex = 3;  // 秘密ステージに移動
    notice = '✦ SECRET UNLOCKED! ✦';
  }
}
```

---

## 第9部：講師向けポイント

### 基礎版を学んだ生徒に「応用版の工夫」を説明する順序

1. **「敵のタイプ分け」を説明**
   - 「敵のオブジェクトに『type』という情報を持たせることで、1つの配列で複数の敵を管理できる」
   - if 文で敵のタイプによって動きを変える工夫

2. **「配列の応用」として弾を説明**
   - 「敵の配列と同じように、弾も配列で管理する」
   - 当たり判定も dist 関数で実装

3. **「時間制御でパワーアップを実装」**
   - 「プレイヤーのプロパティに『残り秒数』を持たせる」
   - dt で毎フレーム減らしていく工夫

4. **「ステージシステム」で効率性を説明**
   - 「STAGES という配列のオブジェクトで、各ステージの情報を一括管理」
   - 新しいステージ追加が簡単になる

5. **「スコアシステムの複雑さ」**
   - 「単に時間を数えるだけでなく、敵の種類・コンボ・パワーアップで得点が変わる」

### よくある質問への回答例

**Q: 「なぜ敵に hp というプロパティが必要？」**
- A: 「基礎版は敵が1回で消えるだけだが、応用版のタンクは3回被弾に耐えます。hp を持たせることで、同じ敵配列で複数タイプを管理できます」

**Q: 「ボスはどう実装するのか」**
- A: 「ボスも敵と同じく『オブジェクト』です。でも敵配列には入れず『boss 変数』に入れるだけ。当たり判定と射撃パターンを追加する工夫です」

**Q: 「パワーアップが同時に複数あったら」**
- A: 「player.star、player.shield、player.fire と別々のプロパティを持つことで、同時に効果を持たせられます」

**Q: 「ステージを5個に増やしたら」**
- A: 「STAGES 配列に5個目のオブジェクトを追加するだけ。他のコードは変わりません」

---

## 第10部：コード設計の工夫

### 基礎版の設計パターン
```javascript
// グローバル変数で各機能を分散
let gameState = ...
let playerX = ...
let playerY = ...
let enemies = []
let difficultyName = ...
```

### 応用版の設計パターン
```javascript
// オブジェクトで関連情報をまとめる
let player = { x, y, r, lives, inv, star, shield, fire }
let enemies = [{ x, y, r, hp, type, ... }]
let boss = { x, y, r, hp, ... }

// 設定を配列で一括管理
const CONFIG = { ... }
const STAGES = [ { ... } ]
```

**学ぶポイント**
- 関連する情報をオブジェクトでまとめると、コードが整理しやすくなる
- 配列のオブジェクトを活用すると、複数の要素を効率的に管理できる
- 設定を固定値から「オブジェクト・配列」に変更すると、スケーラビリティが上がる

---

## 第11部：成長段階の理解

```
基礎版（200行）
↓
敵の種類化 + 200行 → 400行
↓
シューティング機能 + 150行 → 550行
↓
パワーアップシステム + 100行 → 650行
↓
ステージシステム + 150行 → 800行
↓
ボスバトル + 150行 → 950行
↓
隠しコマンド + 50行 → 1000行

応用版（1000行）
```

**プログラムの成長は「段階的」である**
- 各機能は独立して実装可能
- 基本的な概念（配列、オブジェクト、当たり判定）は共通
- ゲームロジックの複雑さは増すが、p5.js というツール自体は変わらない

---

## まとめ

| 学習段階 | 習得内容 | 次のステップ |
|---------|---------|-----------|
| **レッスン1〜5** | p5.js の基本とゲーム構造 | 「基本のマスター」 |
| **レッスン6** | プログラム的な工夫で機能を拡張 | 「応用への扉」 |
| **レッスン7〜8** | 実装テクニックと講師リハーサル | 「授業実施への準備」 |

### このレッスンで理解すべきこと

1. **「ライブラリを変える必要はない」** - 同じ p5.js で複雑なゲームは作れる
2. **「データ構造の工夫が大事」** - オブジェクトと配列で効率的に管理
3. **「段階的な成長が基本」** - 基礎から応用への道のりは連続している
4. **「生徒に見せる意図」** - NEON DODGE は「生徒が到達できる目標地点」

---

## 次のレッスンへ

**レッスン7** では、NEON DODGE の具体的な実装テクニック
- 射撃システムの詳細な実装方法
- ボスバトルの戦闘パターン設計
- パワーアップの効果バランス
- コナミコマンドの詳細実装
- スコアシステムと難易度管理の工夫

を詳しく学び、生徒が段階的に実装できる道筋を示します。
