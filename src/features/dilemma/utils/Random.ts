// Random.ts
// 伪随机数生成器

export class Random {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  // 生成指定范围内的随机整数
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  // 生成指定范围内的随机浮点数
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  // 生成随机布尔值
  nextBoolean(): boolean {
    return this.next() > 0.5;
  }

  // 从数组中随机选择一个元素
  nextChoice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  // 生成指定概率的随机布尔值
  nextBooleanWithProbability(probability: number): boolean {
    return this.next() < probability;
  }

  // 生成指定概率的随机整数
  nextIntWithProbability(probabilities: number[]): number {
    const sum = probabilities.reduce((a, b) => a + b, 0);
    const random = this.next() * sum;
    let cumulative = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (random < cumulative) {
        return i;
      }
    }
    return probabilities.length - 1;
  }

  // 生成指定概率的随机浮点数
  nextFloatWithProbability(probabilities: number[]): number {
    const sum = probabilities.reduce((a, b) => a + b, 0);
    const random = this.next() * sum;
    let cumulative = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (random < cumulative) {
        return i;
      }
    }
    return probabilities.length - 1;
  }
} 