"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTypingStats } from "@/hooks/useTypingStats";
import { dataService } from "@/lib/dataService";
import { useMockAuth } from "@/components/MockAuthProvider";
import { RomajiConverter } from "@/lib/romajiConverter";
import { getYoonPatterns } from "@/lib/mappings/kanaPatterns";

interface TypingPracticeProps {
  text: string;
  displayText?: string; // 表示用テキスト（日本語の場合はひらがな）
  inputText?: string; // 入力対象テキスト（日本語の場合はローマ字）
  language?: "english" | "japanese";
  textId: string;
  onComplete?: (stats: {
    wpm: number;
    accuracy: number;
    errors: number;
    time_taken: number;
  }) => void;
}

export function TypingPractice({
  text,
  displayText,
  inputText,
  language = "english",
  textId,
  onComplete,
}: TypingPracticeProps) {
  const { user } = useMockAuth();

  // 言語に応じてテキストを設定
  const practiceText = language === "japanese" ? inputText || text : text;
  const showText = language === "japanese" ? displayText || text : text;

  // ローマ字変換インスタンス（useMemoで最適化）
  const romajiConverter = useMemo(
    () => (language === "japanese" ? new RomajiConverter() : null),
    [language]
  );

  const [currentInput, setCurrentInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mistakes, setMistakes] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isWaitingForCorrectKey, setIsWaitingForCorrectKey] = useState(false);
  const [romajiProgress, setRomajiProgress] = useState<{
    [key: number]: { 
      completed: string; 
      remaining: string; 
      hasError: boolean;
      actualPattern?: string; // 実際に入力されたパターンを記録
    };
  }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = useTypingStats({
    text,
    currentInput,
    startTime,
    mistakes,
  });

  // Save result to database
  const saveResult = useCallback(async () => {
    if (!user?.id || !startTime) return;

    try {
      const finalStats = {
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        errors: stats.mistakeCount,
        time_taken: stats.duration,
      };

      await dataService.saveSessionResult({
        user_id: user.id,
        wpm: finalStats.wpm,
        accuracy: finalStats.accuracy,
        text_id: textId,
        text_content: text,
        time_taken: finalStats.time_taken,
        errors: finalStats.errors,
      });

      if (onComplete) {
        onComplete(finalStats);
      }
    } catch (error) {
      console.error("Error saving result:", error);
    }
  }, [user?.id, startTime, stats, textId, text, onComplete]);

  // Reset function
  const reset = useCallback(() => {
    setCurrentInput("");
    setCurrentIndex(0);
    setStartTime(null);
    setIsCompleted(false);
    setMistakes([]);
    setIsActive(false);
    setIsWaitingForCorrectKey(false);
    setRomajiProgress({});
    containerRef.current?.focus();
  }, []);

  // Handle key down event
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if not focused or completed
      if (!isFocused || isCompleted) return;

      // Start timing on first key press
      if (!startTime && !isActive) {
        setStartTime(new Date());
        setIsActive(true);
      }

      // Handle special keys
      if (e.key === "Escape") {
        reset();
        return;
      }

      // Ignore non-printable characters except space
      if (e.key.length > 1 && e.key !== " ") return;

      if (language === "japanese" && romajiConverter) {
        // 日本語モード: ローマ字入力処理
        const newInput = currentInput + e.key;

        // パースされた文字グループを取得
        const parsedChars = parseHiraganaText(practiceText);
        const currentCharGroup = parsedChars[currentIndex];
        if (!currentCharGroup) return; // 範囲外の場合は無視

        const currentChar = currentCharGroup.char;
        const conversion = romajiConverter.convertToRomaji(currentChar);
        const expectedRomaji = conversion.romaji;

        // 入力検証 - 複数パターン対応
        const validation = romajiConverter.validateInputMultiPattern(
          currentChar,
          newInput
        );

        // ローマ字進捗を更新
        const targetRomaji =
          romajiConverter.convertToRomaji(currentChar).romaji;
        setRomajiProgress((prev) => ({
          ...prev,
          [currentIndex]: {
            completed: validation.isValid ? newInput : newInput.slice(0, -1),
            remaining: targetRomaji.slice(
              validation.isValid ? newInput.length : newInput.length - 1
            ),
            hasError: !validation.isValid,
          },
        }));

        if (validation.isValid) {
          setIsWaitingForCorrectKey(false);

          // 完了チェック - いずれかのパターンで完全一致
          const isComplete = validation.matchingPatterns.some(pattern => pattern === newInput);
          
          if (isComplete) {
            // 実際に入力されたパターンを記録
            setRomajiProgress((prev) => ({
              ...prev,
              [currentIndex]: {
                completed: newInput,
                remaining: "",
                hasError: false,
                actualPattern: newInput, // 実際に入力されたパターンを保存
              },
            }));

            // 現在の文字完成、次の文字へ
            setCurrentIndex((prev) => prev + 1);
            setCurrentInput("");

            // 全体完了チェック - パースされた文字グループの数を使用
            const parsedChars = parseHiraganaText(practiceText);
            if (currentIndex + 1 >= parsedChars.length) {
              setIsCompleted(true);
              setIsActive(false);
              saveResult();
            }
          } else {
            // まだ入力途中
            setCurrentInput(newInput);
          }
        } else {
          // 間違ったキー入力
          if (!mistakes.includes(currentIndex)) {
            setMistakes((prev: number[]) => [...prev, currentIndex]);
          }
          setIsWaitingForCorrectKey(true);
        }
      } else {
        // 英語モード: 従来の処理
        const expectedChar = practiceText[currentIndex];
        const typedChar = e.key;

        if (typedChar === expectedChar) {
          // Correct key pressed
          setIsWaitingForCorrectKey(false);
          const newInput = currentInput + typedChar;
          setCurrentInput(newInput);
          setCurrentIndex((prev: number) => prev + 1);

          // Check for completion
          if (newInput.length === practiceText.length) {
            setIsCompleted(true);
            setIsActive(false);
            saveResult();
          }
        } else {
          // Wrong key pressed
          if (!mistakes.includes(currentIndex)) {
            setMistakes((prev: number[]) => [...prev, currentIndex]);
          }
          setIsWaitingForCorrectKey(true);
        }
      }
    },
    [
      practiceText,
      currentInput,
      currentIndex,
      startTime,
      isActive,
      isFocused,
      isCompleted,
      mistakes,
      language,
      romajiConverter,
      romajiProgress,
      reset,
      saveResult,
    ]
  );

  // Keyboard shortcuts and focus management
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        reset();
      }
    };

    // Add event listener to container when focused
    const container = containerRef.current;
    if (isFocused && container) {
      container.addEventListener("keydown", handleKeyDown);
    }

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      if (container) {
        container.removeEventListener("keydown", handleKeyDown);
      }
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [handleKeyDown, isFocused, reset]);

  // Auto-focus on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Render character with styling
  const renderCharacter = (char: string, index: number) => {
    let className = "text-gray-400";

    if (index < currentIndex) {
      if (mistakes.includes(index)) {
        className = "bg-red-200 text-red-800";
      } else {
        className = "text-green-600 bg-green-50";
      }
    } else if (index === currentIndex) {
      if (isWaitingForCorrectKey) {
        className = "text-gray-900 bg-red-300 animate-pulse"; // error state
      } else {
        className = "text-gray-900 bg-blue-200"; // cursor position
      }
    }
    return (
      <span key={index} className={className}>
        {char === " " ? "\u00A0" : char}
      </span>
    );
  };

  // Parse hiragana text with yoon priority
  const parseHiraganaText = (text: string) => {
    const result: { char: string; originalIndex: number }[] = [];
    let i = 0;
    let originalIndex = 0;

    while (i < text.length) {
      // Check for 2-character yoon first
      if (i + 1 < text.length) {
        const twoChar = text.substring(i, i + 2);
        // Check if it's a valid yoon combination using shared mapping
        const yoonPatterns = getYoonPatterns();
        
        if (yoonPatterns.includes(twoChar)) {
          result.push({ char: twoChar, originalIndex });
          i += 2;
          originalIndex++;
          continue;
        }
      }
      
      // Single character
      result.push({ char: text[i], originalIndex });
      i++;
      originalIndex++;
    }
    
    return result;
  };

  // Render Romaji with highlighting for Japanese mode
  const renderRomajiDisplay = () => {
    if (language !== "japanese" || !romajiConverter) return null;

    const parsedChars = parseHiraganaText(practiceText);

    return (
      <div className="text-lg md:text-xl leading-normal font-mono break-all">
        <div className="font-medium text-sm text-gray-500 mb-2 text-left">
          入力対象（ローマ字）:
        </div>
        <div className="text-left leading-normal">
          {parsedChars.map(({ char, originalIndex }, index) => {
            // 複数パターン対応 - 最初のパターンを表示用として使用
            const conversionResult = romajiConverter.convertToRomajiMultiPattern(char);
            const targetRomaji = conversionResult.success && conversionResult.patterns.length > 0 
              ? conversionResult.patterns[0] 
              : romajiConverter.convertToRomaji(char).romaji;

            let containerClassName = "inline px-1 py-0.5 rounded";
            let completedText = "";
            let remainingText = targetRomaji;
            let hasError = false;

            if (index < currentIndex) {
              // 完了済み文字 - 実際に入力されたパターンを表示
              containerClassName += " bg-green-100 text-green-800";
              const progress = romajiProgress[index];
              completedText = progress?.actualPattern || targetRomaji;
              remainingText = "";
            } else if (index === currentIndex) {
              // 現在入力中の文字
              const progress = romajiProgress[index];
              if (progress) {
                completedText = progress.completed;
                remainingText = progress.remaining;
                hasError = progress.hasError;
              } else {
                // 入力進捗を計算 - 複数パターン対応
                const validation = romajiConverter.validateInputMultiPattern(
                  char,
                  currentInput
                );
                completedText = currentInput;
                
                // 現在入力中のパターンに基づいて残りテキストを計算
                if (validation.isValid && validation.matchingPatterns.length > 0) {
                  // 最も短いマッチングパターンを基準にする（より進捗が見える）
                  const shortestPattern = validation.matchingPatterns.reduce((shortest, current) => 
                    current.length < shortest.length ? current : shortest
                  );
                  remainingText = shortestPattern.slice(currentInput.length);
                } else {
                  remainingText = targetRomaji.slice(currentInput.length);
                }
                
                hasError = !validation.isValid && currentInput.length > 0;
              }

              if (hasError) {
                containerClassName += " bg-red-100 text-red-800 animate-pulse";
              } else {
                containerClassName += " bg-blue-100 text-blue-800";
              }
            } else {
              // 未入力文字
              containerClassName += " bg-gray-100 text-gray-600";
            }

            return (
              <span key={index} className={containerClassName}>
                {completedText && (
                  <span className="text-green-700 font-semibold">
                    {completedText}
                  </span>
                )}
                {remainingText && (
                  <span className={hasError ? "text-red-500" : "text-gray-500"}>
                    {remainingText}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-2 md:p-4 space-y-6">
      {/* Stats Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.wpm}</div>
          <div className="text-sm text-gray-600">WPM</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {stats.accuracy}%
          </div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {stats.mistakeCount}
          </div>
          <div className="text-sm text-gray-600">Errors</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {stats.duration}s
          </div>
          <div className="text-sm text-gray-600">Time</div>
        </div>
      </div>{" "}
      {/* Main Typing Area */}
      <div
        ref={containerRef}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          bg-white p-3 md:p-4 rounded-lg cursor-text outline-none transition-all duration-300
          ${
            isFocused
              ? "border-2 border-blue-500 bg-blue-50/30 shadow-lg"
              : "border-2 border-gray-200 hover:border-gray-300"
          }
          ${isCompleted ? "border-green-400 bg-green-50/30" : ""}
        `}
      >
        {" "}
        {/* Instruction Text with smooth animation */}
        <div
          className={`text-center overflow-hidden transition-all duration-200 ease-in-out ${
            !isActive && !isCompleted
              ? "max-h-0 opacity-0 mb-0"
              : "max-h-0 opacity-0 mb-0"
          }`}
        ></div>
        {/* Text Display */}
        <div className="space-y-4">
          {/* 日本語モードでは表示テキスト（ひらがな）を上段に表示 */}
          {language === "japanese" && showText !== practiceText && (
            <div className="text-lg md:text-xl leading-relaxed text-gray-600 text-center">
              <div className="font-medium text-sm text-gray-500 mb-2">
                表示テキスト（ひらがな）:
              </div>
              <div className="font-sans">{showText}</div>
            </div>
          )}

          {/* 入力対象テキスト表示 */}
          {language === "japanese" ? (
            renderRomajiDisplay()
          ) : (
            <div className="text-lg md:text-xl leading-relaxed font-mono whitespace-normal break-words word-wrap">
              {practiceText
                .split("")
                .map((char, index) => renderCharacter(char, index))}
            </div>
          )}
        </div>{" "}
        {/* Status Messages */}
        <div className="mt-4 text-center">
          {isWaitingForCorrectKey && (
            <div className="text-red-600 text-sm animate-pulse bg-red-50 px-4 py-2 rounded-lg inline-block">
              <span className="mr-2">❌</span>
              正しいキーを入力してください:
              <kbd className="bg-red-200 px-2 py-1 rounded font-mono ml-1">
                {language === "japanese" &&
                romajiConverter &&
                practiceText[currentIndex]
                  ? (() => {
                      const parsedChars = parseHiraganaText(practiceText);
                      const currentCharGroup = parsedChars[currentIndex];
                      if (!currentCharGroup) return "?";
                      
                      const currentChar = currentCharGroup.char;
                      const validation = romajiConverter.validateInputMultiPattern(
                        currentChar,
                        currentInput
                      );
                      
                      // 複数の期待される次の文字がある場合
                      if (validation.expectedNextChars && validation.expectedNextChars.length > 0) {
                        return validation.expectedNextChars.join(" or ");
                      }
                      
                      const targetRomaji =
                        romajiConverter.convertToRomaji(currentChar).romaji;
                      return targetRomaji[currentInput.length] || "?";
                    })()
                  : practiceText[currentIndex]}
              </kbd>
            </div>
          )}

          {isCompleted && (
            <div className="text-green-600 font-semibold bg-green-50 px-6 py-3 rounded-lg inline-block animate-bounce">
              <span className="mr-2">🎉</span>
              完了！お疲れ様でした
              <span className="ml-2">✨</span>
            </div>
          )}
        </div>
      </div>
      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={reset}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Reset (Esc)
        </button>
        {isCompleted && (
          <button
            onClick={reset}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>{" "}
      {/* Bottom Instruction Caption */}
      <div
        className={`text-center overflow-hidden transition-all duration-200 ease-in-out ${
          !isActive && !isCompleted
            ? "max-h-20 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-gray-500 py-3 bg-gray-50/50 rounded-lg border border-gray-100">
          {!isFocused ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">👆</span>
              <p className="text-sm font-medium">
                上のタイピングエリアをクリックして開始
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xl animate-pulse">⌨️</span>
              <p className="text-sm font-medium">
                準備完了！キーを押してタイピング開始...
              </p>
              <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse rounded-sm ml-1"></span>
            </div>
          )}
        </div>
      </div>
      {/* Keyboard Shortcuts Help */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>{" "}
          to reset,{" "}
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+R</kbd> to
          restart
        </p>
      </div>
    </div>
  );
}
