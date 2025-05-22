export interface FortuneResult {
  overall: {
    score: number;  // 0-100
    level: 'excellent' | 'good' | 'normal' | 'bad';
    description: string;
  };
  aspects: {
    career: AspectFortune;
    wealth: AspectFortune;
    love: AspectFortune;
    health: AspectFortune;
  };
  lucky: {
    numbers: number[];
    colors: string[];
    directions: string[];
  };
  advice: string[];
}

interface AspectFortune {
  score: number;  // 0-100
  level: 'excellent' | 'good' | 'normal' | 'bad';
  description: string;
  suggestion: string;
}

export interface FortuneRequest {
  birthDate: string;
  gender: 'male' | 'female';
  zodiacSign?: string;
  question?: string;
} 