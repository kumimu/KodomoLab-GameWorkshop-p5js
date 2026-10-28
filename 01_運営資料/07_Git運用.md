# Git運用

Gitは生徒への学習項目ではなく、コーチの差分確認・復旧ツールとして利用します。

## 初期化

```bash
git init
git config user.name "KodomoLab"
git config user.email "workshop@example.invalid"
git add .
git commit -m "initial template"
```

## 差分確認

```bash
git diff
```

## ファイルを初期状態へ戻す

```bash
git restore sketch.js
```

## VS Code

左側の「ソース管理」から、変更された行をGUIで確認できます。
