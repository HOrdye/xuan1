import { ref } from 'vue';

// 运势等级枚举
export enum FortuneLevel {
  EXCELLENT = 'excellent', // 大吉
  GOOD = 'good',          // 吉
  NORMAL = 'normal',      // 平
  BAD = 'bad',           // 凶
  TERRIBLE = 'terrible'   // 大凶
}

// 运势维度枚举
export enum FortuneDimension {
  OVERALL = 'overall',    // 整体运势
  CAREER = 'career',      // 事业运
  WEALTH = 'wealth',      // 财运
  LOVE = 'love',         // 感情运
  HEALTH = 'health'      // 健康运
}

// 运势维度配置接口
interface FortuneDimensionConfig {
  weight: number;         // 权重
  description: string;    // 描述
  tips: string[];        // 提示语
}

// 运势结果接口
export interface FortuneResult {
  level: FortuneLevel;    // 运势等级
  score: number;          // 运势分数(0-100)
  description: string;    // 运势描述
  tips: string[];        // 运势提示
  dimensions: {          // 各维度运势
    [key in FortuneDimension]: {
      level: FortuneLevel;
      score: number;
      description: string;
      tips: string[];
    }
  };
}

// 运势生成器类
export class FortuneGenerator {
  private static instance: FortuneGenerator;
  private readonly dimensionConfigs: Map<FortuneDimension, FortuneDimensionConfig>;
  
  private constructor() {
    // 初始化各维度配置
    this.dimensionConfigs = new Map([
      [FortuneDimension.OVERALL, {
        weight: 1.0,
        description: '整体运势',
        tips: [
          '今日宜：保持积极心态，把握机会',
          '今日忌：消极怠工，错过良机'
        ]
      }],
      [FortuneDimension.CAREER, {
        weight: 0.8,
        description: '事业运势',
        tips: [
          '工作顺利，适合推进重要项目',
          '注意团队协作，避免独断专行'
        ]
      }],
      [FortuneDimension.WEALTH, {
        weight: 0.7,
        description: '财运指数',
        tips: [
          '财运亨通，适合投资理财',
          '注意开源节流，避免冲动消费'
        ]
      }],
      [FortuneDimension.LOVE, {
        weight: 0.6,
        description: '感情运势',
        tips: [
          '桃花运旺，适合表达心意',
          '注意沟通方式，避免产生误会'
        ]
      }],
      [FortuneDimension.HEALTH, {
        weight: 0.5,
        description: '健康指数',
        tips: [
          '身体状况良好，适合运动锻炼',
          '注意作息规律，保持充足睡眠'
        ]
      }]
    ]);
  }

  // 单例模式获取实例
  public static getInstance(): FortuneGenerator {
    if (!FortuneGenerator.instance) {
      FortuneGenerator.instance = new FortuneGenerator();
    }
    return FortuneGenerator.instance;
  }

  // 生成运势分数
  private generateScore(): number {
    // 使用当前日期作为随机种子
    const today = new Date();
    const seed = today.getFullYear() * 10000 + 
                (today.getMonth() + 1) * 100 + 
                today.getDate();
    
    // 使用伪随机算法生成分数
    const x = Math.sin(seed) * 10000;
    return Math.abs(x - Math.floor(x)) * 100;
  }

  // 根据分数确定运势等级
  private getFortuneLevel(score: number): FortuneLevel {
    if (score >= 90) return FortuneLevel.EXCELLENT;
    if (score >= 70) return FortuneLevel.GOOD;
    if (score >= 40) return FortuneLevel.NORMAL;
    if (score >= 20) return FortuneLevel.BAD;
    return FortuneLevel.TERRIBLE;
  }

  // 生成运势描述
  private generateDescription(level: FortuneLevel, dimension: FortuneDimension): string {
    const config = this.dimensionConfigs.get(dimension);
    if (!config) return '';

    const descriptions = {
      [FortuneLevel.EXCELLENT]: `${config.description}极佳，诸事顺遂`,
      [FortuneLevel.GOOD]: `${config.description}良好，可有所作为`,
      [FortuneLevel.NORMAL]: `${config.description}平稳，宜守不宜进`,
      [FortuneLevel.BAD]: `${config.description}欠佳，需谨慎行事`,
      [FortuneLevel.TERRIBLE]: `${config.description}低迷，宜静待时机`
    };

    return descriptions[level];
  }

  // 生成运势提示
  private generateTips(level: FortuneLevel, dimension: FortuneDimension): string[] {
    const config = this.dimensionConfigs.get(dimension);
    if (!config) return [];

    // 根据运势等级选择提示语
    const tips = {
      [FortuneLevel.EXCELLENT]: [
        `今日${config.description}极佳，可以大胆行动`,
        '把握机会，乘胜追击',
        '适合开展新项目或计划'
      ],
      [FortuneLevel.GOOD]: [
        `今日${config.description}良好，可以稳步推进`,
        '保持积极心态，循序渐进',
        '注意细节，避免疏忽'
      ],
      [FortuneLevel.NORMAL]: [
        `今日${config.description}平稳，宜守不宜进`,
        '保持现状，避免冒进',
        '注意观察，等待时机'
      ],
      [FortuneLevel.BAD]: [
        `今日${config.description}欠佳，需谨慎行事`,
        '避免重大决策，以稳为主',
        '注意防范风险，及时止损'
      ],
      [FortuneLevel.TERRIBLE]: [
        `今日${config.description}低迷，宜静待时机`,
        '避免冲突，保持低调',
        '调整心态，等待转机'
      ]
    };

    return tips[level];
  }

  // 生成单个维度的运势
  private generateDimensionFortune(dimension: FortuneDimension): FortuneResult['dimensions'][FortuneDimension] {
    const score = this.generateScore();
    const level = this.getFortuneLevel(score);
    const description = this.generateDescription(level, dimension);
    const tips = this.generateTips(level, dimension);

    return {
      level,
      score,
      description,
      tips
    };
  }

  // 生成完整运势
  public generateFortune(): FortuneResult {
    // 生成整体运势
    const overallScore = this.generateScore();
    const overallLevel = this.getFortuneLevel(overallScore);
    const overallDescription = this.generateDescription(overallLevel, FortuneDimension.OVERALL);
    const overallTips = this.generateTips(overallLevel, FortuneDimension.OVERALL);

    // 生成各维度运势
    const dimensions = {
      [FortuneDimension.OVERALL]: {
        level: overallLevel,
        score: overallScore,
        description: overallDescription,
        tips: overallTips
      },
      [FortuneDimension.CAREER]: this.generateDimensionFortune(FortuneDimension.CAREER),
      [FortuneDimension.WEALTH]: this.generateDimensionFortune(FortuneDimension.WEALTH),
      [FortuneDimension.LOVE]: this.generateDimensionFortune(FortuneDimension.LOVE),
      [FortuneDimension.HEALTH]: this.generateDimensionFortune(FortuneDimension.HEALTH)
    };

    return {
      level: overallLevel,
      score: overallScore,
      description: overallDescription,
      tips: overallTips,
      dimensions
    };
  }
}

// 导出单例实例
export const fortuneGenerator = FortuneGenerator.getInstance(); 