export type StoryLevel = "beginner" | "intermediate" | "advanced";

export interface World {
  id: string;
  nameAr: string;
  nameEn: string;
  characterName: string;
  characterPersona: string;
  level: StoryLevel;
  targetVocab: number;
  worldImage: string;
  characterImage: string;
  accentColor: string;
  tagline: string;
}

export interface StoryMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
}

export interface LearnedWord {
  word: string;
  meaning: string;
}

export interface SceneSeed {
  weather: string;
  mood: string;
  timeOfDay: string;
  sideEvent: string;
}
