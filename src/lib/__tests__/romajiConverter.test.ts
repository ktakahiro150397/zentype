import { RomajiConverter } from '../romajiConverter'

describe('RomajiConverter', () => {
  let converter: RomajiConverter

  beforeEach(() => {
    converter = new RomajiConverter()
  })

  describe('convertToRomaji', () => {
    describe('基本的なひらがな変換', () => {
      test('あ行の変換', () => {
        expect(converter.convertToRomaji('あ')).toEqual({
          romaji: 'a',
          success: true
        })
        expect(converter.convertToRomaji('いう')).toEqual({
          romaji: 'iu',
          success: true
        })
        expect(converter.convertToRomaji('あいうえお')).toEqual({
          romaji: 'aiueo',
          success: true
        })
      })

      test('か行の変換', () => {
        expect(converter.convertToRomaji('か')).toEqual({
          romaji: 'ka',
          success: true
        })
        expect(converter.convertToRomaji('きく')).toEqual({
          romaji: 'kiku',
          success: true
        })
        expect(converter.convertToRomaji('かきくけこ')).toEqual({
          romaji: 'kakikukeko',
          success: true
        })
      })

      test('濁音の変換', () => {
        expect(converter.convertToRomaji('が')).toEqual({
          romaji: 'ga',
          success: true
        })
        expect(converter.convertToRomaji('ざじずぜぞ')).toEqual({
          romaji: 'zajizuzezo',
          success: true
        })
      })

      test('半濁音の変換', () => {
        expect(converter.convertToRomaji('ぱ')).toEqual({
          romaji: 'pa',
          success: true
        })
        expect(converter.convertToRomaji('ぱぴぷぺぽ')).toEqual({
          romaji: 'papipupepo',
          success: true
        })
      })

      test('特殊な文字の変換', () => {
        expect(converter.convertToRomaji('し')).toEqual({
          romaji: 'shi',
          success: true
        })
        expect(converter.convertToRomaji('ち')).toEqual({
          romaji: 'chi',
          success: true
        })
        expect(converter.convertToRomaji('つ')).toEqual({
          romaji: 'tsu',
          success: true
        })
        expect(converter.convertToRomaji('ふ')).toEqual({
          romaji: 'fu',
          success: true
        })
      })

      test('ん行の変換', () => {
        expect(converter.convertToRomaji('ん')).toEqual({
          romaji: 'n',
          success: true
        })
        expect(converter.convertToRomaji('こんにちは')).toEqual({
          romaji: 'konnichiha',
          success: true
        })
      })
    })

    describe('促音（っ）の処理', () => {
      test('基本的な促音変換', () => {
        expect(converter.convertToRomaji('っか')).toEqual({
          romaji: 'kka',
          success: true
        })
        expect(converter.convertToRomaji('っと')).toEqual({
          romaji: 'tto',
          success: true
        })
        expect(converter.convertToRomaji('っぱ')).toEqual({
          romaji: 'ppa',
          success: true
        })
      })

      test('特殊文字を含む促音変換', () => {
        expect(converter.convertToRomaji('っち')).toEqual({
          romaji: 'tchi',
          success: true
        })
        expect(converter.convertToRomaji('っつ')).toEqual({
          romaji: 'ttsu',
          success: true
        })
        expect(converter.convertToRomaji('っし')).toEqual({
          romaji: 'sshi',
          success: true
        })
      })

      test('促音が最後にある場合', () => {
        expect(converter.convertToRomaji('あっ')).toEqual({
          romaji: 'atsu',
          success: true
        })
      })

      test('複数の促音', () => {
        expect(converter.convertToRomaji('がっこう')).toEqual({
          romaji: 'gakkou',
          success: true
        })
        expect(converter.convertToRomaji('きっと')).toEqual({
          romaji: 'kitto',
          success: true
        })
      })
    })

    describe('拗音（ゃゅょ）の処理', () => {
      test('か行の拗音変換', () => {
        expect(converter.convertToRomaji('きゃ')).toEqual({
          romaji: 'kya',
          success: true
        })
        expect(converter.convertToRomaji('きゅ')).toEqual({
          romaji: 'kyu',
          success: true
        })
        expect(converter.convertToRomaji('きょ')).toEqual({
          romaji: 'kyo',
          success: true
        })
        expect(converter.convertToRomaji('ぎゃぎゅぎょ')).toEqual({
          romaji: 'gyagyugyo',
          success: true
        })
      })

      test('さ行の拗音変換', () => {
        expect(converter.convertToRomaji('しゃ')).toEqual({
          romaji: 'sha',
          success: true
        })
        expect(converter.convertToRomaji('しゅ')).toEqual({
          romaji: 'shu',
          success: true
        })
        expect(converter.convertToRomaji('しょ')).toEqual({
          romaji: 'sho',
          success: true
        })
        expect(converter.convertToRomaji('じゃじゅじょ')).toEqual({
          romaji: 'jajujo',
          success: true
        })
      })

      test('た行の拗音変換', () => {
        expect(converter.convertToRomaji('ちゃ')).toEqual({
          romaji: 'cha',
          success: true
        })
        expect(converter.convertToRomaji('ちゅ')).toEqual({
          romaji: 'chu',
          success: true
        })
        expect(converter.convertToRomaji('ちょ')).toEqual({
          romaji: 'cho',
          success: true
        })
      })

      test('な行の拗音変換', () => {
        expect(converter.convertToRomaji('にゃ')).toEqual({
          romaji: 'nya',
          success: true
        })
        expect(converter.convertToRomaji('にゅ')).toEqual({
          romaji: 'nyu',
          success: true
        })
        expect(converter.convertToRomaji('にょ')).toEqual({
          romaji: 'nyo',
          success: true
        })
      })

      test('は行の拗音変換', () => {
        expect(converter.convertToRomaji('ひゃ')).toEqual({
          romaji: 'hya',
          success: true
        })
        expect(converter.convertToRomaji('びゃ')).toEqual({
          romaji: 'bya',
          success: true
        })
        expect(converter.convertToRomaji('ぴゃ')).toEqual({
          romaji: 'pya',
          success: true
        })
      })

      test('ま行とら行の拗音変換', () => {
        expect(converter.convertToRomaji('みゃ')).toEqual({
          romaji: 'mya',
          success: true
        })
        expect(converter.convertToRomaji('りゃ')).toEqual({
          romaji: 'rya',
          success: true
        })
        expect(converter.convertToRomaji('りゅ')).toEqual({
          romaji: 'ryu',
          success: true
        })
        expect(converter.convertToRomaji('りょ')).toEqual({
          romaji: 'ryo',
          success: true
        })
      })

      test('複合的な拗音を含む文章', () => {
        expect(converter.convertToRomaji('きょう')).toEqual({
          romaji: 'kyou',
          success: true
        })
        expect(converter.convertToRomaji('しゃしん')).toEqual({
          romaji: 'shashin',
          success: true
        })
        expect(converter.convertToRomaji('びょういん')).toEqual({
          romaji: 'byouin',
          success: true
        })
        expect(converter.convertToRomaji('ちゅうがっこう')).toEqual({
          romaji: 'chuugakkou',
          success: true
        })
      })

      test('拗音と促音の組み合わせ', () => {
        expect(converter.convertToRomaji('っきゃ')).toEqual({
          romaji: 'kkya',
          success: true
        })
        expect(converter.convertToRomaji('っちゃ')).toEqual({
          romaji: 'tcha',
          success: true
        })
      })
    })

    describe('複雑な文字列の変換', () => {
      test('日常的な単語', () => {
        expect(converter.convertToRomaji('こんにちは')).toEqual({
          romaji: 'konnichiha',
          success: true
        })
        expect(converter.convertToRomaji('ありがとう')).toEqual({
          romaji: 'arigatou',
          success: true
        })
        expect(converter.convertToRomaji('おはよう')).toEqual({
          romaji: 'ohayou',
          success: true
        })
      })

      test('促音を含む単語', () => {
        expect(converter.convertToRomaji('がっこう')).toEqual({
          romaji: 'gakkou',
          success: true
        })
        expect(converter.convertToRomaji('きっぷ')).toEqual({
          romaji: 'kippu',
          success: true
        })
        expect(converter.convertToRomaji('せっけん')).toEqual({
          romaji: 'sekken',
          success: true
        })
      })
    })

    describe('エッジケース', () => {
      test('空文字の処理', () => {
        expect(converter.convertToRomaji('')).toEqual({
          romaji: '',
          success: true
        })
      })

      test('スペースと記号の処理', () => {
        expect(converter.convertToRomaji('　')).toEqual({
          romaji: ' ',
          success: true
        })
        expect(converter.convertToRomaji('。')).toEqual({
          romaji: '.',
          success: true
        })
        expect(converter.convertToRomaji('、')).toEqual({
          romaji: ',',
          success: true
        })
      })

      test('サポートされていない文字', () => {
        const result = converter.convertToRomaji('あx')
        expect(result.success).toBe(true)
        expect(result.romaji).toBe('ax') // そのまま追加
      })
    })
  })

  describe('validateInput', () => {
    describe('基本的な入力検証', () => {
      test('完全一致の場合', () => {
        const result = converter.validateInput('あ', 'a')
        expect(result.isValid).toBe(true)
        expect(result.expectedNext).toBe('')
      })

      test('前方一致（入力途中）の場合', () => {
        const result = converter.validateInput('か', 'k')
        expect(result.isValid).toBe(true)
        expect(result.expectedNext).toBe('a')
      })

      test('不正な入力の場合', () => {
        const result = converter.validateInput('か', 'x')
        expect(result.isValid).toBe(false)
        expect(result.expectedNext).toBe('k')
        expect(result.error).toContain('Expected "k"')
      })
    })

    describe('複雑な文字列の検証', () => {
      test('複数文字の前方一致', () => {
        const result = converter.validateInput('こんにちは', 'kon')
        expect(result.isValid).toBe(true)
        expect(result.expectedNext).toBe('n')
      })

      test('促音を含む検証', () => {
        const result = converter.validateInput('がっこう', 'gak')
        expect(result.isValid).toBe(true)
        expect(result.expectedNext).toBe('k')
      })

      test('特殊文字を含む検証', () => {
        const result = converter.validateInput('ちいさい', 'chi')
        expect(result.isValid).toBe(true)
        expect(result.expectedNext).toBe('i')
      })
    })

    describe('エッジケース検証', () => {
      test('空文字の検証', () => {
        const result = converter.validateInput('', '')
        expect(result.isValid).toBe(true)
        expect(result.expectedNext).toBe('')
      })

      test('空文字に対する入力', () => {
        const result = converter.validateInput('', 'a')
        expect(result.isValid).toBe(false)
      })
    })

    describe('拗音の入力検証', () => {
      test('拗音の完全一致', () => {
        expect(converter.validateInput('きゃ', 'kya')).toEqual({
          isValid: true,
          expectedNext: ''
        })
        expect(converter.validateInput('しゅ', 'shu')).toEqual({
          isValid: true,
          expectedNext: ''
        })
        expect(converter.validateInput('ちょ', 'cho')).toEqual({
          isValid: true,
          expectedNext: ''
        })
      })

      test('拗音の前方一致（入力途中）', () => {
        // 「きゃ」を入力中
        expect(converter.validateInput('きゃ', 'k')).toEqual({
          isValid: true,
          expectedNext: 'y'
        })
        expect(converter.validateInput('きゃ', 'ky')).toEqual({
          isValid: true,
          expectedNext: 'a'
        })
        
        // 「しゃ」を入力中
        expect(converter.validateInput('しゃ', 's')).toEqual({
          isValid: true,
          expectedNext: 'h'
        })
        expect(converter.validateInput('しゃ', 'sh')).toEqual({
          isValid: true,
          expectedNext: 'a'
        })
      })

      test('拗音の間違った入力', () => {
        // 「きゃ」を「kiya」として入力しようとした場合
        const result = converter.validateInput('きゃ', 'ki')
        expect(result.isValid).toBe(false)
        
        // 「しゃ」を「siya」として入力しようとした場合
        const result2 = converter.validateInput('しゃ', 'si')
        expect(result2.isValid).toBe(false)
      })

      test('複合的な拗音を含む文章の検証', () => {
        // 「きょう」の入力検証
        expect(converter.validateInput('きょう', 'kyo')).toEqual({
          isValid: true,
          expectedNext: 'u'
        })
        expect(converter.validateInput('きょう', 'kyou')).toEqual({
          isValid: true,
          expectedNext: ''
        })
        
        // 「しゃしん」の入力検証
        expect(converter.validateInput('しゃしん', 'shas')).toEqual({
          isValid: true,
          expectedNext: 'h'
        })
        expect(converter.validateInput('しゃしん', 'shashin')).toEqual({
          isValid: true,
          expectedNext: ''
        })
      })
    })
  })

  describe('getSupportedCharacters', () => {
    test('サポートされている文字一覧を取得', () => {
      const chars = converter.getSupportedCharacters()
      expect(chars).toContain('あ')
      expect(chars).toContain('か')
      expect(chars).toContain('さ')
      expect(chars).toContain('っ')
      expect(chars).toContain('ん')
      expect(chars.length).toBeGreaterThan(50) // 基本的なひらがなが含まれていることを確認
    })
  })

  describe('内部メソッドのテスト（間接的）', () => {
    test('子音抽出の動作確認（促音処理経由）', () => {
      // getConsonantメソッドの動作を促音処理経由で確認
      expect(converter.convertToRomaji('っか').romaji).toBe('kka')
      expect(converter.convertToRomaji('っち').romaji).toBe('tchi')
      expect(converter.convertToRomaji('っし').romaji).toBe('sshi')
      expect(converter.convertToRomaji('っつ').romaji).toBe('ttsu')
    })
  })
})
