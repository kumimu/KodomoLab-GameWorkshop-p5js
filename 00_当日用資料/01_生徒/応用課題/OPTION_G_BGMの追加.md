# OPTION G　BGMの追加

ゲームの開始に合わせて短いメロディを鳴らします。プレイ中にMキーでオン・オフできます。音量を小さくして始めます。

[音名の早見表へ](#notes) ／ [貼り付け手順へ](#steps) ／ [空欄の説明へ](#holes)

## 今回のBGMで試すこと

このゲームでは、配列の音を**同じ間隔で順番に**鳴らします。今回は、音の高さ・並び順・全体の間隔を変えて試しましょう。

好きな曲に近づけるには、音の高さに加えて「音ごとの長さ」や「休符」を扱う仕組みが必要です。今回の90分では、その仕組みは追加せず、短いメロディの音の高さと並びを試します。

## 音名と周波数の早見表

**ドレミから音を選び、表の数値をmelodyの配列へ入れます。** 数値の単位はHz（ヘルツ）。値が大きいほど音が高くなります。

ラ（A4）を440 Hzとする平均律の表です。「低い音・基本の音・高い音」は、この教材での呼び分けです。Cはド、Dはレ、Eはミ、Fはファ、Gはソ、Aはラ、Bはシを表します。

| 音名 | 低い音（3） | 基本の音（4） | 高い音（5） |
|---|---:|---:|---:|
| ド（C） | `131` | `262` | `523` |
| ド♯／レ♭（C♯ / D♭） | `139` | `277` | `554` |
| レ（D） | `147` | `294` | `587` |
| レ♯／ミ♭（D♯ / E♭） | `156` | `311` | `622` |
| ミ（E） | `165` | `330` | `659` |
| ファ（F） | `175` | `349` | `698` |
| ファ♯／ソ♭（F♯ / G♭） | `185` | `370` | `740` |
| ソ（G） | `196` | `392` | `784` |
| ソ♯／ラ♭（G♯ / A♭） | `208` | `415` | `831` |
| ラ（A） | `220` | `440` | `880` |
| ラ♯／シ♭（A♯ / B♭） | `233` | `466` | `932` |
| シ（B） | `247` | `494` | `988` |

表はコードへ入力しやすい整数に丸めています。例：基本のド（C4）は約261.63 Hzなので`262`です。丸め方により、表の数値を2倍した結果と高い音の値が1 Hz程度ずれることがあります。

### 表の使い方

1. まず`__G1__`へ、基本のレの`294`を入れます。ド・レ・ミ・ファ・ソ・ラ・シ・高いドの順になります。
2. 動いたら、melodyの`[`と`]`の間にある数値を1つ変え、保存してゲームを更新します。数値の間のカンマは残します。
3. 音を高くしたいなら右の列、低くしたいなら左の列から選びます。例えばレは`147`・`294`・`587`です。
4. シャープ（♯）は半音上、フラット（♭）は半音下です。この表ではド♯とレ♭は同じ音で、基本の音なら`277`です。レ♯／ミ♭は`311`です。

同じ音名で1オクターブ高くすると周波数は2倍、低くすると半分です。入力には表の値を使えます。

`__G2__`は全体に共通する音の間隔です。`250`なら0.25秒、`400`なら0.4秒ごとに次の音へ進みます。音ごとの長さや休符を指定する欄ではありません。

参考：[音名・周波数の対応表（Paddy）](https://paddystudio.com/tools/note-frequency-chart/)。正確な小数の値や、表の音をクリックして聞く機能もあります。基準のA4は440 Hzのままで使い、音量を小さくして試しましょう。このページ内の表だけでも数値を選べます。

## まず、仕組みを3つでつかもう

**本体が毎回Gへ声を掛ける → Gが音を鳴らす時刻か確かめる → メロディから1音鳴らす。**

**①** 本体がupdateを呼びます。音が使え、BGMがオンなら先へ進みます。

**②** まだ次の時刻でなければ待ちます。時刻になったら、次に鳴らす時刻をintervalで決めます。

**③** melodyから今の音を選んで鳴らし、次の音の番号へ進めます。最後まで行くと先頭へ戻ります。


startはゲーム開始時に音の準備をします。keyはMキーでオン・オフを切り替えます。音の高さと、次の音までの間隔は別々の設定です。

### 今回変えるのはここ

| 虫食い | どこに効く？ |
|---|---|
| `__G1__` | ③で鳴らす音の高さ。melodyの2つ目の音 |
| `__G2__` | ②で次の音まで待つ間隔（ミリ秒） |

まずは①②③の流れと、自分が変える値を追えれば大丈夫です。コード内にも同じ番号のコメントがあります。

[もっと知りたい人へ：本体と追加機能のつながり](仕組み_本体と追加機能.md)

## 選んだ機能だけを1か所へ貼る

1. 「ワーク用」のsketch.jsを保存します。この後も同じワーク用フォルダで作業します。オリジナルは編集しません。
2. 下の「この機能のコードをコピー」を押します。
3. VS Codeで「ワーク用」のsketch.jsを開き、末尾の「応用コード貼り付け欄」を探します。
4. 「ここから」と「ここまで」の間に、この課題のコードを1回貼ります。別の機能を追加するときは、先のコードを残したまま、その下へ貼ります。同じ課題を修正する場合は、その課題のコードを置き換えます。
5. このページの「空欄の意味とヒント」を読み、虫食いを全て埋め、保存します。迷ったら表の例を使えます。
6. Chromeでゲーム本体を更新して始め、機能の動作を確認します。

**ゲーム全体を置き換えません。** CUSTOM AREAの色・大きさ・速さ・タイトルはそのまま残ります。自機をyellowに変えていれば、そのままです。

貼り付け欄が見つからない場合は、「ワーク用」のsketch.jsを開いているか確認します。[困ったときの手順](../02_ワークショップテキスト.html#help)も使えます。

## 貼るコード（この1枠だけ）

```javascript
// ===== このファイルで使う関数・用語の早見表 =====
// 必要な名前を探し、次の行のURLから詳しい説明を確認できます。
// p5.js 1.x 公式リファレンス：https://v1.p5js.org/reference/
//
// 【p5.jsが用意する関数】
// fill(色)：この後に描く図形や文字の塗り色を決める。
// https://v1.p5js.org/reference/p5/fill/
// text(文字, x, y)：指定した位置に文字を描く。
// https://v1.p5js.org/reference/p5/text/
// textSize(大きさ)：文字の大きさを決める。
// https://v1.p5js.org/reference/p5/textSize/
// millis()：スケッチ開始からの経過時間をミリ秒で得る。1000ミリ秒で1秒。
// https://v1.p5js.org/reference/p5/millis/
//
// 【JavaScript標準の機能：p5.jsとは別】
// 文字列.toLowerCase()：英字を小文字に揃える。
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase
//
// 【ブラウザの音声機能：Web Audio API】
// AudioContext / createOscillator() / createGain()：音の処理、音源、音量調節の部品を用意する。
// https://developer.mozilla.org/ja/docs/Web/API/AudioContext
// resume()：一時停止中の音声処理を動かす。
// https://developer.mozilla.org/ja/docs/Web/API/AudioContext/resume
// connect() / disconnect()：音の部品をつなぐ・切り離す。
// https://developer.mozilla.org/ja/docs/Web/API/AudioNode
// start() / stop() / onended：音の開始・停止・終了後の処理を扱う。
// https://developer.mozilla.org/ja/docs/Web/API/AudioScheduledSourceNode
// frequency.value / setValueAtTime() / linearRampToValueAtTime()：音の高さや音量を時刻に合わせて変える。
// https://developer.mozilla.org/ja/docs/Web/API/AudioParam
// audio.currentTime：音声処理の時刻（秒）。millis()のミリ秒と区別する。
// https://developer.mozilla.org/ja/docs/Web/API/BaseAudioContext/currentTime
//
// 【ゲーム本体にある自作関数】
// registerWorkshopOption(ID, 機能)：本体の共通関数へ、課題IDごとに機能を登録する。
// 定義と【役割】の説明は、同じ教材フォルダのsketch.jsで確認できます。
// ===== 早見表ここまで =====

registerWorkshopOption("G", {
  melody: [262, __G1__, 330, 349, 392, 440, 494, 523],
  interval: __G2__, // 音の間隔。1000で1秒です。
  audio: null,
  enabled: true,
  index: 0,
  nextAt: 0,
  // 【役割】開始キーの操作で音を使える状態にし、メロディの先頭と再生時刻を準備します。
  start() {
    // 開始キーを押したタイミングで音を有効にします。
    if (!this.audio) {
      const AudioType = window.AudioContext || window.webkitAudioContext;
      if (!AudioType) {
        return;
      }
      this.audio = new AudioType();
    }
    this.audio.resume();
    this.index = 0;
    this.nextAt = 0;
  },
  // 【役割】Mキーが押されたら、BGMのオン・オフを切り替えます。
  key(k) {
    if (k.toLowerCase() === "m") {
      this.enabled = !this.enabled;
    }
  },
  // 【役割】次の音の時刻になったら短い音を1つ鳴らし、メロディを次へ進めます。
  // ① 本体から毎回呼ばれ、音を鳴らせる状態か確かめます。
  update() {
    if (!this.enabled || !this.audio || this.audio.state !== "running") {
      return;
    }
    // ② 次の音の時刻まで待ち、時刻になったら次回の予定を決めます。
    if (millis() < this.nextAt) {
      return;
    }
    this.nextAt = millis() + this.interval;
    const note = this.audio.createOscillator();
    const volume = this.audio.createGain();
    const now = this.audio.currentTime;
    // ③ メロディから今の音を選び、下のnote.startで鳴らします。
    note.frequency.value = this.melody[this.index];
    volume.gain.setValueAtTime(0, now);
    volume.gain.linearRampToValueAtTime(0.025, now + 0.01);
    volume.gain.linearRampToValueAtTime(0, now + 0.12);
    note.connect(volume);
    volume.connect(this.audio.destination);
    note.start(now);
    note.stop(now + 0.13);
    // 【役割】1つの音の再生が終わったら、音を作った部品の接続を外して片付けます。
    note.onended = () => {
      note.disconnect();
      volume.disconnect();
    };
    this.index = (this.index + 1) % this.melody.length;
  },
  // 【役割】BGMがオンかオフかと、切り替えキーを指定された行へ表示します。
  drawInfo(y) {
    fill("white");
    textSize(14);
    text("M: BGM " + (this.enabled ? "ON" : "OFF"), 20, y);
  }
});
```

## 空欄の意味とヒント

`__G1__`のような**印全体**を置き換えます。アンダースコアも消します。Gの空欄には数値を入れ、引用符は付けません。

| 印 | 何を決める？ | 考えるヒント | 迷ったときの例 |
|---|---|---|---|
| `__G1__` | メロディの2つ目の音の高さ | レの音に当たる数値 | `294` |
| `__G2__` | 音を鳴らす間隔 | 1000で1秒。250なら0.25秒 | `250` |

まず自分で考え、迷ったら例の値を使って動きを確かめます。動いた後に1つずつ変えて試せます。空欄が残っている間は、まだ動かない場合があります。

- メロディの配列を順に読みます。Mでオン・オフし、終了すると新しい音の再生を止めます。p5.soundの追加は不要です。
- 表示する行は本体が割り当てるので、BGM表示とコンボ表示は重なりません。

## 動作確認

<ul class="operation-checks">
<li><label><input type="checkbox"><span>開始キーでBGMが鳴り、Mで切り替えられる。</span></label></li>
<li><label><input type="checkbox"><span>音程や間隔の変更を確認できる。</span></label></li>
<li><label><input type="checkbox"><span>終了後は新しい音が鳴らず、再開で最初の音へ戻る。最後の音は約0.13秒で消える。</span></label></li>
</ul>

## うまく動かないとき

- この課題の`__G1__`などの印が残っていないか探します。
- 保存後、円の練習画面ではなくゲーム本体を更新し、1で始めます。
- 別の機能も入っている場合、そのコードを残したまま追加したか確かめます。同じ課題は1つだけにします。
- それでも直らなければ[テキストの対処手順](../02_ワークショップテキスト.html#help)へ進みます。

## 動いたら挑戦！ 自分のゲームに合うBGMのテンポを作ろう

ここからは、自分のルールや見た目を作る時間です。3～5分を目安に進めます。比較する間はmelodyの音の並びを変えず、intervalだけを変えます。小さい音量で聴き比べます。

### 1．予想クイズ：実行する前に考えよう

intervalを250から500に変えると、どうなるでしょう？ 下で予想を1つ選びます。

<fieldset class="prediction-quiz">
<legend>予想を1つ選ぶ</legend>
<label><input type="radio" name="quiz-g" value="1"><span>ア：音が高くなる。</span></label>
<label><input type="radio" name="quiz-g" value="2"><span>イ：次の音までの間隔が2倍になり、ゆっくりになる。</span></label>
<label><input type="radio" name="quiz-g" value="3"><span>ウ：1つ1つの音が2倍の長さで鳴る。</span></label>
</fieldset>

選んだら、intervalを500にして保存・更新し、ゲームを始めて音の間隔を聴きます。

<details>
<summary>試した後に、答えと理由を見る</summary>

正解は「イ」です。intervalは、次の音を鳴らすまでの間隔です。250は0.25秒、500は0.5秒なので、メロディが進む速さはゆっくりになります。音の高さはmelodyで決まり、1つの音を止める時刻は別の処理で決まっています。

</details>

### 2．お題：自分のゲームに合うBGMのテンポを作ろう

「落ち着いて避けるゲーム」か「急いで逃げるゲーム」か、作りたい雰囲気を決め、その雰囲気に合うテンポを探します。 正解の数値は1つではありません。

1. 150〜1000程度から、試すintervalを2つ自分で決めます。
2. 音の並びとゲームの難易度を揃えて遊び比べ、音がゲームの雰囲気に合うか考えます。
3. 自分のゲームに合う値を採用します。最初の値へ戻しても構いません。

ノートN03へ「試した値・予想・実際の違い」を短く残します。同じ音の並びでも、テンポで印象はどう変わりましたか？

### 3．発見をコメント1行にしよう

ワーク用のsketch.jsで、**Gのintervalの行のすぐ上**へ、`//`で始まるコメントを1行追加します。どんなゲームにしたくてその値を選んだのか、自分の言葉で書きましょう。

迷ったら、`// intervalを〇〇にした。〇〇な雰囲気にしたいから。` を書き出しの手がかりにできます。〇〇は自分の数値や言葉に置き換えます。

最後にコーチへ「この値にした理由」と「遊んで分かったこと」を1つ伝えます。予想と違った結果も、発見です。

## できたら次へ

自分の採用値を決め、コメントを残せたら挑戦は完了です。時間があれば、別の課題のコードも同じ欄へ追加できます。追加するたびに前の機能も動くか確認し、55分になったら新しい追加を止めます。

[課題一覧へ戻る](00_課題の選び方.md)
