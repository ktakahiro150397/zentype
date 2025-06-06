// Mock data for development without Supabase
export const mockPracticeTexts = [
  // English texts
  {
    id: "1",
    content:
      "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet at least once.",
    language: "english" as const,
    difficulty: "easy" as const,
    category: "general",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    content:
      "Programming is not about typing, it's about thinking. Good code is written to be read by humans, not just computers.",
    language: "english" as const,
    difficulty: "medium" as const,
    category: "programming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    content:
      "Polymorphism, encapsulation, and inheritance are fundamental object-oriented programming concepts that enable flexible software architecture.",
    language: "english" as const,
    difficulty: "hard" as const,
    category: "programming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    content:
      "In the beginning was the Word, and the Word was with God, and the Word was God. All things were made through Him.",
    language: "english" as const,
    difficulty: "medium" as const,
    category: "literature",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    content:
      "To be or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
    language: "english" as const,
    difficulty: "hard" as const,
    category: "literature",
    createdAt: new Date().toISOString(),
  },

  // Japanese texts
  {
    id: "jp1",
    content: "", // Not used for Japanese
    displayText: "今日はいい天気です。",
    inputText: "きょうはいいてんきです。",
    language: "japanese" as const,
    difficulty: "easy" as const,
    category: "general",
    createdAt: new Date().toISOString(),
  },
  {
    id: "jp2",
    content: "", // Not used for Japanese
    displayText: "私は毎日プログラミングを勉強しています。",
    inputText: "わたしはまいにちぷろぐらみんぐをべんきょうしています。",
    language: "japanese" as const,
    difficulty: "easy" as const,
    category: "programming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "jp3",
    content: "", // Not used for Japanese
    displayText: "春が来て桜の花が美しく咲いています。",
    inputText: "はるがきてさくらのはながうつくしくさいています。",
    language: "japanese" as const,
    difficulty: "medium" as const,
    category: "general",
    createdAt: new Date().toISOString(),
  },
  {
    id: "jp4",
    content: "", // Not used for Japanese
    displayText: "オブジェクト指向プログラミングではカプセル化が重要です。",
    inputText:
      "おぶじぇくとしこうぷろぐらみんぐではかぷせるかがじゅうようです。",
    language: "japanese" as const,
    difficulty: "medium" as const,
    category: "programming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "jp5",
    content: "", // Not used for Japanese
    displayText: "抽象化と継承により、コードの再利用性と保守性が向上します。",
    inputText:
      "ちゅうしょうかとけいしょうにより、こーどのさいりようせいとほしゅせいがこうじょうします。",
    language: "japanese" as const,
    difficulty: "hard" as const,
    category: "programming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "jp6",
    content: "", // Not used for Japanese
    displayText: "今日はとても良い天気ですね。",
    inputText: "きょうはとてもよいてんきですね。",
    language: "japanese" as const,
    difficulty: "medium" as const,
    category: "general",
    createdAt: new Date().toISOString(),
  },
  {
    id: "jp7",
    content: "", // Not used for Japanese
    displayText: "写真を撮るのが趣味です。",
    inputText: "しゃしんをとるのがしゅみです。",
    language: "japanese" as const,
    difficulty: "medium" as const,
    category: "general",
    createdAt: new Date().toISOString(),
  },
  {
    id: "jp8",
    content: "", // Not used for Japanese
    displayText: "プログラミングは論理的思考を養います。",
    inputText: "ぷろぐらみんぐはろんりてきしこうをやしないます。",
    language: "japanese" as const,
    difficulty: "hard" as const,
    category: "programming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "jp9",
    content: "", // Not used for Japanese
    displayText: "デザインパターンは再利用可能なソフトウェアの設計です。",
    inputText: "でざいんぱたーんはさいりようかのうなそふとうぇあのせっけいです。",
    language: "japanese" as const,
    difficulty: "hard" as const,
    category: "programming",
    createdAt: new Date().toISOString(),
  },
];

// Local storage keys
export const STORAGE_KEYS = {
  SESSION_RESULTS: "zentype_session_results",
  USER_PROFILE: "zentype_user_profile",
} as const;

// Mock user for development
export const mockUser = {
  id: "mock-user-1",
  email: "demo@zentype.app",
  name: "Demo User",
  image:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPgo8L3N2Zz4K",
  createdAt: new Date().toISOString(),
};

// Local storage service
export class LocalStorageService {
  static getSessionResults(): any[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION_RESULTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static saveSessionResult(result: any): void {
    if (typeof window === "undefined") return;

    try {
      const existing = this.getSessionResults();
      const newResult = {
        ...result,
        id: Date.now().toString(),
        user_id: mockUser.id,
        created_at: new Date().toISOString(),
      };

      existing.unshift(newResult); // Add to beginning

      // Keep only last 100 results
      const trimmed = existing.slice(0, 100);

      localStorage.setItem(
        STORAGE_KEYS.SESSION_RESULTS,
        JSON.stringify(trimmed)
      );
    } catch (error) {
      console.error("Error saving session result:", error);
    }
  }

  static getUserProfile(): any {
    if (typeof window === "undefined") return mockUser;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return stored ? JSON.parse(stored) : mockUser;
    } catch {
      return mockUser;
    }
  }

  static saveUserProfile(profile: any): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  }

  static clearAllData(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION_RESULTS);
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  }
}
