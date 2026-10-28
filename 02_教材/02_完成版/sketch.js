// =====================================
// NEON DODGE - p5.js版 完成形
// 基礎版から段階的に成長させた応用ゲーム
// 射撃・敵の多様性・パワーアップ・ボスバトル・ステージシステム
// =====================================

// ===== ゲーム設定 =====
const CONFIG = {
  canvasW: 900,
  canvasH: 600,
  playerColor: [102, 250, 255],      // シアン
  playerSize: 19,
  playerSpeed: 380,
  enemyColor: [255, 102, 142],       // ピンク
  backgroundColor: [7, 12, 33],      // 濃紺
  shootInterval: 0.18,
  startingLives: 3
};

// ステージ設定
const STAGES = [
  {
    name: 'NEON CITY',
    accent: [78, 245, 255],           // シアン
    bg: [7, 16, 41],
    enemySpeed: 1,
    spawn: 0.88,
    goal: 45
  },
  {
    name: 'LAVA CORE',
    accent: [255, 173, 91],           // オレンジ
    bg: [38, 11, 33],
    enemySpeed: 1.28,
    spawn: 0.66,
    goal: 55
  },
  {
    name: 'VOID GALAXY',
    accent: [220, 163, 255],          // 紫
    bg: [16, 9, 40],
    enemySpeed: 1.52,
    spawn: 0.52,
    goal: 65
  },
  {
    name: 'SECRET MATRIX',
    accent: [131, 255, 146],          // 緑
    bg: [7, 27, 20],
    enemySpeed: 1.8,
    spawn: 0.44,
    goal: 75,
    secret: true
  }
];

// ===== グローバル変数 =====
let gameState = 'title';             // title / select / play / clear / over
let stageIndex = 0;
let difficulty = 1;                  // 0=EASY, 1=NORMAL, 2=HARD
let secretUnlocked = false;

let player;
let enemies = [];
let bullets = [];
let enemyBullets = [];
let pickups = [];
let particles = [];
let boss = null;

let elapsed = 0;
let spawnTimer = 0;
let shotTimer = 0;
let score = 0;
let kills = 0;
let combo = 0;
let comboTimer = 0;
let shake = 0;
let flash = 0;

let bgmEnabled = true;
let bgmTimer = 0;
let notice = '';
let noticeTime = 0;

let best = 0;                        // ハイスコア
let keyHistory = [];                 // コナミコマンド検出用

// ===== p5.js 初期化 =====
function setup() {
  let container = document.getElementById('p5-container');
  let sketch = (p) => {
    p.setup = function() {
      p.createCanvas(CONFIG.canvasW, CONFIG.canvasH);
      p.frameRate(60);
      p.textFont('system-ui, sans-serif');
      
      // ローカルストレージからハイスコアを読み込み
      try {
        best = Number(localStorage.getItem('neon-dodge-best') || 0);
      } catch (e) {}
    };

    p.draw = function() {
      background(CONFIG.backgroundColor);
      
      if (gameState === 'title') {
        drawTitle();
      } else if (gameState === 'select') {
        drawSelect();
      } else if (gameState === 'play') {
        updateGame(1 / p.frameRate());
        drawGame();
      } else if (gameState === 'clear' || gameState === 'over') {
        drawResult();
      }
    };

    p.keyPressed = function() {
      const key = p.key;
      const keyCode = p.keyCode;
      
      // ESCキー：タイトルに戻る
      if (keyCode === 27) {
        if (gameState !== 'title') {
          gameState = 'title';
          keyHistory = [];
          playSound(520, 0.12);
        }
        return false;
      }
      
      // Mキー：BGM切り替え
      if (key.toUpperCase() === 'M') {
        bgmEnabled = !bgmEnabled;
        notice = bgmEnabled ? 'BGM ON' : 'BGM OFF';
        noticeTime = 1;
        return false;
      }
      
      // ENTERキー：タイトルからゲーム選択へ
      if (keyCode === 13) {
        if (gameState === 'title') {
          gameState = 'select';
          playSound(660, 0.15);
        } else if (gameState === 'clear' || gameState === 'over') {
          resetGame();
        }
        return false;
      }
      
      // コナミコマンド検出
      const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
      let currentKey = '';
      
      if (keyCode === 38) currentKey = 'ArrowUp';
      else if (keyCode === 40) currentKey = 'ArrowDown';
      else if (keyCode === 37) currentKey = 'ArrowLeft';
      else if (keyCode === 39) currentKey = 'ArrowRight';
      else currentKey = key.toLowerCase();
      
      keyHistory.push(currentKey);
      if (keyHistory.length > 10) keyHistory.shift();
      
      if (keyHistory.join('|') === konamiSequence.join('|')) {
        secretUnlocked = true;
        stageIndex = 3;
        notice = '✦ SECRET UNLOCKED! ✦';
        noticeTime = 3;
        playSound(1046, 0.4);
        if (gameState === 'title') gameState = 'select';
      }
      
      // SELECT画面：ステージ選択・難易度選択
      if (gameState === 'select') {
        if (keyCode === 37) {  // 左矢印：ステージ前へ
          const available = secretUnlocked ? 4 : 3;
          stageIndex = (stageIndex - 1 + available) % available;
          playSound(540, 0.08);
        } else if (keyCode === 39) {  // 右矢印：ステージ次へ
          const available = secretUnlocked ? 4 : 3;
          stageIndex = (stageIndex + 1) % available;
          playSound(540, 0.08);
        } else if (key === '1' || key === '2' || key === '3') {
          difficulty = Number(key) - 1;
          resetGame();
        }
      }
      
      // RESULT画面：選択肢
      if (gameState === 'clear' || gameState === 'over') {
        if (key.toUpperCase() === 'S') {
          gameState = 'select';
          playSound(540, 0.08);
        }
      }
      
      return false;
    };

    p.keyIsDown = function(code) {
      if (code === 37) return p.keyIsPressed && p.keyCode === 37;  // 左矢印
      if (code === 39) return p.keyIsPressed && p.keyCode === 39;  // 右矢印
      if (code === 32) return p.keyIsPressed && p.keyCode === 32;  // スペース
      return false;
    };
  };

  new p5(sketch, container);
}

// ===== ゲーム状態の更新 =====
function updateGame(dt) {
  const stage = STAGES[stageIndex];
  
  // 経過時間の更新
  elapsed += dt;
  
  // プレイヤーの状態更新
  player.inv = max(0, player.inv - dt);
  player.star = max(0, player.star - dt);
  player.shield = max(0, player.shield - dt);
  player.fire = max(0, player.fire - dt);
  shotTimer = max(0, shotTimer - dt);
  comboTimer -= dt;
  
  if (comboTimer <= 0) combo = 0;
  shake = max(0, shake - 35 * dt);
  flash = max(0, flash - dt);
  noticeTime = max(0, noticeTime - dt);
  
  // プレイヤーの移動
  let moveDir = 0;
  if (keyIsDown(LEFT)) moveDir = -1;
  if (keyIsDown(RIGHT)) moveDir = 1;
  player.x = constrain(player.x + moveDir * CONFIG.playerSpeed * dt, 25, CONFIG.canvasW - 25);
  
  // 射撃（スペースキーで連続射撃）
  if (keyIsDown(32)) shoot();
  
  // 敵の生成
  if (!boss && elapsed < stage.goal) {
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnEnemy();
      spawnTimer = random(0.65, 1.2) * stage.spawn;
    }
  }
  
  // ボスの出現
  if (!boss && elapsed >= stage.goal) {
    spawnBoss();
  }
  
  // 敵の移動
  for (let e of enemies) {
    e.y += e.speed * dt;
    if (e.type === 'zig') {
      e.x += sin(elapsed * 5 + e.phase) * 110 * dt;
    }
  }
  
  // 敵の削除（画面外・体力0）
  enemies = enemies.filter(e => e.y < CONFIG.canvasH + 55 && e.hp > 0);
  
  // 弾の移動
  for (let b of bullets) {
    b.y += b.vy * dt;
    if (b.vx) b.x += b.vx * dt;
  }
  
  // 弾の削除（画面外）
  bullets = bullets.filter(b => b.y > -20 && b.x > 0 && b.x < CONFIG.canvasW);
  
  // 敵弾の移動
  for (let b of enemyBullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  }
  
  // 敵弾の削除（画面外）
  enemyBullets = enemyBullets.filter(b => b.y < CONFIG.canvasH + 25 && b.x > -25 && b.x < CONFIG.canvasW + 25);
  
  // 弾と敵の当たり判定
  for (let b of bullets) {
    for (let e of enemies) {
      if (e.hp > 0 && dist(b.x, b.y, e.x, e.y) < b.r + e.r) {
        e.hp--;
        b.y = -100;
        if (e.hp <= 0) destroyEnemy(e);
        break;
      }
    }
    
    // 弾とボスの当たり判定
    if (boss && dist(b.x, b.y, boss.x, boss.y) < b.r + boss.r) {
      boss.hp--;
      b.y = -100;
      burst(b.x, b.y + 100, [255, 174, 89], 2);
      if (boss.hp <= 0) {
        score += 500;
        boss = null;
        endGame(true);
        return;
      }
    }
  }
  
  // プレイヤーと敵の当たり判定
  for (let e of enemies) {
    if (dist(player.x, player.y, e.x, e.y) < player.r + e.r) {
      if (player.star > 0) {
        e.hp = 0;
        destroyEnemy(e);
      } else {
        e.hp = 0;
        playerDamage();
      }
    }
  }
  
  enemies = enemies.filter(e => e.hp > 0);
  
  // プレイヤーと敵弾の当たり判定
  for (let b of enemyBullets) {
    if (dist(b.x, b.y, player.x, player.y) < b.r + player.r) {
      b.y = CONFIG.canvasH + 100;
      playerDamage();
    }
  }
  
  // ボスの更新
  if (boss) {
    boss.t += dt;
    boss.y += (min(110, boss.y + 90) - boss.y) * dt * 2;
    boss.x = CONFIG.canvasW / 2 + sin(boss.t * 1.3) * 280;
    
    boss.shot -= dt;
    if (boss.shot <= 0) {
      boss.shot = 0.75 / (difficulty === 2 ? 1.3 : 1);
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
      playSound(160, 0.16);
    }
    
    if (dist(boss.x, boss.y, player.x, player.y) < boss.r + player.r) {
      playerDamage();
    }
  }
  
  // パワーアップアイテムの更新
  for (let p of pickups) {
    p.y += 85 * dt;
    p.t += dt;
    
    if (dist(p.x, p.y, player.x, player.y) < p.r + player.r) {
      p.y = CONFIG.canvasH + 50;
      
      if (p.type === 'heart') {
        player.lives = min(5, player.lives + 1);
        notice = '♥ LIFE UP!';
      } else if (p.type === 'star') {
        player.star = 7;
        notice = '★ STAR MODE!';
      } else if (p.type === 'shield') {
        player.shield = 15;
        notice = '◆ SHIELD!';
      } else if (p.type === 'rapid') {
        player.fire = 12;
        notice = '⚡ RAPID FIRE!';
      }
      noticeTime = 1.2;
      playSound(940, 0.2);
    }
  }
  
  pickups = pickups.filter(p => p.y < CONFIG.canvasH + 30);
  
  // BGM（簡易版）
  if (bgmEnabled) {
    bgmTimer -= dt;
    if (bgmTimer <= 0) {
      bgmTimer = 0.22;
      const bgmSeq = [220, 330, 440, 330, 261.63, 392, 523, 392];
      playSound(bgmSeq[floor(elapsed / 0.22) % bgmSeq.length], 0.11);
    }
  }
}

// ===== 敵の生成 =====
function spawnEnemy() {
  const stage = STAGES[stageIndex];
  const enemyR = random(14, 27);
  const rand_type = random();
  let type = 'normal';
  
  if (rand_type < 0.17) {
    type = 'zig';      // ジグザグ移動
  } else if (rand_type < 0.29) {
    type = 'tank';     // 耐久型
  }
  
  const enemySpeed = random(105, 170) * stage.enemySpeed * (difficulty === 0 ? 0.75 : difficulty === 2 ? 1.45 : 1);
  
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

// ===== 敵の破壊 =====
function destroyEnemy(e) {
  score += e.value * (1 + floor(combo / 5));
  kills++;
  combo++;
  comboTimer = 3;
  
  burst(e.x, e.y, e.type === 'tank' ? [255, 183, 99] : [255, 106, 158], 15);
  dropPickup(e.x, e.y);
  playSound(250 + min(combo, 20) * 30, 0.1);
  
  // 一定数倒したらスターモード
  if (kills > 0 && kills % 12 === 0) {
    player.star = max(player.star, 4);
    notice = '★ STAR MODE — 無敵!';
    noticeTime = 1.7;
    playSound(990, 0.4);
  }
}

// ===== ボスの生成 =====
function spawnBoss() {
  boss = {
    x: CONFIG.canvasW / 2,
    y: -90,
    r: 68,
    hp: 38 + stageIndex * 15,
    maxhp: 38 + stageIndex * 15,
    t: 0,
    shot: 1.1
  };
  
  notice = '⚠ WARNING — BOSS INCOMING';
  noticeTime = 3;
  shake = 10;
  playSound(90, 0.65);
}

// ===== 射撃 =====
function shoot() {
  const rapid = player.fire > 0;
  const interval = rapid ? 0.085 : CONFIG.shootInterval;
  
  if (shotTimer > 0) return;
  shotTimer = interval;
  
  bullets.push({
    x: player.x,
    y: player.y - 24,
    vy: -690,
    r: 5
  });
  
  if (rapid) {
    bullets.push(
      { x: player.x - 10, y: player.y - 18, vy: -640, vx: -90, r: 4 },
      { x: player.x + 10, y: player.y - 18, vy: -640, vx: 90, r: 4 }
    );
  }
  
  playSound(rapid ? 600 : 480, 0.05);
}

// ===== プレイヤーダメージ =====
function playerDamage() {
  if (player.inv > 0 || player.star > 0 || player.shield > 0) {
    if (player.shield > 0) {
      player.shield = 0;
      player.inv = 0.6;
      notice = 'SHIELD BLOCK!';
      noticeTime = 0.8;
      playSound(400, 0.1);
    }
    return;
  }
  
  player.lives--;
  player.inv = 1.6;
  shake = 12;
  flash = 0.25;
  combo = 0;
  burst(player.x, player.y, [255, 78, 137], 24);
  playSound(120, 0.3);
  
  if (player.lives <= 0) endGame(false);
}

// ===== パワーアップドロップ =====
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

// ===== ゲームリセット =====
function resetGame() {
  const stage = STAGES[stageIndex];
  
  player = {
    x: CONFIG.canvasW / 2,
    y: CONFIG.canvasH - 76,
    r: CONFIG.playerSize,
    lives: CONFIG.startingLives,
    inv: 1,
    star: 0,
    shield: 0,
    fire: 0
  };
  
  enemies = [];
  bullets = [];
  enemyBullets = [];
  pickups = [];
  particles = [];
  boss = null;
  
  elapsed = 0;
  spawnTimer = 0.7;
  shotTimer = 0;
  score = 0;
  kills = 0;
  combo = 0;
  comboTimer = 0;
  shake = 0;
  flash = 0;
  bgmTimer = 0;
  
  gameState = 'play';
  notice = 'STAGE ' + (stageIndex + 1) + ' — ' + stage.name;
  noticeTime = 2;
  playSound(523, 0.14);
  setTimeout(() => playSound(784, 0.18), 130);
}

// ===== ゲーム終了 =====
function endGame(win) {
  gameState = win ? 'clear' : 'over';
  
  if (score > best) {
    best = score;
    try {
      localStorage.setItem('neon-dodge-best', String(best));
    } catch (e) {}
  }
  
  playSound(win ? 880 : 150, 0.5);
  burst(player.x, player.y, win ? [134, 255, 219] : [255, 100, 136], 55);
}

// ===== 描画関数 =====
function drawGame() {
  const stage = STAGES[stageIndex];
  
  // ステージの背景
  background(stage.bg);
  
  // グリッド描画
  stroke(stage.accent);
  strokeWeight(1);
  let offset = (elapsed * 40) % 40;
  for (let x = 0; x < CONFIG.canvasW; x += 40) {
    line(x, 0, x, CONFIG.canvasH);
  }
  for (let y = offset; y < CONFIG.canvasH; y += 40) {
    line(0, y, CONFIG.canvasW, y);
  }
  
  // 敵を描画
  for (let e of enemies) {
    push();
    translate(e.x, e.y);
    rotate(elapsed * (e.type === 'zig' ? 3 : 1));
    
    fill(e.type === 'tank' ? [255, 160, 93] : CONFIG.enemyColor);
    drawPolygon(0, 0, e.r, e.type === 'tank' ? 6 : 4);
    pop();
  }
  
  // 弾を描画
  fill([145, 251, 255]);
  for (let b of bullets) {
    rect(b.x - 3, b.y - 13, 6, 17);
  }
  
  // 敵弾を描画
  fill([255, 176, 97]);
  for (let b of enemyBullets) {
    ellipse(b.x, b.y, b.r * 2);
  }
  
  // パワーアップアイテムを描画
  for (let p of pickups) {
    const colors = {
      heart: [255, 100, 139],
      star: [255, 232, 107],
      shield: [121, 168, 255],
      rapid: [114, 255, 180]
    };
    const emojis = {
      heart: '♥',
      star: '★',
      shield: '◆',
      rapid: '⚡'
    };
    
    fill(colors[p.type]);
    ellipse(p.x, p.y, p.r * 2 + sin(p.t * 7) * 2);
    
    fill(16, 21, 41);
    textAlign(CENTER, CENTER);
    textSize(17);
    text(emojis[p.type], p.x, p.y);
  }
  
  // パーティクルを描画
  for (let p of particles) {
    fill(p.color[0], p.color[1], p.color[2], p.t / p.life * 255);
    rect(p.x, p.y, p.size, p.size);
  }
  
  // ボスを描画
  if (boss) {
    push();
    translate(boss.x, boss.y);
    rotate(boss.t * 0.6);
    
    fill([158, 47, 103]);
    drawPolygon(0, 0, boss.r, 8);
    stroke([255, 176, 95]);
    strokeWeight(5);
    noFill();
    drawPolygon(0, 0, boss.r, 8);
    pop();
    
    fill([255, 229, 189]);
    textAlign(CENTER, CENTER);
    textSize(75);
    text('◉', boss.x, boss.y);
    
    // ボスのHP表示
    fill(58, 32, 62);
    rect(280, 67, 400, 11);
    fill([255, 113, 142]);
    rect(280, 67, 400 * boss.hp / boss.maxhp, 11);
    
    fill([255, 181, 196]);
    textAlign(CENTER, CENTER);
    textSize(13);
    text('BOSS', CONFIG.canvasW / 2, 57);
  }
  
  // プレイヤーを描画
  push();
  translate(player.x, player.y);
  
  if (player.inv > 0 && floor(elapsed * 12) % 2 === 0) {
    fill(CONFIG.playerColor[0], CONFIG.playerColor[1], CONFIG.playerColor[2], 90);
  } else {
    let c = player.star > 0 ? [255, 233, 108] : CONFIG.playerColor;
    fill(c);
  }
  
  // 三角形の船
  beginShape();
  vertex(0, -player.r * 1.6);
  vertex(-player.r, player.r);
  vertex(0, player.r * 0.45);
  vertex(player.r, player.r);
  endShape(CLOSE);
  
  // 窓
  fill(255);
  rect(-4, -7, 8, 10);
  pop();
  
  // シールド表示
  if (player.shield > 0) {
    noFill();
    stroke([136, 170, 255]);
    strokeWeight(3);
    ellipse(player.x, player.y, (player.r + 13) * 2);
  }
  
  // UI表示
  drawUI();
}

function drawUI() {
  const stage = STAGES[stageIndex];
  
  fill(9, 18, 41, 207);
  rect(0, 0, CONFIG.canvasW, 49);
  
  fill(255, 113, 150);
  textAlign(LEFT, CENTER);
  textSize(22);
  text('♥ '.repeat(max(0, player.lives)), 18, 24);
  
  fill([168, 251, 255]);
  textAlign(CENTER, CENTER);
  textSize(21);
  text('SCORE  ' + nf(score, 5, 0), 330, 24);
  
  fill([255, 202, 142]);
  textSize(19);
  text('K.O. ' + kills, 590, 24);
  
  fill([214, 220, 255]);
  textAlign(RIGHT, CENTER);
  textSize(19);
  text('TIME ' + floor(elapsed) + 's', CONFIG.canvasW - 20, 24);
  
  // コンボ表示
  if (combo > 1) {
    fill([255, 242, 140]);
    textAlign(CENTER, CENTER);
    textSize(18);
    text('COMBO ×' + combo, 790, 82);
  }
  
  // パワーアップ状態表示
  if (player.star > 0) {
    fill([255, 233, 108]);
    textAlign(CENTER, CENTER);
    textSize(19);
    text('★ INVINCIBLE ' + ceil(player.star) + 's', CONFIG.canvasW / 2, CONFIG.canvasH - 24);
  } else if (player.fire > 0) {
    fill([131, 255, 193]);
    textSize(18);
    text('⚡ RAPID FIRE ' + ceil(player.fire) + 's', CONFIG.canvasW / 2, CONFIG.canvasH - 24);
  }
  
  // メッセージ表示
  if (noticeTime > 0) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(26);
    text(notice, CONFIG.canvasW / 2, 110);
  }
}

function drawTitle() {
  fill(255, 90, 130, 207);
  rect(0, 0, CONFIG.canvasW, CONFIG.canvasH);
  
  fill([125, 250, 255]);
  textAlign(CENTER, CENTER);
  textSize(76);
  text('✦ NEON DODGE ✦', CONFIG.canvasW / 2, 162);
  
  fill([255, 159, 234]);
  textSize(28);
  text('ULTIMATE EDITION', CONFIG.canvasW / 2, 220);
  
  fill([197, 213, 255]);
  textSize(20);
  text('基礎版から段階的に成長させたゲーム', CONFIG.canvasW / 2, 283);
  
  fill(255);
  textSize(30);
  text('ENTER でスタート', CONFIG.canvasW / 2, 358);
  
  fill([157, 182, 216]);
  textSize(17);
  text('← → 移動  /  SPACE 射撃  /  ESC タイトル  /  M 音楽 ON・OFF', CONFIG.canvasW / 2, 409);
  
  fill([244, 209, 126]);
  textSize(19);
  text('HIGH SCORE  ' + nf(best, 5, 0), CONFIG.canvasW / 2, 472);
  
  if (secretUnlocked) {
    fill([141, 255, 156]);
    textSize(17);
    text('✦ SECRET STAGE UNLOCKED ✦', CONFIG.canvasW / 2, 519);
  }
}

function drawSelect() {
  fill(255, 90, 130, 207);
  rect(0, 0, CONFIG.canvasW, CONFIG.canvasH);
  
  fill([167, 249, 255]);
  textAlign(CENTER, CENTER);
  textSize(38);
  text('SELECT YOUR MISSION', CONFIG.canvasW / 2, 100);
  
  fill([195, 216, 247]);
  textSize(22);
  text('難易度を選ぼう', CONFIG.canvasW / 2, 150);
  
  const difficulties = [
    ['1', 'EASY', 'はじめてのパイロット', [120, 231, 255]],
    ['2', 'NORMAL', '標準ミッション', [255, 225, 124]],
    ['3', 'HARD', 'エキスパート向け', [255, 131, 169]]
  ];
  
  for (let i = 0; i < difficulties.length; i++) {
    const y = 220 + i * 78;
    const [num, label, desc, col] = difficulties[i];
    
    stroke(col);
    strokeWeight(2);
    noFill();
    rect(245, y - 26, 470, 59);
    
    fill(col);
    textAlign(CENTER, CENTER);
    textSize(26);
    text(num + '   ' + label, CONFIG.canvasW / 2, y - 4);
    
    fill([194, 204, 228]);
    textSize(13);
    text(desc, CONFIG.canvasW / 2, y + 20);
  }
  
  const stage = STAGES[stageIndex];
  fill(stage.accent);
  textSize(20);
  text('ステージ切替：← →  ' + stage.name, CONFIG.canvasW / 2, 508);
  
  fill([217, 233, 255]);
  textSize(18);
  text('数字キー 1 / 2 / 3 で開始  /  ESC タイトル', CONFIG.canvasW / 2, 552);
}

function drawResult() {
  fill(255, 90, 130, 207);
  rect(0, 0, CONFIG.canvasW, CONFIG.canvasH);
  
  let resultText = gameState === 'clear' ? 'MISSION CLEAR!' : 'GAME OVER';
  let resultColor = gameState === 'clear' ? [135, 255, 209] : [255, 119, 152];
  
  fill(resultColor);
  textAlign(CENTER, CENTER);
  textSize(64);
  text(resultText, CONFIG.canvasW / 2, 176);
  
  fill(255);
  textSize(31);
  text('SCORE  ' + nf(score, 5, 0), CONFIG.canvasW / 2, 265);
  
  fill([182, 217, 250]);
  textSize(21);
  text('ENEMIES DEFEATED  ' + kills, CONFIG.canvasW / 2, 311);
  
  fill([255, 219, 138]);
  text('HIGH SCORE  ' + nf(best, 5, 0), CONFIG.canvasW / 2, 353);
  
  fill([215, 230, 255]);
  textSize(21);
  text('ENTER : もう一度   /   S : ステージ選択   /   ESC : タイトル', CONFIG.canvasW / 2, 438);
  
  fill([154, 198, 231]);
  textSize(19);
  text('同じゲームでも、改造するとこんなに変わる！', CONFIG.canvasW / 2, 498);
}

// ===== ユーティリティ関数 =====
function drawPolygon(x, y, r, n) {
  beginShape();
  for (let i = 0; i < n; i++) {
    let angle = (TWO_PI / n) * i;
    let xx = x + cos(angle) * r;
    let yy = y + sin(angle) * r;
    vertex(xx, yy);
  }
  endShape(CLOSE);
}

function burst(x, y, col, n) {
  for (let i = 0; i < n; i++) {
    let angle = random(TWO_PI);
    let v = random(35, 210);
    particles.push({
      x: x,
      y: y,
      vx: cos(angle) * v,
      vy: sin(angle) * v,
      t: random(0.25, 0.8),
      life: 0.8,
      color: col,
      size: random(2, 5)
    });
  }
}

function playSound(freq, duration) {
  // p5.js には音声 API がないため、Web Audio API を使用
  try {
    let audioContext = window.AudioContext || window.webkitAudioContext;
    let ctx = new audioContext();
    
    if (ctx.state === 'suspended') ctx.resume();
    
    let osc = ctx.createOscillator();
    let gain = ctx.createGain();
    
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}
