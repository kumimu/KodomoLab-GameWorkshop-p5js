# インストーラ

会場利用規約とライセンスを確認したうえで、必要な公式インストーラを配置します。

- Visual Studio Code
- Git for Windows
- Chrome（Edge利用時は不要）

Node.js、npm、Live Serverは今回不要です。

---

インストーラガイド - 本日のセットアップ用

【必須ツールのダウンロード】

1. Visual Studio Code
   https://code.visualstudio.com/Download
   → Windows (x64) Installer をクリック

2. Git for Windows
   https://git-scm.com/download/win
   → 64-bit版をクリック
   または直接: https://github.com/git-for-windows/git/releases

3. Chrome ブラウザ
   https://www.google.com/intl/ja/chrome/

---

【インストール手順】

■ Visual Studio Code
1. VSCodeSetup-x64-*.exe をダブルクリック
2. 「次へ」で進める
3. 利用規約に同意 → 「次へ」
4. 完了

■ Git for Windows
1. Git-2.*.*.0-64-bit.exe をダブルクリック
2. 「Next」で進める
3. PATH設定画面で「Git from the command line and also from 3rd-party software」を選択
4. 他はデフォルト「Next」
5. 完了後、コマンドプロンプトで git --version を実行して確認

■ Chrome
1. ChromeSetup.exe をダブルクリック
2. 自動インストール完了

---

【環境チェックリスト】

Master PC（1台目）で確認:
- [ ] VS Code インストール済み
- [ ] Git インストール済み (git --version で確認)
- [ ] Chrome または Edge インストール済み
- [ ] p5.min.js ダウンロード済み

配置先: 02_教材/01_配布テンプレート/p5.min.js

---

【本日のセットアップ - Master PC 方式】

【Phase 1】Master PC セットアップ（1台のみ・30-40分）

1. テンプレートをデスクトップにコピー
   C:\Users\[ユーザー名]\Desktop\my_game\

   確認:
   - index.html
   - sketch.js
   - missions.md
   - README.md
   - p5.min.js

2. ゲーム動作確認
   - index.html をダブルクリック
   - 1, 2, 3 キーで難易度選択
   - 左右キーでプレイヤー移動
   - 敵移動、衝突判定、GAME OVER / CLEAR を確認

3. VS Code でフォルダを開く
   File → Open Folder → C:\Users\[ユーザー名]\Desktop\my_game

4. Git 初期化（ターミナルで実行）
   git init
   git config user.name "KodomoLab"
   git config user.email "workshop@example.invalid"
   git add .
   git commit -m "initial template"

5. Git 動作確認
   git log --oneline
   (コミットが表示されればOK)

6. 色変更テスト
   sketch.js を開く
   playerColor = "cyan" を playerColor = "yellow" に変更
   保存 (Ctrl+S)
   ブラウザで F5 更新
   プレイヤーが黄色に変わったか確認

7. Git差分確認
   git diff
   (差分が表示されればOK)

8. 復旧確認
   git restore sketch.js
   ブラウザで F5 更新
   プレイヤーが cyan に戻ったか確認

---

【Phase 2】検証済みフォルダの配布準備（5-10分）

Master PC での全テスト完了後:

■ USB ドライブへコピー
1. USB を Master PC に接続
2. C:\Users\[ユーザー名]\Desktop\my_game を右クリック
3. コピー
4. USB:\my_game に貼り付け

または

■ ネットワーク共有フォルダへコピー
1. ネットワーク共有フォルダ（\\SERVER\shared など）を開く
2. C:\Users\[ユーザー名]\Desktop\my_game をコピー
3. 共有フォルダに貼り付け

---

【Phase 3】各 PC への展開（3-5分 × 5台）

PC 2-6 での手順（各PCで同じ）:

1. USB または ネットワークから my_game をコピー
   USB の場合: USB:\my_game → コピー
   ネットワークの場合: \\SERVER\shared\my_game → コピー

2. C:\Users\[ユーザー名]\Desktop に貼り付け

3. Desktop\my_game\index.html をダブルクリック

4. ゲーム起動確認
   - 画面表示
   - キー操作（1, ←, →）
   - F12 でエラーなしを確認

5. Git 確認
   VS Code でフォルダを開く
   git log --oneline
   (初期コミットが表示されれば完了)

---

【Phase 4】全 PC 統合チェック（10-15分）

全6台が以下を満たしているか確認:

□ index.html 起動可能
□ 難易度選択（1・2・3）できる
□ プレイヤー移動（左右キー）できる
□ git log でコミット表示
□ Wi-Fi OFF で動作

全て確認できたら完成！

---

【トラブル対応】

問題: Uncaught ReferenceError: p5 is not defined
原因: p5.min.js が見つからない
対応: my_game フォルダ内に p5.min.js があるか確認

問題: Canvas が真っ黒 / 何も表示されない
原因: ブラウザキャッシュ
対応: F5 で更新 または Ctrl+Shift+Delete でキャッシュ削除

問題: キー入力反応なし
原因: ブラウザのフォーカス問題
対応: ブラウザウィンドウをアクティブにして再度テスト

問題: git: command not found
原因: Git 未インストール
対応: コマンドプロンプトで git --version を実行して確認

問題: ファイル名が文字化け
原因: 日本語パス
対応: フォルダ名を英字（Desktop など）で配置

復旧方法:
フォルダ全削除 → USB/共有フォルダから再度コピー
(全テストクリアしたフォルダなので復旧が確実)

---

【効率化のポイント】

並列作業:
- Master PC 検証中に、他スタッフが USB 準備
- PC 2-3 に展開中に、別スタッフが PC 4-5 に展開

時間短縮:
- Master PC テスト完了までは他 PC に触らない
- USB/ネットワークコピーで手動作業を最小化
- 各 PC での「動作確認」は 2-3 分で完了

本日のゴール:
全6台が同じ状態で、生徒が明日からすぐにゲーム改造できる状態

---

【ライセンス】

Visual Studio Code: MIT License
Git: GNU General Public License v2
Chrome: Google Chrome Terms of Service
p5.js: LGPL License





