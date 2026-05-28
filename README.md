# World Cup 2026 Group Simulator

FIFA World Cup 2026 のグループステージを試せる小さな JavaScript アプリです。2026 年大会の確定済みグループデータを使い、スコアを入力すると順位表と Round of 32 進出予想が更新されます。

## Features

- 12 グループ、48 チームの 2026 年データ
- 各グループ 6 試合のスコア入力
- 勝ち点、勝敗、得失点差、得点の自動計算
- 各組上位 2 チームと、3 位上位 8 チームの進出予想
- 入力結果の `localStorage` 保存
- Node.js 標準テストのみで動く軽い構成

## Getting Started

```bash
node server.mjs
```

Open `http://localhost:4173`.

```bash
node --test tests/*.test.js
```

`npm` が使える環境なら、`npm run dev` と `npm test` でも同じです。

## Data

データ確認日: 2026-05-28

主な参照元:

- [FIFA World Cup 2026 final draw results](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/final-draw-results)
- [FIFA World Cup 2026 match schedule PDF](https://digitalhub.fifa.com/asset/4b5d4417-3343-4732-9cdf-14b6662af407/FWC26-Match-Schedule_English.pdf)
- [UEFA qualified teams and play-off winners](https://www.uefa.com/european-qualifiers/news/029f-1f318027c4dd-8e9bab478b48-1000--world-cup-2026-which-european-teams-have-qualified/)
- [FIFA Play-Off Tournament review](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/play-off-tournament-review)

このアプリはライブスコア連携ではありません。試合結果はユーザーが入力する前提です。

## Ranking Rules

この練習用アプリでは、順位を次の順で並べています。

1. 勝ち点
2. 得失点差
3. 得点
4. チーム名

FIFA 公式の完全なタイブレーク条件とは一部異なります。
