# 公共賃貸住宅維持管理システム

公共賃貸住宅の点検・維持管理を効率化するためのデスクトップアプリケーション。

## 主な機能

- **チーム管理**: チームの作成・切り替え
- **住宅物件管理**: 物件情報の登録、地図上での表示
- **地理情報機能**: 住所から座標検索、標高情報の取得
- **点検・検査機能**: チェックリストによる点検記録
- **コメント機能**: 位置情報・画像付きのコメント追加

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | Next.js 16 + React 19 |
| 言語 | TypeScript / Rust |
| デスクトップ | Tauri 2.9 |
| 状態管理 | Zustand |
| データベース | SQLite |
| 地図 | Leaflet |

## 必要要件

- Node.js 20以上
- pnpm 10以上
- Rust（Tauriビルド用）

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev

# Tauriアプリとして起動
pnpm tauri dev
```

## ビルド

```bash
# Next.js静的ファイル生成
pnpm build

# Tauriアプリをビルド
pnpm tauri build
```

## スクリプト

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | 静的ファイル生成 |
| `pnpm lint` | ESLint実行 |
| `pnpm format` | Prettier整形 |
| `pnpm typecheck` | 型チェック |

## ディレクトリ構成

```
├── app/                # Next.js App Router
├── components/         # Reactコンポーネント
│   ├── elements/      # 基本UI要素
│   ├── features/      # 機能別コンポーネント
│   └── modules/       # 再利用可能モジュール
├── lib/               # ユーティリティ・ロジック
│   ├── models/        # データベースモデル
│   └── constants/     # 定数
├── src-tauri/         # Tauriバックエンド（Rust）
└── public/            # 静的ファイル
```

## ライセンス

All rights reserved.
