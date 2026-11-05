# コーチ用TIPS：Bの命中時に短い音を鳴らす

Bの射撃を実装でき、時間に余裕のある参加者への発展例です。生徒用課題や投影資料には載せず、コーチの手元で参照します。

## 追加するのはBの中の3か所

ワーク用のsketch.jsで、`registerWorkshopOption("B", {`から始まるBの定義を探します。既存のBを書き換え、同じBをもう1つ登録する必要はありません。今回の試作ファイルには追加済みなので、重複して入れません。

### ① 音の準備を保持する入れ物

Bの`bullets: []`の次の行へ追加します。ここは関数の外側です。

```javascript
audio: null, // 命中音に使う音の準備を保持します。
```

### ② ゲーム開始時に音を使えるようにする

Bにあるstart()の中で、`this.bullets = [];`の後へ追加します。start()を新しく増やさず、今ある関数の中へ入れます。

```javascript
if (!this.audio) {
  this.audio = new (window.AudioContext || window.webkitAudioContext)();
}
this.audio.resume();
```

最初のゲーム開始時に音の処理を用意し、次回から同じものを使います。開始キーの操作で音を有効にします。

### ③ 弾が当たった瞬間に鳴らす

Bのupdate()にある、`dist(...) < 3 + enemySize / 2`という命中判定のifを探します。**そのifの中で、得点を足す行の直前**へ追加します。画面外の弾を削除する場所には入れません。

```javascript
// 命中したら、440Hzの短い音を0.1秒鳴らします。
const sound = this.audio.createOscillator();
const volume = this.audio.createGain();
sound.frequency.value = 440;
volume.gain.setValueAtTime(0.03, this.audio.currentTime);
volume.gain.exponentialRampToValueAtTime(0.001, this.audio.currentTime + 0.1);
sound.connect(volume);
volume.connect(this.audio.destination);
sound.start();
sound.stop(this.audio.currentTime + 0.1);
```

その後の得点加算、弾の削除、敵の再登場、breakは残します。

## 仕組みと変えられる値

**ゲーム開始で音の準備 → 弾の命中判定 → 短い音を1回鳴らす。** 外部の音声ファイルやp5.soundは不要で、ブラウザの音声機能を使います。

| 値 | 意味 |
|---|---|
| 440 | 音の高さ（Hz）。Gの音名・周波数の早見表も参考にできる |
| 0.03 | 鳴り始めの音量 |
| 0.1（2か所） | 音量を小さくし、音を止めるまでの秒数。長さを変えるなら両方を揃える |

GのBGMとは別にBが音の準備を持つので、Bだけでも使用できます。GのMキーはBGMの切り替えで、命中音は切り替えません。

## コーチの確認

- ゲーム開始後、弾が敵に当たったときだけ音が鳴る。
- 外れた弾や画面外へ出た弾では鳴らない。
- 得点・弾の削除・敵の再登場が今までどおり動く。
- Gを併用した場合、BGMと同時に鳴る。終了後も鳴り続けない。

## 参考にした完成版

`02_教材／02_完成版／sketch.js`のplaySound(freq, duration)とdestroyEnemy(e)が参考です。このTIPSでは、Bの命中判定へ短い処理を直接置いています。

[コーチ用フォローガイドへ戻る](06_フォローガイド.md)
