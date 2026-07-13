import { create } from "zustand";
import type { LearnedWord, SceneSeed, StoryMessage } from "../types";

export interface Correction {
  original: string;
  corrected: string;
  hint: string;
  at: number;
}

interface StoryState {
  sessionId: string | null;
  worldId: string | null;
  messages: StoryMessage[];
  streamingText: string;
  isStreaming: boolean;
  currentHint: { text: string; corrected?: string; original?: string } | null;
  learnedThisSession: LearnedWord[];
  corrections: Correction[];
  sceneSeed: SceneSeed | null;
  priorScenarios: string[];
  unknownWords: string[];

  init: (opts: {
    sessionId: string;
    worldId: string;
    sceneSeed: SceneSeed;
    priorScenarios: string[];
    unknownWords: string[];
  }) => void;
  reset: () => void;
  addMessage: (m: StoryMessage) => void;
  appendStream: (chunk: string) => void;
  finalizeStream: () => void;
  setStreaming: (v: boolean) => void;
  setHint: (h: StoryState["currentHint"]) => void;
  addLearned: (w: LearnedWord) => void;
  addCorrection: (c: Omit<Correction, "at">) => void;
}

export const useStorySession = create<StoryState>((set, get) => ({
  sessionId: null,
  worldId: null,
  messages: [],
  streamingText: "",
  isStreaming: false,
  currentHint: null,
  learnedThisSession: [],
  corrections: [],
  sceneSeed: null,
  priorScenarios: [],
  unknownWords: [],

  init: ({ sessionId, worldId, sceneSeed, priorScenarios, unknownWords }) =>
    set({
      sessionId,
      worldId,
      sceneSeed,
      priorScenarios,
      unknownWords,
      messages: [],
      streamingText: "",
      isStreaming: false,
      currentHint: null,
      learnedThisSession: [],
      corrections: [],
    }),
  reset: () =>
    set({
      sessionId: null,
      worldId: null,
      messages: [],
      streamingText: "",
      isStreaming: false,
      currentHint: null,
      learnedThisSession: [],
      corrections: [],
      sceneSeed: null,
    }),
  addMessage: (m) => set({ messages: [...get().messages, m] }),
  appendStream: (chunk) => set({ streamingText: get().streamingText + chunk }),
  finalizeStream: () => {
    const text = get().streamingText.trim();
    if (!text) return set({ streamingText: "", isStreaming: false });
    set({
      messages: [
        ...get().messages,
        { id: crypto.randomUUID(), role: "assistant", content: text, createdAt: Date.now() },
      ],
      streamingText: "",
      isStreaming: false,
    });
  },
  setStreaming: (v) => set({ isStreaming: v }),
  setHint: (h) => set({ currentHint: h }),
  addLearned: (w) => {
    if (get().learnedThisSession.some((x) => x.word === w.word)) return;
    set({ learnedThisSession: [...get().learnedThisSession, w] });
  },
  addCorrection: (c) => {
    const list = get().corrections;
    // Dedupe: same original+corrected pair
    if (list.some((x) => x.original === c.original && x.corrected === c.corrected)) return;
    set({ corrections: [...list, { ...c, at: Date.now() }] });
  },
}));

