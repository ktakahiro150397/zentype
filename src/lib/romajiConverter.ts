/**
 * ローマ字変換ライブラリ
 * ひらがなからローマ字への変換を行う
 */

// 複数パターン拗音マッピングテーブル - 複数の入力方法をサポート
const MULTI_YOON_MAP: Record<string, string[]> = {
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
}

// 拗音（2文字組み合わせ）のマッピングテーブル - 優先的にチェック（後方互換性）
const YOON_MAP: Record<string, string> = {
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
}

// 複数パターン基本ひらがなマッピングテーブル
const MULTI_HIRAGANA_MAP: Record<string, string[]> = {
  // あ行
  'あ': ['a'], 'い': ['i'], 'う': ['u'], 'え': ['e'], 'お': ['o'],
  
  // か行 - 複数パターン対応
  'か': ['ka', 'ca'], 'き': ['ki'], 'く': ['ku'], 'け': ['ke'], 'こ': ['ko'],
  'が': ['ga'], 'ぎ': ['gi'], 'ぐ': ['gu'], 'げ': ['ge'], 'ご': ['go'],
  
  // さ行
  'さ': ['sa'], 'し': ['shi', 'si'], 'す': ['su'], 'せ': ['se'], 'そ': ['so'],
  'ざ': ['za'], 'じ': ['ji', 'zi'], 'ず': ['zu'], 'ぜ': ['ze'], 'ぞ': ['zo'],
  
  // た行
  'た': ['ta'], 'ち': ['chi', 'ti'], 'つ': ['tsu', 'tu'], 'て': ['te'], 'と': ['to'],
  'だ': ['da'], 'ぢ': ['di'], 'づ': ['du'], 'で': ['de'], 'ど': ['do'],
  
  // な行
  'な': ['na'], 'に': ['ni'], 'ぬ': ['nu'], 'ね': ['ne'], 'の': ['no'],
  
  // は行
  'は': ['ha'], 'ひ': ['hi'], 'ふ': ['fu', 'hu'], 'へ': ['he'], 'ほ': ['ho'],
  'ば': ['ba'], 'び': ['bi'], 'ぶ': ['bu'], 'べ': ['be'], 'ぼ': ['bo'],
  'ぱ': ['pa'], 'ぴ': ['pi'], 'ぷ': ['pu'], 'ぺ': ['pe'], 'ぽ': ['po'],
  
  // ま行
  'ま': ['ma'], 'み': ['mi'], 'む': ['mu'], 'め': ['me'], 'も': ['mo'],
  
  // や行
  'や': ['ya'], 'ゆ': ['yu'], 'よ': ['yo'],
  
  // ら行
  'ら': ['ra'], 'り': ['ri'], 'る': ['ru'], 'れ': ['re'], 'ろ': ['ro'],
  
  // わ行
  'わ': ['wa'], 'ゐ': ['wi'], 'ゑ': ['we'], 'を': ['wo', 'o'], 'ん': ['n', 'nn'],
  
  // 小文字
  'ゃ': ['ya'], 'ゅ': ['yu'], 'ょ': ['yo'],
  'ぁ': ['a'], 'ぃ': ['i'], 'ぅ': ['u'], 'ぇ': ['e'], 'ぉ': ['o'],
  
  // 促音 - 複数パターン
  'っ': ['ltu', 'xtu', 'ltsu'],
  
  // 記号・その他
  'ー': ['-'], '。': ['.'], '、': [','], '？': ['?'], '！': ['!'],
  '　': [' '], ' ': [' ']
}

// 基本的なひらがな→ローマ字変換テーブル（後方互換性）
const HIRAGANA_TO_ROMAJI_MAP: Record<string, string> = {
  // あ行
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  
  // か行
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  
  // さ行
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  
  // た行
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
  
  // な行
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  
  // は行
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  
  // ま行
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  
  // や行
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  
  // ら行
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  
  // わ行
  'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n',
  
  // 小文字
  'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo',
  'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o',
  
  // 促音
  'っ': '', // 促音は特別処理するため空文字
  
  // 記号・その他
  'ー': '-', '。': '.', '、': ',', '？': '?', '！': '!',
  '　': ' ', ' ': ' '
}

export interface RomajiConversionResult {
  romaji: string
  success: boolean
  error?: string
}

export interface MultiPatternConversionResult {
  patterns: string[]
  success: boolean
  error?: string
}

export interface ValidationResult {
  isValid: boolean
  expectedNext: string
  error?: string
}

export interface MultiPatternValidationResult {
  isValid: boolean
  matchingPatterns: string[]
  expectedNextChars: string[]
  error?: string
}

export class RomajiConverter {
  /**
   * ひらがな文字列をローマ字に変換する（複数パターン対応）
   * @param hiragana ひらがな文字列
   * @returns 複数パターンの変換結果
   */
  convertToRomajiMultiPattern(hiragana: string): MultiPatternConversionResult {
    if (!hiragana) {
      return {
        patterns: [''],
        success: true
      }
    }

    try {
      const patterns = this.generateAllPatterns(hiragana)
      return {
        patterns,
        success: true
      }
    } catch (error) {
      return {
        patterns: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * 複数パターン入力検証
   * @param hiragana 元のひらがな文字列
   * @param romajiInput 入力されたローマ字
   * @returns 複数パターン検証結果
   */
  validateInputMultiPattern(hiragana: string, romajiInput: string): MultiPatternValidationResult {
    if (!hiragana) {
      return {
        isValid: romajiInput === '',
        matchingPatterns: [''],
        expectedNextChars: ['']
      }
    }

    const conversion = this.convertToRomajiMultiPattern(hiragana)
    if (!conversion.success) {
      return {
        isValid: false,
        matchingPatterns: [],
        expectedNextChars: [],
        error: conversion.error
      }
    }

    const allPatterns = conversion.patterns
    const matchingPatterns: string[] = []
    const expectedNextChars: string[] = []

    // 各パターンに対して検証
    for (const pattern of allPatterns) {
      // 完全一致チェック
      if (romajiInput === pattern) {
        matchingPatterns.push(pattern)
        expectedNextChars.push('')
        continue
      }
      
      // 前方一致チェック（入力途中）
      if (pattern.startsWith(romajiInput)) {
        matchingPatterns.push(pattern)
        const nextChar = pattern[romajiInput.length] || ''
        if (nextChar && !expectedNextChars.includes(nextChar)) {
          expectedNextChars.push(nextChar)
        }
      }
    }

    const isValid = matchingPatterns.length > 0

    return {
      isValid,
      matchingPatterns,
      expectedNextChars,
      error: isValid ? undefined : `Input "${romajiInput}" doesn't match any valid pattern`
    }
  }
  /**
   * すべての可能なローマ字パターンを生成する
   * @param hiragana ひらがな文字列
   * @returns すべてのパターン
   */
  private generateAllPatterns(hiragana: string): string[] {
    const results: string[] = ['']
    
    let i = 0
    while (i < hiragana.length) {
      const char = hiragana[i]
      const newResults: string[] = []
        // 促音（っ）の処理
      if (char === 'っ') {
        const nextChar = hiragana[i + 1]
        if (nextChar) {
          // 拗音チェック
          if (i + 2 < hiragana.length) {
            const twoChar = hiragana.substring(i + 1, i + 3)
            if (MULTI_YOON_MAP[twoChar]) {
              // 促音 + 拗音の場合
              const yoonPatterns = MULTI_YOON_MAP[twoChar]
              for (const result of results) {
                for (const pattern of yoonPatterns) {
                  const consonant = this.getConsonant(pattern)
                  newResults.push(result + consonant + pattern)
                }
              }
              results.splice(0, results.length, ...newResults)
              i += 3 // 3文字分進める（っ + 拗音2文字）
              continue
            }
          }
          
          // 通常の促音処理（次の文字の子音重複）
          const nextPatterns = MULTI_HIRAGANA_MAP[nextChar] || [nextChar]
          for (const result of results) {
            for (const pattern of nextPatterns) {
              const consonant = this.getConsonant(pattern)
              newResults.push(result + consonant + pattern)
            }
          }
          results.splice(0, results.length, ...newResults)
          i += 2 // 2文字分進める（っ + 次の文字）
          continue
        } else {
          // 促音の単体パターン
          const sokuonPatterns = MULTI_HIRAGANA_MAP['っ'] || ['ltu']
          for (const result of results) {
            for (const pattern of sokuonPatterns) {
              newResults.push(result + pattern)
            }
          }
          results.splice(0, results.length, ...newResults)
          i++
          continue
        }
      }
      
      // 拗音（2文字組み合わせ）の処理を優先
      if (i + 1 < hiragana.length) {
        const twoChar = hiragana.substring(i, i + 2)
        if (MULTI_YOON_MAP[twoChar]) {
          const patterns = MULTI_YOON_MAP[twoChar]
          for (const result of results) {
            for (const pattern of patterns) {
              newResults.push(result + pattern)
            }
          }
          results.splice(0, results.length, ...newResults)
          i += 2 // 2文字分進める
          continue
        }
      }
      
      // 通常の文字変換
      const patterns = MULTI_HIRAGANA_MAP[char] || [char]
      for (const result of results) {
        for (const pattern of patterns) {
          newResults.push(result + pattern)
        }
      }
      
      results.splice(0, results.length, ...newResults)
      i++
    }
    
    // 最終的な重複削除
    return [...new Set(results)]
  }
  /**
   * 促音処理のための次の文字の子音パターンを取得
   * @param nextChar 次の文字
   * @param fullText 全体のテキスト
   * @param position 位置
   * @returns 子音パターンの配列
   */
  private getConsonantPatternsForNext(nextChar: string, fullText: string, position: number): string[] {
    // 拗音チェック
    if (position + 1 < fullText.length) {
      const twoChar = fullText.substring(position, position + 2)
      if (MULTI_YOON_MAP[twoChar]) {
        const yoonPatterns = MULTI_YOON_MAP[twoChar]
        return yoonPatterns.map(pattern => this.getConsonant(pattern))
      }
    }
    
    // 通常の文字の子音を取得
    const patterns = MULTI_HIRAGANA_MAP[nextChar] || [nextChar]
    const consonants = patterns.map(pattern => this.getConsonant(pattern))
    // 重複削除して返す
    return [...new Set(consonants)]
  }

  /**
   * ひらがな文字列をローマ字に変換する
   * @param hiragana ひらがな文字列
   * @returns 変換結果
   */
  convertToRomaji(hiragana: string): RomajiConversionResult {
    if (!hiragana) {
      return {
        romaji: '',
        success: true
      }
    }

    try {
      let result = ''
      let i = 0
        while (i < hiragana.length) {
        const char = hiragana[i]
        
        // 促音（っ）の処理
        if (char === 'っ') {
          const nextChar = hiragana[i + 1]
          if (nextChar && HIRAGANA_TO_ROMAJI_MAP[nextChar]) {
            // 次の文字の子音を重複させる
            const nextRomaji = HIRAGANA_TO_ROMAJI_MAP[nextChar]
            const consonant = this.getConsonant(nextRomaji)
            result += consonant
          } else {
            // 次の文字がない場合やマッピングがない場合
            result += 'tsu'
          }
          i++
          continue
        }
        
        // 拗音（2文字組み合わせ）の処理を優先
        if (i + 1 < hiragana.length) {
          const twoChar = hiragana.substring(i, i + 2)
          if (YOON_MAP[twoChar]) {
            result += YOON_MAP[twoChar]
            i += 2 // 2文字分進める
            continue
          }
        }
        
        // 通常の文字変換
        if (HIRAGANA_TO_ROMAJI_MAP[char]) {
          result += HIRAGANA_TO_ROMAJI_MAP[char]
        } else {
          // マッピングがない文字はそのまま追加
          result += char
        }
        
        i++
      }
      
      return {
        romaji: result,
        success: true
      }
    } catch (error) {
      return {
        romaji: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * 入力されたローマ字が正しいかを検証する
   * @param hiragana 元のひらがな文字列
   * @param romajiInput 入力されたローマ字
   * @param position 現在の入力位置（文字数）
   * @returns 検証結果
   */
  validateInput(hiragana: string, romajiInput: string, position: number = 0): ValidationResult {
    if (!hiragana) {
      return {
        isValid: romajiInput === '',
        expectedNext: ''
      }
    }

    const conversion = this.convertToRomaji(hiragana)
    if (!conversion.success) {
      return {
        isValid: false,
        expectedNext: '',
        error: conversion.error
      }
    }

    const expectedRomaji = conversion.romaji
    
    // 完全一致チェック
    if (romajiInput === expectedRomaji) {
      return {
        isValid: true,
        expectedNext: ''
      }
    }
    
    // 前方一致チェック（入力途中）
    if (expectedRomaji.startsWith(romajiInput)) {
      const nextChar = expectedRomaji[romajiInput.length] || ''
      return {
        isValid: true,
        expectedNext: nextChar
      }
    }    // 一致しない場合
    // 入力位置での期待文字を取得（入力が間違っている場合は、その位置での正しい文字）
    const expectedChar = romajiInput.length > 0 && romajiInput.length <= expectedRomaji.length
      ? expectedRomaji[romajiInput.length - 1]  // 最後に入力した位置での正しい文字
      : expectedRomaji[romajiInput.length] || ''  // 次に入力すべき文字
    
    const actualChar = romajiInput.length > 0 
      ? romajiInput[romajiInput.length - 1] 
      : ''
    
    return {
      isValid: false,
      expectedNext: expectedChar,
      error: `Expected "${expectedChar}" but got "${actualChar}"`
    }
  }
  /**
   * ローマ字から子音を取得する（促音処理用）
   * @param romaji ローマ字
   * @returns 子音
   */
  private getConsonant(romaji: string): string {
    if (!romaji) return ''
    
    // 特殊ケースの処理
    const consonantMap: Record<string, string> = {
      'chi': 't',
      'tsu': 't',
      'tu': 't',
      'shi': 's',
      'si': 's',
      'fu': 'f',
      'hu': 'h',
      'ji': 'j',
      'zi': 'z',
      'cha': 't',
      'tya': 't',
      'chu': 't',
      'tyu': 't',
      'cho': 't',
      'tyo': 't'
    }
    
    if (consonantMap[romaji]) {
      return consonantMap[romaji]
    }
    
    // 一般的なケース：最初の子音を返す
    const firstChar = romaji[0]
    if (firstChar && /[bcdfghjklmnpqrstvwxyz]/i.test(firstChar)) {
      return firstChar
    }
    
    return ''
  }

  /**
   * 複数パターンサポートの文字一覧を取得する（デバッグ用）
   * @returns サポートされているひらがな文字とそのパターン
   */
  getMultiPatternCharacters(): Record<string, string[]> {
    return { ...MULTI_HIRAGANA_MAP, ...MULTI_YOON_MAP }
  }

  /**
   * 利用可能な文字一覧を取得する（デバッグ用）
   * @returns サポートされているひらがな文字の配列
   */
  getSupportedCharacters(): string[] {
    return Object.keys(HIRAGANA_TO_ROMAJI_MAP)
  }
}

// デフォルトインスタンスをエクスポート
export const romajiConverter = new RomajiConverter()
