export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  SIGN = 'SIGN',
  SPEECH = 'SPEECH',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  CHAT = 'CHAT',
  SETTINGS = 'SETTINGS',
  DEMO = 'DEMO'
}

export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

export interface UserSettings {
  highContrast: boolean;
  largeText: boolean;
  readingLevel: 'simple' | 'moderate' | 'advanced';
  language: string;
  voiceSpeed: number;
  colorBlindMode: ColorBlindMode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  type: AppMode;
  mockData?: string; 
}