# ZenType システムパターン

## アーキテクチャ概要

### フロントエンド構成
```
app/
├── (auth)/          # 認証関連ページ
├── practice/        # 練習ページ
├── history/         # 成績履歴ページ
├── components/      # 共通コンポーネント
│   ├── ui/         # 基本UIコンポーネント
│   ├── typing/     # タイピング関連コンポーネント
│   └── auth/       # 認証関連コンポーネント
├── lib/            # ユーティリティ・設定
└── api/            # API Routes
```

### 重要な設計パターン

#### 1. タイピングセッション管理
```typescript
// リアルタイムデータはクライアントサイドで管理
interface TypingSession {
  currentWPM: number
  accuracy: number
  mistakeCount: number
  currentPosition: number
  startTime: Date
  keyEvents: KeyEvent[] // メモリのみ、保存しない
}

// 永続化データは最小限
interface SessionResult {
  finalWPM: number
  finalAccuracy: number
  mistakeCount: number
  duration: number
  textId: string
  createdAt: Date
}
```

#### 2. 認証フロー
- NextAuth.js + Supabase Provider
- セッション管理はNextAuth.jsに委譲
- ユーザー情報はSupabaseに保存

#### 3. キーボードショートカット
- カスタムフックで集約管理
- `useKeyboardShortcuts()`
- 練習中は特別な処理（ショートカット無効化）

### データベース設計

#### Core Tables
```sql
-- ユーザー（NextAuth.jsと連携）
users (
  id: uuid PRIMARY KEY
  email: text
  name: text
  image: text
  created_at: timestamp
)

-- 練習セッション結果
session_results (
  id: uuid PRIMARY KEY
  user_id: uuid REFERENCES users(id)
  wpm: integer
  accuracy: decimal
  mistake_count: integer
  duration: integer -- 秒
  text_id: text -- 練習テキストの識別子
  created_at: timestamp
)

-- 練習テキスト
practice_texts (
  id: text PRIMARY KEY
  content: text
  difficulty: text -- 'easy', 'normal', 'hard'
  category: text -- 将来の拡張用
)
```

### 重要な技術的決定

#### リアルタイム性能
- WPM計算: クライアントサイドで最適化
- 入力遅延回避: React.useCallback + useMemo活用
- 描画最適化: 変更部分のみ再描画

#### 型安全性
- Supabase型生成: `supabase gen types`
- zod スキーマ検証
- TypeScript strict mode

#### キャッシュ戦略
- 練習テキスト: ISR (Incremental Static Regeneration)
- ユーザー成績: SWR with Cache
- 認証状態: NextAuth.js内蔵キャッシュ

## 日本語入力システム拡張計画

### アーキテクチャ拡張
- **多言語対応データ構造**: 表示文字列と入力対象文字列の分離
- **言語別入力エンジン**: 英語・日本語それぞれに最適化された入力処理
- **ローマ字変換システム**: 拡張可能な変換テーブル設計

### 日本語入力の技術的挑戦
- **複数入力パターン**: 一つのひらがなに対する複数のローマ字入力方法
- **促音処理**: 「っ」の特殊な変換ルール（次の子音との組み合わせ）
- **文字位置マッピング**: 表示位置と入力位置の非線形対応

### 実装戦略
1. **段階的アプローチ**: 基本機能→特殊ケース→高度な機能
2. **プラグイン設計**: 新しい変換ルールの後付け追加
3. **テスト駆動**: 各段階での十分な検証

### 重要な設計パターン（日本語入力システム拡張）

#### 4. ローマ字変換システム（最新：拗音対応）
```typescript
// 拗音対応の2段階マッピング構造
interface RomajiConverter {
  // 優先度1: 拗音（2文字組み合わせ）
  YOON_MAP: Record<string, string> // 'きゃ' → 'kya'
  
  // 優先度2: 基本ひらがな（1文字）
  HIRAGANA_TO_ROMAJI_MAP: Record<string, string> // 'き' → 'ki'
  
  // 変換ロジック: 2文字優先→1文字フォールバック
  convertToRomaji(hiragana: string): RomajiConversionResult
  validateInput(hiragana: string, input: string): ValidationResult
}

// 拗音対応変換例
// ❌ 従来: 'きゃ' → 'ki' + 'ya' (2回入力必要)
// ✅ 改善: 'きゃ' → 'kya' (1回で正しく変換)
```

#### 5. 多言語対応パターン
```typescript
interface PracticeText {
  language: 'english' | 'japanese'
  
  // 英語の場合
  content: string  // 表示・入力共に使用
  
  // 日本語の場合  
  displayText: string  // ひらがな表示用
  inputText: string    // ローマ字変換用
}
```
