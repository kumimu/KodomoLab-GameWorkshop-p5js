# レッスン4：敵と当たり判定

## 🎯 学習目標

敵がどのように生成・移動し、プレイヤーとの衝突がどのように判定されるのかを理解する。

- 敵の配列管理
- 敵の生成（スポーン）と再利用
- 敵の落下（移動）の仕組み
- 当たり判定の計算方法（`dist()` 関数）
- ゲームオーバーの流れ

---

## 👾 敵とは何か

ゲームでは、敵は **配列** で管理されています。

```javascript
let enemies = [];  // 敵の配列（最初は空）
```

**配列とは** — 複数の値をまとめて保存する「箱」です。

敵が1個、2個、3個と増えても、`enemies` という1つの変数で管理できます。

---

## 🎲 敵の生成と初期化

### ゲーム開始時に敵を作る

**`sketch.js` の80〜99行目（`startGame()` 関数）：**

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
  enemies = [];  // ← 敵の配列をリセット

  for (let i = 0; i < enemyCount; i++) {
    enemies.push({
      x: random(enemySize, width - enemySize),
      y: random(-300, -50),
      speed: enemySpeed + random(0, 2)
    });
  }

  gameState = "play";
}
```

### 難易度による敵の数の違い

| 難易度 | `enemyCount` | 敵の数 |
|--------|-------------|--------|
| かんたん | 1 | 1個 |
| ふつう | 2 | 2個 |
| むずかしい | 3 | 3個 |

### 敵の初期データ

各敵は、以下のデータを持ちます：

```javascript
{
  x: random(enemySize, width - enemySize),  // 敵のX座標（ランダム）
  y: random(-300, -50),                     // 敵のY座標（画面上の外から出現）
  speed: enemySpeed + random(0, 2)          // 敵の速度（基本速度 + ランダム値）
}
```

### `random()` 関数とは

**`random(a, b)`** は、`a` から `b` の間のランダムな数を返します。

**例：**

```javascript
x: random(enemySize, width - enemySize)
```

`enemySize = 35` の場合：

```javascript
x: random(35, 565)  // 35〜565の間でランダムに選ばれる
```

敵がランダムな位置から落ちてくるため、毎回異なるゲームになります。

### 敵のY座標がマイナス？

```javascript
y: random(-300, -50)
```

**なぜマイナスなのか？**

敵は画面の上の外から出現します。

```
Y = -300  ← 敵の初期位置（画面の外）
Y = -200
Y = -100
Y = -50
Y = 0     ← 画面の上端
Y = 100
Y = 200
...
Y = 400   ← 画面の下端
```

敵は毎フレーム下へ移動するので、やがて画面に見えるようになります。

---

## 🔄 敵の移動（落下）

### `moveEnemy()` 関数

**`sketch.js` の141〜152行目：**

```javascript
function moveEnemy(enemy) {
  enemy.y += enemy.speed;

  if (enemy.y > height + enemySize) {
    enemy.y = random(-300, -50);
    enemy.x = random(enemySize, width - enemySize);
    enemy.speed = enemySpeed + random(0, 2);
    score += 1;
  }
}
```

### 敵が下へ移動

```javascript
enemy.y += enemy.speed;
```

このコードは、毎フレーム敵のY座標を増やします。

**敵のY座標が増える = 画面の下へ移動する**

**例：** `enemy.speed = 6` の場合

```
フレーム1：enemy.y = -50 + 6 = -44
フレーム2：enemy.y = -44 + 6 = -38
フレーム3：enemy.y = -38 + 6 = -32
...
フレーム100：enemy.y = 550
```

敵が画面に見えるようになり、下へ落ちていきます。

### 敵が画面の下を通り過ぎた場合

```javascript
if (enemy.y > height + enemySize) {
  enemy.y = random(-300, -50);
  enemy.x = random(enemySize, width - enemySize);
  enemy.speed = enemySpeed + random(0, 2);
  score += 1;  // ← スコア加算
}
```

敵が画面の下を完全に通り過ぎると（`enemy.y > 400 + 35 = 435`）、敵が画面の上の外に戻ります。

**つまり、敵は無限に再利用される** — 新しい敵を作るのではなく、既存の敵をリサイクルします。

**スコア加算：** 敵が画面を通り過ぎるたびに、`score += 1` でスコアが1増えます。

### 敵の速度のランダム化

```javascript
enemy.speed = enemySpeed + random(0, 2);
```

敵の速度を毎回ランダムに変えることで、ゲームのバリエーションが増えます。

**例：** `enemySpeed = 6` の難易度で：

```
1回目：speed = 6 + 0.5 = 6.5
2回目：speed = 6 + 1.8 = 7.8
3回目：speed = 6 + 0.1 = 6.1
```

全ての敵が同じ速度ではなく、少しずつ異なります。

---

## 📏 当たり判定の計算

### `isHit()` 関数

**`sketch.js` の154〜157行目：**

```javascript
function isHit(enemy) {
  const distance = dist(playerX, playerY, enemy.x, enemy.y);
  return distance < playerSize / 2 + enemySize / 2;
}
```

### `dist()` 関数とは

**`dist(x1, y1, x2, y2)`** は、2点間の距離を計算する関数です。

**数学の公式：**

```
距離 = √((x2 - x1)² + (y2 - y1)²)
```

ピタゴラスの定理を使った計算です。

### ピタゴラスの定理とは？

**簡単に言うと：「直角三角形の3辺の関係を表す公式」**

ゲーム画面で、2つのオブジェクト（プレイヤーと敵）の距離を計算するときに使います。

**図解：**

```
敵 (enemy.x, enemy.y)
  ●
  │\
  │ \  ← これが「距離」
  │  \
  │   \
  ●─────●
敵の高さ  プレイヤー (playerX, playerY)
の差

直角三角形ができます。
- 横の差 = playerX - enemy.x
- 縦の差 = playerY - enemy.y
- 斜辺（距離）= √(横の差² + 縦の差²)
```

**具体例：**

プレイヤーが (300, 345) にいて、敵が (200, 400) にいる場合：

```
横の差 = 300 - 200 = 100
縦の差 = 345 - 400 = -55

距離 = √(100² + (-55)²)
     = √(10000 + 3025)
     = √13025
     ≈ 36.1
```

**重要：** `dist()` 関数が自動的にこの計算をしてくれるので、私たちは複雑な数学を考える必要はありません。

結果の距離が 37.5 より小さいなら、衝突しています。

### プレイヤーと敵の衝突判定

```javascript
const distance = dist(playerX, playerY, enemy.x, enemy.y);
return distance < playerSize / 2 + enemySize / 2;
```

**条件を読む：**

- **`distance`** — プレイヤーの中心から敵の中心までの距離
- **`playerSize / 2 + enemySize / 2`** — プレイヤーと敵が接触する距離

**例：** `playerSize = 40`、`enemySize = 35` の場合

```
playerSize / 2 + enemySize / 2 = 20 + 17.5 = 37.5
```

プレイヤーの中心から敵の中心までの距離が **37.5より小さい** = 衝突している

### 図解

```
プレイヤー（半径20）    敵（半径17.5）
      ●───────────●
      ←── 距離 ──→
      
距離 < 37.5 ならば、衝突している
距離 ≥ 37.5 ならば、まだ接触していない
```

---

## 🎮 ゲーム中の敵の処理フロー

**`sketch.js` の105〜129行目（`playGame()` 関数）：**

```javascript
function playGame() {
  const elapsed = floor((millis() - startTime) / 1000);
  const remaining = clearTime - elapsed;

  if (remaining <= 0) {
    resultText = "CLEAR!";
    gameState = "end";
    return;
  }

  drawGameInfo(remaining);
  movePlayer();
  drawPlayer();

  for (const enemy of enemies) {
    moveEnemy(enemy);           // ① 敵を移動
    drawEnemy(enemy);           // ② 敵を描く

    if (isHit(enemy)) {         // ③ 衝突判定
      resultText = "GAME OVER";
      gameState = "end";
      return;
    }
  }
}
```

### 毎フレーム、この順序で敵処理が起こります

1. **敵を移動** — `moveEnemy(enemy)` で敵のY座標を更新
2. **敵を描く** — `drawEnemy(enemy)` で新しい位置に敵を描く
3. **衝突判定** — `isHit(enemy)` でプレイヤーとの距離を計算
4. **敵ごとにループ** — 敵が複数個いるので、全ての敵について1〜3を繰り返す

**もし衝突が検出されたら：**

```javascript
resultText = "GAME OVER";
gameState = "end";
return;
```

ゲーム終了画面へ移ります。

---

## 📊 具体的な流れ（シミュレーション）

### 初期状態

```javascript
enemyCount = 2
enemies = [
  { x: 150, y: -100, speed: 6.5 },
  { x: 450, y: -200, speed: 5.8 }
]
```

### フレーム1

```javascript
// 敵1の処理
moveEnemy(敵1)：
  敵1.y = -100 + 6.5 = -93.5

drawEnemy(敵1)：敵1を(150, -93.5)に描く

isHit(敵1)：
  distance = dist(300, 345, 150, -93.5) = 約442（遠い）
  442 < 37.5？ → false（衝突なし）

// 敵2の処理
moveEnemy(敵2)：
  敵2.y = -200 + 5.8 = -194.2

drawEnemy(敵2)：敵2を(450, -194.2)に描く

isHit(敵2)：
  distance = 約330（遠い）
  330 < 37.5？ → false（衝突なし）
```

### フレーム200（敵が画面に見える）

```javascript
// 敵1の処理
敵1.y ≈ 200（画面内に見える）
敵2.y ≈ 100

// 衝突判定
敵1の中心 = (150, 200)
プレイヤーの中心 = (300, 345)
distance ≈ 200（まだ遠い）
200 < 37.5？ → false
```

### フレーム260（敵とプレイヤーが接近）

```javascript
敵1.y ≈ 380
プレイヤー位置 = (300, 345)
敵1位置 = (150, 380)

distance = dist(300, 345, 150, 380)
        = √((150-300)² + (380-345)²)
        = √((-150)² + (35)²)
        = √(22500 + 1225)
        = √23725
        ≈ 154

154 < 37.5？ → false（まだ接触していない）
```

### フレーム270（衝突）

```javascript
敵1.y ≈ 400
プレイヤー位置 = (300, 345)
敵1位置 = (200, 400)

distance = dist(300, 345, 200, 400)
        = √((200-300)² + (400-345)²)
        = √((-100)² + (55)²)
        = √(10000 + 3025)
        = √13025
        ≈ 36

36 < 37.5？ → true（衝突！）

resultText = "GAME OVER"
gameState = "end"
```

ゲーム終了。

---

## 📝 重要な用語のまとめ

| 用語 | 意味 | このゲームでの例 |
|------|------|-----------------|
| **配列** | 複数の値をまとめて保存する仕組み | `enemies = []` |
| **要素** | 配列の中の1つの値 | `enemies[0]` — 最初の敵 |
| **ループ** | 複数の値に同じ処理を繰り返す | `for (const enemy of enemies)` |
| **`random(a, b)`** | a〜bの間のランダムな値 | 敵の位置や速度 |
| **距離計算** | 2点間の距離を計算する | `dist()` 関数 |
| **当たり判定** | 2つのオブジェクトが衝突しているか判定する | プレイヤーと敵の距離 |
| **スコア** | ゲーム中の得点 | 敵が画面を通り過ぎるたびに+1 |

---

## ✅ 理解度確認クイズ

### クイズ1：敵の初期位置

難易度「ふつう」でゲームが始まるとき、敵は何個生成されますか？

**ヒント：** `startGame()` 関数の `enemyCount` を見てください。

**選択肢：**
- A. 1個
- B. 2個
- C. 3個

---

### クイズ2：敵のリサイクル

敵が画面の下を通り過ぎたとき、どうなりますか？

**選択肢：**
- A. 敵が削除される
- B. 敵がリセットされて、画面の上の外から再び落ちてくる
- C. 画面の下の外に留まったままになる

---

### クイズ3：当たり判定の計算

`playerSize = 40`、`enemySize = 35` のとき、衝突が発生する距離の閾値（しきいち）は何ですか？

**ヒント：** `playerSize / 2 + enemySize / 2` を計算してください。

**選択肢：**
- A. 20
- B. 35
- C. 37.5

---

### クイズ4：スコア加算のタイミング

スコアが+1される場合はいつですか？

**選択肢：**
- A. 敵を避けるたびに
- B. 敵が画面を通り過ぎるたびに
- C. 敵とプレイヤーが衝突したとき

---

## 🎓 中学生への説明例（講師向け）

> 敵はね、配列っていう「敵の箱」に保存されています。
>
> 難易度によって敵の数が変わります。かんたんなら1個、ふつうなら2個、むずかしいなら3個です。
>
> 敵は毎フレーム、画面の下へ落ちていきます。敵が画面を通り過ぎると、スコアが1増えます。
>
> でも、敵がプレイヤーに接触したら「GAME OVER」になります。
>
> 接触判定は、プレイヤーの中心から敵の中心までの距離を計算して、判定しています。
>
> ピタゴラスの定理を使った計算です。

---

## 🔗 次のレッスンへ

次は、**レッスン5『改造ミッションの指導』** です。

参加者が実際に行う改造ミッションを、難易度ごとに分析し、コーチが生徒をサポートする方法を学びます。

