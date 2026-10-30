# p5.js 1.7.0 — 利用・再配布について

この教材はp5.js 1.7.0を使用しています。p5.jsはLauren Lee McCarthyにより作られ、p5.js ContributorsとProcessing Foundationによって開発されています。著作権は各権利者に帰属します。

- 公式サイト：https://p5js.org/
- 公式著作権案内：https://p5js.org/copyright/
- 使用版のソース：https://github.com/processing/p5.js/tree/v1.7.0
- ライセンス：GNU Lesser General Public License, version 2.1（LGPL 2.1）
- ライセンス全文：[LICENSE-LGPL-2.1.txt](LICENSE-LGPL-2.1.txt)

p5.jsは無保証で提供されます。商品性や特定目的への適合性などについての保証はありません。詳細は添付のライセンス全文をご確認ください。

## 同梱物

- 実行用の圧縮済みライブラリ：この教材フォルダ直下のp5.min.js（未改変）
- [p5.js](p5.js)：同じ版の非圧縮配布ファイル。組み込まれた依存コードの著作権・許諾表示を含め、そのまま保持しています。
- [p5.js-v1.7.0-source.tar.gz](p5.js-v1.7.0-source.tar.gz)：公式タグのソース一式。src、ビルド用Gruntfile.js／tasks、package.json等を含む未改変アーカイブ。
- [UPSTREAM-README.md](UPSTREAM-README.md)：公式ソースに含まれる説明・クレジット。
- SHA256SUMS.txt：同梱ファイルの照合値。

非圧縮版の取得元：https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.js

ソースアーカイブの取得元：https://codeload.github.com/processing/p5.js/tar.gz/refs/tags/v1.7.0

ソースからのビルド手順はアーカイブ内のcontributor_docsやpackage.jsonを参照してください。npm依存パッケージの取得には別途ネットワーク接続と対応する開発環境が必要です。通常のゲーム起動にビルドは不要です。

## コピーして渡すとき

**このlicensesフォルダも含め、教材フォルダを丸ごと渡してください。** p5.min.jsだけを抜き出して配らないでください。ZIPやUSB配布でも同じです。生徒がライブラリを変更・再配布する権利を制限しません。

ゲーム側のsketch.jsとp5.min.jsは別ファイルです。同じAPIに対応するライブラリへ利用者自身が差し替え、変更を試せる構成です。p5.jsのライセンスを、教材全体や生徒作品のライセンスとして一括指定しているわけではありません。

独立した依存コードにはそれぞれの許諾条件があります。非圧縮版とソース一式に含まれる既存表示は削除しないでください。ライブラリそのものを変更して配る場合は、変更日・変更箇所の表示など、追加条件も確認してください。
