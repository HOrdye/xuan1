import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 定义路由
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '天玄Web - 玄学决策助手'
    }
  },
  // 六十四卦浏览器
  {
    path: '/hexagrams',
    name: 'HexagramExplorer',
    component: () => import('../views/HexagramExplorer.vue'),
    meta: {
      title: '六十四卦探索 - 天玄Web'
    }
  },
    // 视觉分析网络功能已移除
  // 玄选两难主页
  {
    path: '/dilemma',
    name: 'Dilemma',
    component: () => import('../features/dilemma/views/DilemmaPage.vue'),
    meta: {
      title: '玄选两难 - 天玄Web'
    }
  },
  // 两难抉择功能
  {
    path: '/dilemma/test',
    name: 'HexagramTester',
    component: () => import('../features/dilemma/views/HexagramTester.vue'),
    meta: {
      title: '两难抉择 - 天玄Web'
    }
  },
  // 六十四卦占卜功能
  {
    path: '/dilemma/divination',
    name: 'HexagramDivination',
    component: () => import('../features/dilemma/views/HexagramDivination.vue'),
    meta: {
      title: '六十四卦占卜 - 天玄Web'
    }
  },
  // 运势功能
  {
    path: '/fortune',
    name: 'Fortune',
    component: () => import('../features/fortune/views/FortunePage.vue'),
    meta: {
      title: '今日运势 - 天玄Web'
    }
  },
  // 用户中心
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: {
      title: '个人中心 - 天玄Web'
    }
  },
  // 简单测试页面
  {
    path: '/hexagram-simple-test',
    name: 'SimpleTest',
    component: () => import('../features/dilemma/views/SimpleTestPage.vue'),
    meta: {
      title: '简易测试 - 天玄Web'
    }
  },
  // 关于页面
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: '关于我们 - 天玄Web'
    }
  },
  // 404页面
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到 - 天玄Web'
    }
  },
  // 笅杯占卜功能
  {
    path: '/jiaobei',
    name: 'JiaoBei',
    component: () => import('../features/jiao-bei/views/JiaoBeiPage.vue'),
    meta: {
      title: '笅杯占卜 - 天玄Web'
    }
  },
  // 塔罗牌功能
  {
    path: '/tarot',
    name: 'Tarot',
    component: () => import('@/features/tarot/views/TarotPage.vue'),
    meta: {
      title: '塔罗占卜 - 天玄Web'
    }
  },
  // LLM调试工具
  {
    path: '/debug/llm',
    name: 'LLMDebug',
    component: () => import('../views/LLMDebug.vue'),
    meta: {
      title: 'LLM连接调试 - 天玄Web'
    }
  },
  // 动画测试工具
  {
    path: '/debug/animation',
    name: 'AnimationTest',
    component: () => import('../debug/AnimationTest.vue'),
    meta: {
      title: '动画测试 - 天玄Web'
    }
  },
  // 卦象数据调试工具
  {
    path: '/debug/hexagram',
    name: 'HexagramDebug',
    component: () => import('../debug/HexagramDataDebug.vue'),
    meta: {
      title: '卦象数据调试 - 天玄Web'
    }
  },
  // 通配符路由，重定向到404
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 全局前置守卫 - 设置页面标题
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = to.meta.title as string || '天玄Web - 玄学决策助手';
  next();
});

export default router;