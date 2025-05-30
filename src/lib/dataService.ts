// データサービスの統一インターフェース
export interface PracticeText {
  id: string;
  content: string;
  displayText?: string; // 表示用テキスト（日本語用）
  inputText?: string; // 入力対象テキスト（日本語用）
  language: "english" | "japanese";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  created_at: string;
}

export interface SessionResult {
  id?: string;
  user_id: string;
  wpm: number;
  accuracy: number;
  text_id: string;
  text_content: string;
  time_taken: number;
  errors: number;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  created_at: string;
}

// データサービスの抽象インターフェース
export interface IDataService {
  // Practice texts
  getPracticeTexts(): Promise<PracticeText[]>;
  getPracticeText(id: string): Promise<PracticeText | null>;

  // Session results
  getSessionResults(userId: string): Promise<SessionResult[]>;
  saveSessionResult(
    result: Omit<SessionResult, "id" | "created_at">
  ): Promise<void>;

  // User profile
  getUserProfile(userId: string): Promise<User | null>;
  saveUserProfile(profile: Partial<User>): Promise<void>;
}

// Supabaseサービス実装
class SupabaseDataService implements IDataService {
  async getPracticeTexts(): Promise<PracticeText[]> {
    // TODO: Supabase実装
    throw new Error("Supabase service not implemented yet");
  }

  async getPracticeText(id: string): Promise<PracticeText | null> {
    // TODO: Supabase実装
    throw new Error("Supabase service not implemented yet");
  }

  async getSessionResults(userId: string): Promise<SessionResult[]> {
    // TODO: Supabase実装
    throw new Error("Supabase service not implemented yet");
  }

  async saveSessionResult(
    result: Omit<SessionResult, "id" | "created_at">
  ): Promise<void> {
    // TODO: Supabase実装
    throw new Error("Supabase service not implemented yet");
  }

  async getUserProfile(userId: string): Promise<User | null> {
    // TODO: Supabase実装
    throw new Error("Supabase service not implemented yet");
  }

  async saveUserProfile(profile: Partial<User>): Promise<void> {
    // TODO: Supabase実装
    throw new Error("Supabase service not implemented yet");
  }
}

// モックサービス実装
class MockDataService implements IDataService {
  async getPracticeTexts(): Promise<PracticeText[]> {
    const { mockPracticeTexts } = await import("./mockData");
    return mockPracticeTexts;
  }

  async getPracticeText(id: string): Promise<PracticeText | null> {
    const { mockPracticeTexts } = await import("./mockData");
    return mockPracticeTexts.find((text) => text.id === id) || null;
  }

  async getSessionResults(userId: string): Promise<SessionResult[]> {
    const { LocalStorageService } = await import("./mockData");
    return LocalStorageService.getSessionResults();
  }

  async saveSessionResult(
    result: Omit<SessionResult, "id" | "created_at">
  ): Promise<void> {
    const { LocalStorageService } = await import("./mockData");
    LocalStorageService.saveSessionResult(result);
  }

  async getUserProfile(userId: string): Promise<User | null> {
    const { LocalStorageService } = await import("./mockData");
    return LocalStorageService.getUserProfile();
  }

  async saveUserProfile(profile: Partial<User>): Promise<void> {
    const { LocalStorageService } = await import("./mockData");
    LocalStorageService.saveUserProfile(profile);
  }
}

// ファクトリー関数
export function createDataService(): IDataService {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  if (isDemoMode) {
    return new MockDataService();
  } else {
    return new SupabaseDataService();
  }
}

// シングルトンインスタンス
export const dataService = createDataService();
