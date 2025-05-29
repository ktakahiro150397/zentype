# ZenType 技術コンテキスト

## 技術スタック（確定）

### フロントエンド・バックエンド
- **Next.js 14+ (App Router)** - TypeScript
  - Server Components活用
  - 最新のReact機能を使用
  - API Routesでバックエンド機能

### データベース・認証
- **Supabase**
  - PostgreSQL（要件通り）
  - 認証機能内蔵（Googleログイン）
  - リアルタイム機能
  - 無料枠充実（500MB、500K月間認証）

### 認証ライブラリ
- **NextAuth.js (Auth.js) v5**
  - App Routerネイティブ対応
  - Supabase Provider
  - Googleプロバイダー標準装備

### ホスティング
- **Vercel**
  - Next.jsとの完璧な統合
  - 自動デプロイ・プレビュー
  - Edge Functionsサポート

### 開発ツール
- **TypeScript** - 型安全性重視
- **ESLint + Prettier** - コード品質管理
- **Tailwind CSS** - ユーティリティファーストCSS
- **GitHub Actions** - CI/CD

## アーキテクチャ方針

### データ管理
- リアルタイムデータ: クライアントサイドで管理
- 永続化データ: セッション終了時のみDB保存
- 型安全: zod等でスキーマ検証

### パフォーマンス
- Server Components優先
- 必要な箇所のみClient Components
- 適切なキャッシュ戦略

### スケーラビリティ
- Supabaseの段階的スケーリング
- Vercelのエッジ配信活用
- 効率的なクエリ設計

## 技術選択の理由

### Supabase選択理由
1. **コスパ**: 無料枠が充実、段階的課金
2. **開発効率**: 認証・DB・APIが一体
3. **PostgreSQL**: 要件で指定された技術
4. **スケーラビリティ**: AWS基盤で信頼性高
5. **Next.js親和性**: 公式サポート充実
