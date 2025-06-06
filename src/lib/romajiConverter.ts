/**
 * ローマ字変換ライブラリ
 * ひらがなからローマ字への変換を行う
 */

// 拗音（2文字組み合わせ）のマッピングテーブル - 優先的にチェック
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

// 基本的なひらがな→ローマ字変換テーブル
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

export interface ValidationResult {
  isValid: boolean
  expectedNext: string
  error?: string
}

export class RomajiConverter {
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
      'shi': 's',
      'fu': 'f'
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
   * 利用可能な文字一覧を取得する（デバッグ用）
   * @returns サポートされているひらがな文字の配列
   */
  getSupportedCharacters(): string[] {
    return Object.keys(HIRAGANA_TO_ROMAJI_MAP)
  }
}

// デフォルトインスタンスをエクスポート
export const romajiConverter = new RomajiConverter()
