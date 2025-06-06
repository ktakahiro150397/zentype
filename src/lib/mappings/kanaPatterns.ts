/**
 * ひらがな文字パターン定義
 * ローマ字変換や文字パース処理で共通して使用される定義
 */

// 複数パターン拗音マッピングテーブル - 複数の入力方法をサポート
export const MULTI_YOON_MAP: Record<string, string[]> = {
  // か行の拗音
  'きゃ': ['kya'], 'きゅ': ['kyu'], 'きょ': ['kyo'],
  'ぎゃ': ['gya'], 'ぎゅ': ['gyu'], 'ぎょ': ['gyo'],
  
  // さ行の拗音
  'しゃ': ['sha', 'sya'], 'しゅ': ['shu', 'syu'], 'しょ': ['sho', 'syo'],
  'じゃ': ['ja', 'jya', 'zya'], 'じゅ': ['ju', 'jyu', 'zyu'], 'じょ': ['jo', 'jyo', 'zyo'],
  
  // た行の拗音
  'ちゃ': ['cha', 'tya'], 'ちゅ': ['chu', 'tyu'], 'ちょ': ['cho', 'tyo'],
  'ぢゃ': ['dya'], 'ぢゅ': ['dyu'], 'ぢょ': ['dyo'],
  
  // な行の拗音
  'にゃ': ['nya'], 'にゅ': ['nyu'], 'にょ': ['nyo'],
  
  // は行の拗音
  'ひゃ': ['hya'], 'ひゅ': ['hyu'], 'ひょ': ['hyo'],
  'びゃ': ['bya'], 'びゅ': ['byu'], 'びょ': ['byo'],
  'ぴゃ': ['pya'], 'ぴゅ': ['pyu'], 'ぴょ': ['pyo'],
  
  // ま行の拗音
  'みゃ': ['mya'], 'みゅ': ['myu'], 'みょ': ['myo'],
  
  // ら行の拗音
  'りゃ': ['rya'], 'りゅ': ['ryu'], 'りょ': ['ryo'],
  
  // 特殊な拗音
  'ふゃ': ['fya'], 'ふゅ': ['fyu'], 'ふょ': ['fyo'],

  'うぇ': ['we'], 'うぉ': ['wo'], // うぇ、うぉの拗音も追加
} as const;

// 拗音（2文字組み合わせ）のマッピングテーブル - 優先的にチェック（後方互換性）
export const YOON_MAP: Record<string, string> = {
  // か行の拗音
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  
  // さ行の拗音
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  
  // た行の拗音
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'ぢゃ': 'dya', 'ぢゅ': 'dyu', 'ぢょ': 'dyo',
  
  // な行の拗音
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  
  // は行の拗音
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  
  // ま行の拗音
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  
  // ら行の拗音
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  
  // 特殊な拗音
  'ふゃ': 'fya', 'ふゅ': 'fyu', 'ふょ': 'fyo',
} as const;

/**
 * 拗音パターンの配列を取得（TypingPractice での文字パース用）
 */
export const getYoonPatterns = (): string[] => {
  return Object.keys(MULTI_YOON_MAP);
};

/**
 * 指定された文字が拗音かどうかを判定
 */
export const isYoonCharacter = (char: string): boolean => {
  return char in MULTI_YOON_MAP;
};
