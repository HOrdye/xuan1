import type { FortuneResult, FortuneRequest } from '../types';

const STORAGE_KEYS = {
  FORTUNE_RESULT: 'fortune_result',
  FORTUNE_REQUEST: 'fortune_request',
  LAST_GENERATED: 'last_generated'
};

export function saveFortuneResult(result: FortuneResult): void {
  localStorage.setItem(STORAGE_KEYS.FORTUNE_RESULT, JSON.stringify(result));
  localStorage.setItem(STORAGE_KEYS.LAST_GENERATED, new Date().toISOString());
}

export function getFortuneResult(): FortuneResult | null {
  const result = localStorage.getItem(STORAGE_KEYS.FORTUNE_RESULT);
  if (!result) return null;
  
  try {
    return JSON.parse(result) as FortuneResult;
  } catch {
    return null;
  }
}

export function saveFortuneRequest(request: FortuneRequest): void {
  localStorage.setItem(STORAGE_KEYS.FORTUNE_REQUEST, JSON.stringify(request));
}

export function getFortuneRequest(): FortuneRequest | null {
  const request = localStorage.getItem(STORAGE_KEYS.FORTUNE_REQUEST);
  if (!request) return null;
  
  try {
    return JSON.parse(request) as FortuneRequest;
  } catch {
    return null;
  }
}

export function getLastGeneratedTime(): Date | null {
  const time = localStorage.getItem(STORAGE_KEYS.LAST_GENERATED);
  if (!time) return null;
  
  try {
    return new Date(time);
  } catch {
    return null;
  }
}

export function isFortuneExpired(): boolean {
  const lastGenerated = getLastGeneratedTime();
  if (!lastGenerated) return true;
  
  const now = new Date();
  const diff = now.getTime() - lastGenerated.getTime();
  const hours = diff / (1000 * 60 * 60);
  
  // 运势结果24小时后过期
  return hours >= 24;
}

export function clearFortuneData(): void {
  localStorage.removeItem(STORAGE_KEYS.FORTUNE_RESULT);
  localStorage.removeItem(STORAGE_KEYS.FORTUNE_REQUEST);
  localStorage.removeItem(STORAGE_KEYS.LAST_GENERATED);
} 