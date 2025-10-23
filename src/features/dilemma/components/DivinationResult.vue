<template>
  <div>
    <!-- 临时调试信息 -->
    <div class="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h4 class="font-bold text-yellow-800 mb-2">🔧 调试信息</h4>
      <div class="text-sm text-yellow-700">
        <p><strong>result 存在:</strong> {{ result ? '是' : '否' }}</p>
        <p><strong>result.hexagram 存在:</strong> {{ result?.hexagram ? '是' : '否' }}</p>
        <p><strong>result.question:</strong> {{ result?.question || '无' }}</p>
        <p><strong>personalizedInsight 存在:</strong> {{ personalizedInsight ? '是' : '否' }}</p>
        <div v-if="result?.hexagram" class="mt-2">
          <p><strong>卦象名称:</strong> {{ result.hexagram.chineseName || result.hexagram.name || '未知' }}</p>
          <p><strong>卦象lines:</strong> {{ result.hexagram.lines ? '存在' : '无' }}</p>
        </div>
      </div>
    </div>
    
    <div v-if="result" class="divination-result bg-white shadow-xl rounded-lg p-6 animate-fadeIn">
      <!-- 页面头部 - 品牌标识和主题切换 -->
      <div class="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg border border-blue-200">
        <!-- 天玄品牌标识 -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">天</span>
          </div>
          <div>
            <h3 class="font-bold text-xl text-blue-800">天玄易经</h3>
            <p class="text-sm text-blue-600">智慧决策助手</p>
          </div>
        </div>
        
        <!-- 主题切换按钮 -->
        <button 
          @click="toggleTheme"
          class="p-2 rounded-full bg-white/60 hover:bg-white/80 transition-all duration-200 border border-blue-200"
          :title="isDarkMode ? '切换到浅色模式' : '切换到深色模式'"
        >
          <span v-if="isDarkMode" class="text-yellow-500 text-xl">☀️</span>
          <span v-else class="text-gray-600 text-xl">🌙</span>
        </button>
      </div>

      <!-- 标题和问题回顾 -->
      <div class="mb-6 text-center">
        <h3 class="text-3xl font-semibold text-primary mb-2 vintage-text animate-slideInDown">占卜结果</h3>
        <p v-if="result.question" class="text-gray-600 text-lg animate-slideInDown" style="animation-delay: 0.1s;">
          针对问题: "<span class="font-medium">{{ result.question }}</span>"
        </p>
        
        <!-- 页面内导航 -->
        <div class="mt-4 flex flex-wrap justify-center gap-2">
          <button 
            @click="scrollToSection('core')"
            class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors duration-200"
          >
            🎯 核心结论
          </button>
          <button 
            @click="scrollToSection('interpretation')"
            class="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full hover:bg-indigo-200 transition-colors duration-200"
          >
            📖 综合解读
          </button>
          <button 
            @click="scrollToSection('hexagram')"
            class="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full hover:bg-orange-200 transition-colors duration-200"
          >
            ☯ 卦象分析
          </button>
          <button 
            @click="scrollToSection('action')"
            class="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full hover:bg-emerald-200 transition-colors duration-200"
          >
            🎯 行动指南
          </button>
        </div>
      </div>

      <!-- 问题连接卡片 - 智能连接算法的核心展示 -->
      <div v-if="personalizedInsight" class="personalized-insight mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg border border-blue-100 animate-reveal">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3">
            <span class="text-white text-xl">🔮</span>
          </div>
          <h4 class="text-xl font-semibold text-gray-800 mb-2">天玄智能解读</h4>
        </div>
        
        <!-- 个性化开场白 -->
        <div class="mb-4 p-4 bg-white rounded-lg border-l-4 border-blue-500">
          <p class="text-gray-700 leading-relaxed">{{ personalizedInsight.opening }}</p>
        </div>
        
        <!-- 信心指数/顺利度显示 -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-600">顺利度</span>
            <span class="text-lg font-bold text-blue-600">{{ personalizedInsight.confidenceLevel }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
              :style="{ width: personalizedInsight.confidenceLevel + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- 核心结论 -->
        <div class="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <h5 class="font-semibold text-green-800 mb-2">核心结论</h5>
          <p class="text-gray-700">{{ personalizedInsight.coreConclusion }}</p>
        </div>
        
        <!-- 卦象属性标签 -->
        <div v-if="personalizedInsight.hexagramAttributes" class="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <h5 class="font-semibold text-purple-800 mb-3">卦象特质分析</h5>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span class="text-gray-600">性质：</span>
              <span class="font-medium">{{ personalizedInsight.hexagramAttributes.nature }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span class="text-gray-600">五行：</span>
              <span class="font-medium">{{ personalizedInsight.hexagramAttributes.element }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span class="text-gray-600">行动：</span>
              <span class="font-medium">{{ personalizedInsight.hexagramAttributes.action }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span class="text-gray-600">吉凶：</span>
              <span class="font-medium">{{ personalizedInsight.hexagramAttributes.fortune }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span class="text-gray-600">时机：</span>
              <span class="font-medium">{{ personalizedInsight.hexagramAttributes.timing }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span class="text-gray-600">能量：</span>
              <span class="font-medium">{{ personalizedInsight.hexagramAttributes.energy }}</span>
            </div>
          </div>
          
          <!-- 性格特质 -->
          <div class="mt-3">
            <span class="text-gray-600 text-sm">性格特质：</span>
            <div class="flex flex-wrap gap-2 mt-1">
              <span 
                v-for="trait in personalizedInsight.hexagramAttributes.personality" 
                :key="trait"
                class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
              >
                {{ trait }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 思维模型提炼卡片 -->
        <div v-if="personalizedInsight?.hexagramAttributes" class="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
          <h5 class="font-semibold text-indigo-800 mb-3">🧠 思维模型提炼</h5>
          <div class="space-y-4">
            <!-- 思维模型名称 -->
            <div class="text-center p-3 bg-white/60 rounded-lg">
              <h6 class="font-bold text-indigo-700 text-lg">{{ generateMentalModel(result.hexagram, identifyQuestionType(result.question || '')).model }}</h6>
              <p class="text-sm text-indigo-600 mt-1">基于卦象智慧的现代思维工具</p>
            </div>
            
            <!-- 核心原则 -->
            <div>
              <h6 class="font-semibold text-indigo-700 mb-2">核心原则</h6>
              <div class="space-y-2">
                <div 
                  v-for="(principle, index) in generateMentalModel(result.hexagram, identifyQuestionType(result.question || '')).principles" 
                  :key="index"
                  class="flex items-start space-x-3 p-2 bg-white/60 rounded-lg"
                >
                  <span class="inline-flex items-center justify-center w-5 h-5 bg-indigo-500 text-white text-xs font-bold rounded-full flex-shrink-0 mt-0.5">
                    {{ index + 1 }}
                  </span>
                  <span class="text-gray-700 text-sm">{{ principle }}</span>
                </div>
              </div>
            </div>
            
            <!-- 实际应用 -->
            <div>
              <h6 class="font-semibold text-indigo-700 mb-2">实际应用</h6>
              <div class="space-y-2">
                <div 
                  v-for="(application, index) in generateMentalModel(result.hexagram, identifyQuestionType(result.question || '')).applications" 
                  :key="index"
                  class="flex items-start space-x-3 p-2 bg-white/60 rounded-lg"
                >
                  <span class="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex-shrink-0 mt-0.5">
                    {{ index + 1 }}
                  </span>
                  <span class="text-gray-700 text-sm">{{ application }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 综合解读 - 提升到页面中部，紧跟在核心结论之后 -->
      <div v-if="result.analysis && result.method !== 'dilemma'" class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200 animate-reveal">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-3">
            <span class="text-white text-xl">📖</span>
          </div>
          <h4 class="text-xl font-semibold text-gray-800 mb-2">综合解读</h4>
          <p class="text-sm text-gray-600">基于传统易经智慧与现代解读的深度分析</p>
        </div>
        
        <div class="text-gray-700 whitespace-pre-wrap leading-relaxed">
          <!-- 使用v-html渲染带格式的文本 -->
          <div v-html="formatAnalysisText(typeof result.analysis === 'string' ? result.analysis : JSON.stringify(result.analysis))"></div>
        </div>
      </div>

      <!-- 卦象解读标签页 -->
      <div v-if="result.hexagram" class="hexagram-section mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200 animate-reveal">
        <!-- 调试信息 -->
        <div class="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
          <strong>调试信息:</strong> 卦象数据存在，正在显示卦象解读
        </div>
        <!-- 趋势总结 -->
        <div v-if="result.changingLines && result.changingLines.length > 0 && result.relatedHexagram" class="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <h5 class="font-semibold text-orange-800 mb-2">趋势总结</h5>
          <p class="text-gray-700">此事由<span class="font-medium text-orange-600">{{ result.hexagram.chineseName || result.hexagram.name }}</span>的状况，最终会发展为<span class="font-medium text-red-600">{{ result.relatedHexagram.chineseName || result.relatedHexagram.name }}</span>的结果。</p>
          
          <!-- 卦象变化动画展示 -->
          <div class="mt-4 p-4 bg-white/60 rounded-lg">
            <h6 class="font-semibold text-orange-700 mb-3">卦象变化过程</h6>
            <div class="flex items-center justify-center space-x-4">
              <!-- 本卦 -->
              <div class="text-center">
                <div class="mb-2">
                  <HexagramDisplay 
                    :hexagram="result.hexagram" 
                    :debug="true"
                    :highlight-lines="result.changingLines"
                    :is-changing="true"
                    class="transform transition-all duration-1000"
                  />
                </div>
                <p class="text-sm font-medium text-orange-600">本卦</p>
              </div>
              
              <!-- 变化箭头 -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 mb-2"></div>
                <div class="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-400"></div>
                <div class="text-xs text-gray-500 mt-2">变化</div>
              </div>
              
              <!-- 变卦 -->
              <div class="text-center">
                <div class="mb-2">
                  <HexagramDisplay 
                    :hexagram="result.relatedHexagram" 
                    :debug="true"
                    class="transform transition-all duration-1000"
                  />
                </div>
                <p class="text-sm font-medium text-red-600">变卦</p>
              </div>
            </div>
            
                          <!-- 动爻说明 -->
              <div class="mt-3 text-center">
                <p class="text-xs text-gray-600">
                  动爻：{{ result.changingLines.map(line => getYaoLabel(line)).join('、') }}
                </p>
                
                <!-- 动画触发按钮 -->
                <button 
                  @click="startHexagramAnimation"
                  :disabled="animationState !== 'idle'"
                  class="mt-2 px-3 py-1 bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs rounded-full hover:from-orange-500 hover:to-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ animationState === 'idle' ? '🎬 观看变化过程' : 
                     animationState === 'highlighting' ? '✨ 高亮动爻中...' :
                     animationState === 'flipping' ? '🔄 卦象翻转中...' : '✅ 变化完成' }}
                </button>
              </div>
          </div>
        </div>
        
        <!-- 标签页导航 -->
        <div class="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button 
            @click="activeTab = 'original'"
            :class="['px-4 py-2 rounded-md text-sm font-medium transition-all duration-200', 
              activeTab === 'original' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800']"
          >
            本卦解读
          </button>
          <button 
            v-if="result.changingLines && result.changingLines.length > 0"
            @click="activeTab = 'changing'"
            :class="['px-4 py-2 rounded-md text-sm font-medium transition-all duration-200', 
              activeTab === 'changing' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800']"
          >
            变卦分析
          </button>
          <button 
            v-if="result.changingLines && result.changingLines.length > 0"
            @click="activeTab = 'lines'"
            :class="['px-4 py-2 rounded-md text-sm font-medium transition-all duration-200', 
              activeTab === 'lines' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800']"
          >
            动爻启示
          </button>
        </div>
        
        <!-- 标签页内容 -->
        <div class="tab-content">
          <!-- 本卦解读 -->
          <div v-if="activeTab === 'original'" class="space-y-4">
            <div class="text-center mb-4">
              <h4 class="font-bold text-gray-800 text-2xl mb-3">本卦: {{ result.hexagram.chineseName || result.hexagram.name }}</h4>
              <HexagramDisplay :hexagram="result.hexagram" :debug="false" />
            </div>
            <div v-if="result.hexagram.judgment || result.hexagram.meaning" class="p-4 bg-blue-50 rounded-lg">
              <h5 class="font-semibold text-blue-800 mb-2">卦辞解读</h5>
              <p class="text-gray-700">{{ result.hexagram.judgment || result.hexagram.meaning }}</p>
            </div>
            <div v-if="result.hexagram.modernInterpretation" class="p-4 bg-green-50 rounded-lg">
              <h5 class="font-semibold text-green-800 mb-2">现代解读</h5>
              <p class="text-gray-700">{{ result.hexagram.modernInterpretation }}</p>
            </div>
          </div>
          
          <!-- 变卦分析 -->
          <div v-if="activeTab === 'changing' && result.relatedHexagram" class="space-y-4">
            <div class="text-center mb-4">
              <h4 class="font-bold text-gray-800 text-2xl mb-3">变卦: {{ result.relatedHexagram.chineseName || result.relatedHexagram.name }}</h4>
              <HexagramDisplay :hexagram="result.relatedHexagram" :debug="false" />
            </div>
            <div v-if="result.relatedHexagram.judgment || result.relatedHexagram.meaning" class="p-4 bg-purple-50 rounded-lg">
              <h5 class="font-semibold text-purple-800 mb-2">卦辞解读</h5>
              <p class="text-gray-700">{{ result.relatedHexagram.judgment || result.relatedHexagram.meaning }}</p>
            </div>
            <div v-if="result.relatedHexagram.modernInterpretation" class="p-4 bg-green-50 rounded-lg">
              <h5 class="font-semibold text-green-800 mb-2">现代解读</h5>
              <p class="text-gray-700">{{ result.relatedHexagram.modernInterpretation }}</p>
            </div>
          </div>
          
          <!-- 动爻启示 -->
          <div v-if="activeTab === 'lines' && result.changingLines && result.changingLines.length > 0" class="space-y-4">
            <div class="p-4 bg-yellow-50 rounded-lg">
              <h5 class="font-semibold text-yellow-800 mb-3">动爻分析</h5>
              <p class="text-gray-700 mb-3">共有 {{ result.changingLines.length }} 个爻发生变化，这预示着事情的关键转折点。</p>
              <ul class="space-y-3">
                <li v-for="(lineIndex, idx) in result.changingLines" :key="idx" class="p-3 bg-white rounded-lg border border-yellow-200">
                  <div class="flex items-start space-x-3">
                    <span class="inline-flex items-center justify-center w-6 h-6 bg-yellow-500 text-white text-xs font-bold rounded-full">{{ getYaoLabel(lineIndex) }}</span>
                    <div class="flex-1">
                      <p class="font-medium text-gray-800 mb-1">{{ getYaoLabel(lineIndex) }}爻变化</p>
                      <p v-if="(result.hexagram as any).yao_texts && (result.hexagram as any).yao_texts[lineIndex]" class="text-sm text-gray-600 mb-2">
                        原文：{{ (result.hexagram as any).yao_texts[lineIndex] }}
                      </p>
                      <p v-if="result.relatedHexagram && (result.relatedHexagram as any).yao_texts && (result.relatedHexagram as any).yao_texts[lineIndex]" class="text-sm text-gray-600">
                        变爻：{{ (result.relatedHexagram as any).yao_texts[lineIndex] }}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center p-4 mb-6 border rounded-lg bg-gray-50 animate-reveal">
        <p class="text-gray-600">主卦象信息未能生成。</p>
        <!-- 调试信息 -->
        <div class="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs">
          <strong>调试信息:</strong> 
          <br>result: {{ result ? '存在' : 'null' }}
          <br>result.hexagram: {{ result?.hexagram ? '存在' : 'null' }}
          <br>result.question: {{ result?.question || '无' }}
        </div>
      </div>



      <!-- 行动指南卡片 -->
      <div class="action-section mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl shadow-lg border border-emerald-200 animate-reveal">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-3">
            <span class="text-white text-xl">🎯</span>
          </div>
          <h4 class="text-xl font-semibold text-gray-800 mb-2">行动指南</h4>
        </div>
        
        <!-- 抽取今日指南按钮 -->
        <div class="text-center mb-4">
          <button 
            @click="generateActionGuide"
            class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            🎲 抽取今日行动指南
          </button>
        </div>
        
        <!-- 行动指南内容 -->
        <div v-if="actionGuide" class="space-y-4">
          <div class="p-4 bg-white rounded-lg border border-emerald-200">
            <h5 class="font-semibold text-emerald-800 mb-2">今日建议</h5>
            <p class="text-gray-700">{{ actionGuide.advice }}</p>
          </div>
          
          <div class="p-4 bg-white rounded-lg border border-emerald-200">
            <h5 class="font-semibold text-emerald-800 mb-2">关键行动</h5>
            <p class="text-gray-700">{{ actionGuide.action }}</p>
          </div>
          
          <!-- 基于卦象属性的具体行动建议 -->
          <div v-if="personalizedInsight?.actionItems && personalizedInsight.actionItems.length > 0" class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h5 class="font-semibold text-blue-800 mb-3">基于卦象的行动指南</h5>
            <div class="space-y-2">
              <div 
                v-for="(action, index) in personalizedInsight.actionItems" 
                :key="index"
                class="flex items-start space-x-3 p-2 bg-white/60 rounded-lg"
              >
                <span class="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex-shrink-0 mt-0.5">
                  {{ index + 1 }}
                </span>
                <span class="text-gray-700 text-sm">{{ action }}</span>
              </div>
            </div>
          </div>
          
          <!-- 保存指南按钮 -->
          <div class="text-center">
            <button 
              @click="saveActionGuide"
              class="px-4 py-2 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200 transition-colors duration-200"
            >
              💾 保存指南
            </button>
          </div>
        </div>
        
        <!-- 默认提示 -->
        <div v-else class="text-center p-4">
          <p class="text-gray-600">点击上方按钮，获取基于卦象的个性化行动建议</p>
        </div>
      </div>

      <!-- 用户反馈系统 -->
      <div class="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-lg border border-indigo-200 animate-reveal">
        <div class="text-center mb-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-2">这个解读对你有帮助吗？</h4>
          <p class="text-sm text-gray-600">你的反馈帮助我们不断优化解读质量</p>
        </div>
        
        <div class="flex flex-wrap justify-center gap-3">
          <button 
            @click="submitFeedback('helpful')"
            class="px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>👍</span>
            <span>很有启发</span>
          </button>
          
          <button 
            @click="submitFeedback('confused')"
            class="px-4 py-2 bg-yellow-100 text-yellow-700 font-medium rounded-lg hover:bg-yellow-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>🤔</span>
            <span>有点困惑</span>
          </button>
          
          <button 
            @click="submitFeedback('accurate')"
            class="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>🎯</span>
            <span>很贴切</span>
          </button>
        </div>
        
        <div v-if="feedbackSubmitted" class="mt-4 text-center">
          <p class="text-green-600 font-medium">感谢你的反馈！我们会继续努力提升解读质量。</p>
        </div>
      </div>

      <!-- 开发模式测试按钮 -->
      <div v-if="isDevelopment" class="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 class="text-lg font-semibold text-yellow-800 mb-3">开发模式测试</h4>
        <div class="flex flex-wrap gap-2">
          <button 
            @click="testPersonalizedInsight"
            class="px-3 py-2 bg-yellow-100 text-yellow-700 text-sm rounded hover:bg-yellow-200"
          >
            测试智能解读
          </button>
          <button 
            @click="testActionGuide"
            class="px-3 py-2 bg-yellow-100 text-yellow-700 text-sm rounded hover:bg-yellow-200"
          >
            测试行动指南
          </button>
          <button 
            @click="testUserFeedback"
            class="px-3 py-2 bg-yellow-100 text-yellow-700 text-sm rounded hover:bg-yellow-200"
          >
            测试用户反馈
          </button>
        </div>
      </div>

      <!-- Dilemma (玄选两难) 特定分析 -->
      <div v-if="result.method === 'dilemma' && result.optionA && result.optionB" 
           class="dilemma-analysis mt-8 p-6 border-t border-gray-200 animate-reveal" style="animation-delay: 0.4s;">
        <h4 class="text-2xl font-semibold text-primary mb-4 text-center vintage-text">玄选两难分析</h4>
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div class="option-card bg-secondary/10 p-4 rounded-lg shadow">
            <h5 class="font-bold text-secondary text-lg mb-2">选项A: {{ result.optionA }}</h5>
            <p class="text-sm text-gray-700 mb-1">匹配度: <span class="font-semibold">{{ result.optionA_score }}%</span></p>
            <p v-if="result.optionA_analysis" class="text-xs text-gray-600">{{ result.optionA_analysis }}</p>
          </div>
          <div class="option-card bg-accent/10 p-4 rounded-lg shadow">
            <h5 class="font-bold text-accent text-lg mb-2">选项B: {{ result.optionB }}</h5>
            <p class="text-sm text-gray-700 mb-1">匹配度: <span class="font-semibold">{{ result.optionB_score }}%</span></p>
            <p v-if="result.optionB_analysis" class="text-xs text-gray-600">{{ result.optionB_analysis }}</p>
          </div>
        </div>
        <div v-if="result.recommendation" class="recommendation mt-4 p-4 bg-primary/10 rounded-lg text-center">
          <strong class="text-primary">综合建议:</strong>
          <p class="text-gray-700">{{ result.recommendation }}</p>
        </div>
      </div>
      
      <!-- 综合解读 - 提升到页面中部，紧跟在核心结论之后 -->
      <div v-if="result.analysis && result.method !== 'dilemma'" class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200 animate-reveal">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-3">
            <span class="text-white text-xl">📖</span>
          </div>
          <h4 class="text-xl font-semibold text-gray-800 mb-2">综合解读</h4>
          <p class="text-sm text-gray-600">基于传统易经智慧与现代解读的深度分析</p>
        </div>
        
        <div class="text-gray-700 whitespace-pre-wrap leading-relaxed">
          <!-- 使用v-html渲染带格式的文本 -->
          <div v-html="formatAnalysisText(typeof result.analysis === 'string' ? result.analysis : JSON.stringify(result.analysis))"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, onMounted } from 'vue';
import type { AnalysisResult } from '../types';
import HexagramDisplay from '../../../components/hexagram/HexagramDisplay.vue';
import { 
  generatePersonalizedAdvice, 
  getHexagramAttributes,
  calculateHexagramMatch 
} from '../utils/hexagramAttributes';

const _props = defineProps<{
  result: AnalysisResult | null;
}>();

// 标签页状态管理
const activeTab = ref('changing'); // 默认显示变卦分析，因为这是用户最关心的

// 行动指南状态
const actionGuide = ref<{
  advice: string;
  action: string;
} | null>(null);

// 用户反馈状态
const feedbackSubmitted = ref(false);

// 开发模式标识
const isDevelopment = ref(process.env.NODE_ENV === 'development');

// 卦象变化动画状态
const animationState = ref<'idle' | 'highlighting' | 'flipping' | 'complete'>('idle');
const currentAnimationStep = ref(0);

// 主题模式状态
const isDarkMode = ref(false);
const themeColors = computed(() => ({
  primary: isDarkMode.value ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500',
  secondary: isDarkMode.value ? 'from-orange-500 to-red-500' : 'from-orange-400 to-red-400',
  background: isDarkMode.value ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900',
  card: isDarkMode.value ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
  text: isDarkMode.value ? 'text-gray-100' : 'text-gray-900'
}));

// 智能连接算法：生成个性化开场白和核心结论
const personalizedInsight = computed(() => {
  console.log('🔍 personalizedInsight computed 被调用');
  console.log('🔍 _props.result:', _props.result);
  console.log('🔍 _props.result?.question:', _props.result?.question);
  console.log('🔍 _props.result?.hexagram:', _props.result?.hexagram);
  
  if (!_props.result?.question || !_props.result?.hexagram) {
    console.log('❌ personalizedInsight 返回 null，因为缺少 question 或 hexagram');
    return null;
  }
  
  const question = _props.result.question;
  const hexagram = _props.result.hexagram;
  
  console.log('🔍 question:', question);
  console.log('🔍 hexagram:', hexagram);
  
  try {
    // 问题类型识别
    const questionType = identifyQuestionType(question);
    console.log('🔍 questionType:', questionType);
    
    // 生成个性化解读
    const result = generatePersonalizedInsight(question, hexagram, questionType);
    console.log('🔍 generatePersonalizedInsight 结果:', result);
    return result;
  } catch (error) {
    console.error('❌ personalizedInsight 计算过程中出错:', error);
    // 返回安全的默认值
    const hexagramName = hexagram.chineseName || hexagram.name;
    return {
      opening: `从"${hexagramName}"这个卦象来看，关于你的"${question}"，建议保持开放和谨慎的态度。`,
      coreConclusion: `基于"${hexagramName}"的智慧，建议你保持平衡，既要有进取心，也要有耐心。`,
      confidenceLevel: 50,
      actionItems: ['保持开放心态', '谨慎决策', '寻求指导'],
      hexagramAttributes: null
    };
  }
});

// 问题类型识别 - 增强版，支持更多场景
function identifyQuestionType(question: string): string[] {
  const types = [];
  
  // 事业相关
  if (question.includes('跳槽') || question.includes('工作') || question.includes('事业') || 
      question.includes('升职') || question.includes('创业') || question.includes('投资') ||
      question.includes('合作') || question.includes('项目')) {
    types.push('事业');
  }
  
  // 感情相关
  if (question.includes('感情') || question.includes('表白') || question.includes('分手') || 
      question.includes('恋爱') || question.includes('婚姻') || question.includes('复合') ||
      question.includes('相亲') || question.includes('异地')) {
    types.push('感情');
  }
  
  // 健康相关
  if (question.includes('健康') || question.includes('身体') || question.includes('生病') ||
      question.includes('治疗') || question.includes('运动') || question.includes('饮食')) {
    types.push('健康');
  }
  
  // 决策辅助
  if (question.includes('该不该') || question.includes('要不要') || question.includes('选择') ||
      question.includes('决定') || question.includes('犹豫') || question.includes('纠结')) {
    types.push('决策辅助');
  }
  
  // 吉凶预测
  if (question.includes('顺利') || question.includes('成功') || question.includes('失败') ||
      question.includes('运气') || question.includes('时机') || question.includes('风险')) {
    types.push('吉凶预测');
  }
  
  // 学习成长
  if (question.includes('学习') || question.includes('考试') || question.includes('培训') ||
      question.includes('技能') || question.includes('成长') || question.includes('进步')) {
    types.push('学习成长');
  }
  
  // 人际关系
  if (question.includes('朋友') || question.includes('同事') || question.includes('家人') ||
      question.includes('社交') || question.includes('沟通') || question.includes('冲突')) {
    types.push('人际关系');
  }
  
  return types.length > 0 ? types : ['一般咨询'];
}

// 生成个性化解读 - 使用新的卦象属性系统
function generatePersonalizedInsight(question: string, hexagram: any, questionTypes: string[]): {
  opening: string;
  coreConclusion: string;
  confidenceLevel: number;
  actionItems: string[];
  hexagramAttributes: any;
} {
  try {
    const hexagramName = hexagram.chineseName || hexagram.name;
    
    // 使用新的卦象属性系统生成个性化建议
    const personalizedAdvice = generatePersonalizedAdvice(hexagramName, questionTypes);
    const hexagramAttributes = getHexagramAttributes(hexagramName);
    
    // 安全检查：确保personalizedAdvice有正确的结构
    if (!personalizedAdvice || typeof personalizedAdvice !== 'object') {
      console.error('generatePersonalizedAdvice返回无效数据:', personalizedAdvice);
      // 返回默认值
      return {
        opening: `从"${hexagramName}"这个卦象来看，关于你的"${question}"，建议保持开放和谨慎的态度。`,
        coreConclusion: `基于"${hexagramName}"的智慧，建议你保持平衡，既要有进取心，也要有耐心。`,
        confidenceLevel: 50,
        actionItems: ['保持开放心态', '谨慎决策', '寻求指导'],
        hexagramAttributes: hexagramAttributes || null
      };
    }
    
    // 生成开场白
    const opening = `从"${hexagramName}"这个卦象来看，关于你的"${question}"，`;
    
    // 生成独立的核心结论 - 不再简单重复建议内容
    const coreConclusion = generateCoreConclusion(hexagramName, questionTypes, personalizedAdvice);
    
    // 计算信心指数
    const confidenceLevel = Math.round((personalizedAdvice.confidence || 0.5) * 100);
    
    return {
      opening: opening + (personalizedAdvice.advice || '建议保持开放和谨慎的态度。'),
      coreConclusion,
      confidenceLevel,
      actionItems: personalizedAdvice.actionItems || ['保持开放心态', '谨慎决策', '寻求指导'],
      hexagramAttributes
    };
  } catch (error) {
    console.error('生成个性化解读时出错:', error);
    // 返回安全的默认值
    const hexagramName = hexagram?.chineseName || hexagram?.name || '卦象';
    return {
      opening: `从"${hexagramName}"这个卦象来看，关于你的"${question}"，建议保持开放和谨慎的态度。`,
      coreConclusion: `基于"${hexagramName}"的智慧，建议你保持平衡，既要有进取心，也要有耐心。`,
      confidenceLevel: 50,
      actionItems: ['保持开放心态', '谨慎决策', '寻求指导'],
      hexagramAttributes: null
    };
  }
}

// 新增：生成独立的核心结论函数
function generateCoreConclusion(hexagramName: string, questionTypes: string[], personalizedAdvice: any): string {
  try {
    // 安全检查：确保personalizedAdvice有正确的结构
    if (!personalizedAdvice || typeof personalizedAdvice !== 'object') {
      console.error('generateCoreConclusion: personalizedAdvice无效:', personalizedAdvice);
      return `基于${hexagramName}的智慧，建议你保持开放和谨慎的态度，这将为你带来更好的结果。`;
    }
    
    const confidence = personalizedAdvice.confidence || 0.5;
    
    // 根据问题类型和卦象属性生成具体的结论
    if (questionTypes.includes('事业')) {
      if (confidence > 0.7) {
        return `建议积极行动，把握当前有利时机，在${hexagramName}的指引下，你的职业发展将迎来新的机遇。`;
      } else if (confidence > 0.4) {
        return `需要谨慎决策，在${hexagramName}的提醒下，建议先完善自身条件，等待更合适的时机再行动。`;
      } else {
        return `当前环境复杂，${hexagramName}建议保持耐心，避免冒进，专注提升个人能力。`;
      }
    } else if (questionTypes.includes('感情')) {
      if (confidence > 0.7) {
        return `感情发展前景良好，${hexagramName}提示你保持真诚和耐心，关系将稳步发展。`;
      } else if (confidence > 0.4) {
        return `感情需要更多沟通和理解，${hexagramName}建议你主动表达，但不要急于求成。`;
      } else {
        return `感情面临挑战，${hexagramName}提醒你需要重新审视关系，寻找问题的根源。`;
      }
    } else if (questionTypes.includes('决策辅助')) {
      if (confidence > 0.7) {
        return `决策时机成熟，${hexagramName}支持你的选择，建议果断行动。`;
      } else if (confidence > 0.4) {
        return `需要更多信息支持，${hexagramName}建议你收集更多资料，谨慎决策。`;
      } else {
        return `当前不适合做决定，${hexagramName}提醒你保持现状，等待更好的时机。`;
      }
    } else {
      // 通用结论
      const advice = personalizedAdvice.advice || '保持开放和谨慎的态度';
      return `基于${hexagramName}的智慧，建议你${advice}，这将为你带来更好的结果。`;
    }
  } catch (error) {
    console.error('生成核心结论时出错:', error);
    return `基于${hexagramName}的智慧，建议你保持开放和谨慎的态度，这将为你带来更好的结果。`;
  }
}

// 生成行动指南 - 使用卦象属性系统
function generateActionGuide() {
  try {
    if (!_props.result?.hexagram) {
      console.warn('generateActionGuide: 没有卦象数据');
      return;
    }
    
    const hexagram = _props.result.hexagram;
    const hexagramName = hexagram.chineseName || hexagram.name;
    
    // 获取卦象属性
    const attributes = getHexagramAttributes(hexagramName);
    
    if (attributes && attributes.personality && attributes.action && attributes.timing) {
      // 基于卦象属性生成个性化行动指南
      const guides = [
        {
          advice: `基于"${hexagramName}"的${attributes.nature || '智慧'}特质，今天适合${attributes.action}。利用"${attributes.personality.join('、')}"的优势，${attributes.timing}。`,
          action: generateActionBasedOnAttributes(attributes)
        },
        {
          advice: `"${hexagramName}"的${attributes.element || '五行'}属性提醒你，当前需要${attributes.energy === '上升' ? '把握上升趋势' : attributes.energy === '积聚' ? '积累能量' : '保持稳定'}。`,
          action: generateTimingBasedAction(attributes)
        },
        {
          advice: `"${hexagramName}"的${attributes.fortune || '运势'}提示，适合在${(attributes.suitableFor || ['个人发展']).join('、')}方面采取行动。`,
          action: generateSuitableAction(attributes)
        }
      ];
      
      // 随机选择一个指南
      const randomIndex = Math.floor(Math.random() * guides.length);
      actionGuide.value = guides[randomIndex];
    } else {
      // 降级到基础指南
      const basicGuides = [
        {
          advice: `基于"${hexagramName}"的智慧，今天适合保持开放和包容的心态，接纳周围的变化和机会。`,
          action: "尝试新事物，与不同的人交流，保持学习的姿态。"
        },
        {
          advice: `"${hexagramName}"提醒你，当前需要稳扎稳打，循序渐进地推进目标。`,
          action: "制定详细的计划，分步骤执行，不要急于求成。"
        }
      ];
      
      const randomIndex = Math.floor(Math.random() * basicGuides.length);
      actionGuide.value = basicGuides[randomIndex];
    }
  } catch (error) {
    console.error('生成行动指南时出错:', error);
    // 返回安全的默认指南
    const hexagramName = _props.result?.hexagram?.chineseName || _props.result?.hexagram?.name || '卦象';
    actionGuide.value = {
      advice: `基于"${hexagramName}"的智慧，今天适合保持开放和谨慎的态度。`,
      action: "保持平衡，既要有进取心，也要有耐心。"
    };
  }
}

// 基于卦象属性生成具体行动
function generateActionBasedOnAttributes(attributes: any): string {
  if (attributes.action === '主动') {
    return '主动出击，把握机会，展现你的能力和魅力。';
  } else if (attributes.action === '顺从') {
    return '顺应时势，保持耐心，等待合适的时机。';
  } else if (attributes.action === '合作') {
    return '加强团队合作，寻求他人的支持和帮助。';
  } else if (attributes.action === '稳定') {
    return '稳扎稳打，循序渐进地推进目标。';
  } else {
    return '保持平衡，既要有进取心，也要有耐心。';
  }
}

// 基于时机生成行动建议
function generateTimingBasedAction(attributes: any): string {
  if (attributes.timing === '适合行动') {
    return '果断行动，把握当前的良好时机。';
  } else if (attributes.timing === '适合等待') {
    return '耐心等待，做好充分的准备。';
  } else if (attributes.timing === '适合合作') {
    return '寻求合作，与他人共同推进。';
  } else {
    return '谨慎决策，平衡各种因素。';
  }
}

// 基于适宜场景生成行动建议
function generateSuitableAction(attributes: any): string {
  if (attributes.suitableFor && attributes.suitableFor.length > 0) {
    const suitableAreas = attributes.suitableFor.slice(0, 2).join('、');
    return `在${suitableAreas}方面投入时间和精力，发挥你的优势。`;
  }
  return '在当前擅长的领域继续深耕，保持专注和耐心。';
}

// 保存行动指南
function saveActionGuide() {
  if (!actionGuide.value) return;
  
  // 这里可以添加保存到本地存储的逻辑
  localStorage.setItem('savedActionGuide', JSON.stringify({
    ...actionGuide.value,
    timestamp: new Date().toISOString(),
    hexagram: _props.result?.hexagram?.name
  }));
  
  // 显示保存成功提示
  alert('行动指南已保存！');
}

// 提交用户反馈
function submitFeedback(type: 'helpful' | 'confused' | 'accurate') {
  if (feedbackSubmitted.value) return;
  
  const feedbackData = {
    type,
    question: _props.result?.question || '',
    hexagram: _props.result?.hexagram?.name || '',
    timestamp: new Date().toISOString(),
    personalizedInsight: personalizedInsight.value,
    questionTypes: _props.result?.question ? identifyQuestionType(_props.result.question) : []
  };
  
  // 保存反馈到本地存储
  const existingFeedback = localStorage.getItem('divinationFeedback');
  let feedbackHistory = [];
  
  if (existingFeedback) {
    try {
      feedbackHistory = JSON.parse(existingFeedback);
      if (!Array.isArray(feedbackHistory)) {
        feedbackHistory = [feedbackHistory];
      }
    } catch (e) {
      feedbackHistory = [];
    }
  }
  
  feedbackHistory.push(feedbackData);
  
  // 只保留最近50条反馈
  if (feedbackHistory.length > 50) {
    feedbackHistory = feedbackHistory.slice(-50);
  }
  
  localStorage.setItem('divinationFeedback', JSON.stringify(feedbackHistory));
  feedbackSubmitted.value = true;
  
  // 分析反馈数据，优化算法
  analyzeFeedbackAndOptimize(feedbackData);
  
  // 开发模式下的反馈记录
  if (isDevelopment.value) {
    console.log(`用户反馈: ${type}`, feedbackData);
  }
}

// 反馈数据分析与算法优化
function analyzeFeedbackAndOptimize(feedbackData: any) {
  try {
    const allFeedback = localStorage.getItem('divinationFeedback');
    if (!allFeedback) return;
    
    const feedbackHistory = JSON.parse(allFeedback);
    if (!Array.isArray(feedbackHistory)) return;
    
    // 分析反馈类型分布
    const feedbackStats: Record<string, number> = {
      helpful: 0,
      confused: 0,
      accurate: 0,
      total: feedbackHistory.length
    };
    
    feedbackHistory.forEach((feedback: any) => {
      if (feedback.type in feedbackStats) {
        feedbackStats[feedback.type as keyof typeof feedbackStats]++;
      }
    });
    
    // 分析问题类型与卦象的匹配效果
    const questionTypeEffectiveness = analyzeQuestionTypeEffectiveness(feedbackHistory);
    
    // 保存分析结果
    localStorage.setItem('feedbackAnalysis', JSON.stringify({
      stats: feedbackStats,
      questionTypeEffectiveness,
      lastUpdated: new Date().toISOString()
    }));
    
    // 开发模式下显示分析结果
    if (isDevelopment.value) {
      console.log('反馈分析结果:', { stats: feedbackStats, questionTypeEffectiveness });
    }
    
  } catch (error) {
    console.error('反馈分析失败:', error);
  }
}

// 分析问题类型与卦象的匹配效果
function analyzeQuestionTypeEffectiveness(feedbackHistory: any[]) {
  const effectiveness: Record<string, { total: number; helpful: number; confused: number; accurate: number }> = {};
  
  feedbackHistory.forEach((feedback: any) => {
    if (feedback.questionTypes && feedback.hexagram) {
      feedback.questionTypes.forEach((questionType: string) => {
        if (!effectiveness[questionType]) {
          effectiveness[questionType] = {
            total: 0,
            helpful: 0,
            confused: 0,
            accurate: 0
          };
        }
        
        effectiveness[questionType].total++;
        if (feedback.type in effectiveness[questionType]) {
          effectiveness[questionType][feedback.type as keyof typeof effectiveness[typeof questionType]]++;
        }
      });
    }
  });
  
  return effectiveness;
}

// 卦象变化动画控制
function startHexagramAnimation() {
  if (!_props.result?.changingLines || _props.result.changingLines.length === 0) return;
  
  // 重置动画状态
  animationState.value = 'highlighting';
  currentAnimationStep.value = 0;
  
  // 第一步：高亮动爻 (2秒)
  setTimeout(() => {
    currentAnimationStep.value = 1;
    animationState.value = 'flipping';
    
    // 第二步：卦象翻转 (1.5秒)
    setTimeout(() => {
      currentAnimationStep.value = 2;
      animationState.value = 'complete';
      
      // 动画完成后的清理 (2秒后重置)
      setTimeout(() => {
        animationState.value = 'idle';
        currentAnimationStep.value = 0;
      }, 2000);
    }, 1500);
  }, 2000);
}

// 获取动画类名
function getAnimationClass() {
  switch (animationState.value) {
    case 'highlighting':
      return 'changing-line-highlight';
    case 'flipping':
      return 'hexagram-flip';
    case 'complete':
      return 'hexagram-transition';
    default:
      return '';
  }
}

// 获取动爻动画类名
function getChangingLineClass(lineIndex: number): string {
  if (animationState.value === 'highlighting' && 
      _props.result?.changingLines?.includes(lineIndex)) {
    return 'highlight';
  }
  return '';
}

// 页面内导航函数
function scrollToSection(section: string) {
  const sections = {
    core: '.personalized-insight',
    interpretation: '.interpretation-section',
    hexagram: '.hexagram-section',
    action: '.action-section'
  };
  
  const targetElement = document.querySelector(sections[section as keyof typeof sections]);
  if (targetElement) {
    targetElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

// 主题切换函数
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  // 保存主题偏好到本地存储
  localStorage.setItem('tianxuan-theme', isDarkMode.value ? 'dark' : 'light');
  
  // 应用主题到根元素和body元素，确保主题类能正确应用
  const root = document.documentElement;
  const body = document.body;
  
  if (isDarkMode.value) {
    root.classList.add('dark');
    body.classList.add('dark');
  } else {
    root.classList.remove('dark');
    body.classList.remove('dark');
  }
  
  // 触发主题变化事件，便于其他组件响应
  window.dispatchEvent(new CustomEvent('theme-changed', { 
    detail: { theme: isDarkMode.value ? 'dark' : 'light' } 
  }));
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem('tianxuan-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }
  
  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('tianxuan-theme')) {
      // 只有在用户没有手动设置主题时才跟随系统
      isDarkMode.value = e.matches;
      if (e.matches) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  });
}

// 思维模型提炼算法 - 将卦象智慧转化为现代思维工具
function generateMentalModel(hexagram: any, questionTypes: string[]): {
  model: string;
  principles: string[];
  applications: string[];
} {
  const hexagramName = hexagram.chineseName || hexagram.name;
  const attributes = getHexagramAttributes(hexagramName);
  
  if (!attributes) {
    return {
      model: '平衡思维模型',
      principles: ['保持开放心态', '谨慎决策', '寻求指导'],
      applications: ['在不确定时保持平衡', '多角度思考问题', '寻求他人建议']
    };
  }
  
  // 根据卦象属性生成思维模型
  let model = '';
  let principles: string[] = [];
  let applications: string[] = [];
  
  if (attributes.action === '主动') {
    model = '主动进取思维模型';
    principles = [
      '把握时机，主动出击',
      '展现领导才能和创造力',
      '在竞争中保持优势'
    ];
    applications = [
      '主动承担新项目',
      '展现个人能力',
      '把握晋升机会'
    ];
  } else if (attributes.action === '顺从') {
    model = '顺应时势思维模型';
    principles = [
      '顺应环境变化',
      '保持耐心和包容',
      '在团队中发挥价值'
    ];
    applications = [
      '适应新的工作环境',
      '耐心等待合适时机',
      '加强团队合作'
    ];
  } else if (attributes.action === '合作') {
    model = '合作共赢思维模型';
    principles = [
      '寻求合作机会',
      '发挥团队优势',
      '建立和谐关系'
    ];
    applications = [
      '寻找合作伙伴',
      '参与团队项目',
      '建立人脉网络'
    ];
  } else if (attributes.action === '稳定') {
    model = '稳扎稳打思维模型';
    principles = [
      '循序渐进，稳步推进',
      '积累经验和资源',
      '保持长期视角'
    ];
    applications = [
      '制定详细计划',
      '分步骤执行目标',
      '持续学习和成长'
    ];
  } else {
    model = '平衡调整思维模型';
    principles = [
      '保持动态平衡',
      '灵活调整策略',
      '兼顾多个目标'
    ];
    applications = [
      '定期评估和调整',
      '平衡工作和生活',
      '寻求多赢解决方案'
    ];
  }
  
  // 根据问题类型调整应用场景
  if (questionTypes.includes('事业')) {
    applications = applications.map(app => app.replace('目标', '职业目标').replace('计划', '职业规划'));
  } else if (questionTypes.includes('感情')) {
    applications = applications.map(app => app.replace('合作', '感情交流').replace('团队', '感情关系'));
  }
  
  return { model, principles, applications };
}

// 开发模式测试函数
function testPersonalizedInsight() {
  console.log('测试智能解读功能:', personalizedInsight.value);
  alert('智能解读功能正常！请查看控制台输出。');
}

function testActionGuide() {
  generateActionGuide();
  console.log('测试行动指南功能:', actionGuide.value);
  alert('行动指南功能正常！请查看控制台输出。');
}

function testUserFeedback() {
  console.log('测试用户反馈功能');
  submitFeedback('helpful');
  alert('用户反馈功能正常！请查看控制台输出。');
}

function getYaoLabel(idx: number): string {
  const labels = ['初爻', '二爻', '三爻', '四爻', '上爻'];
  return labels[idx] || `${idx + 1}爻`;
}

// 组件挂载后初始化主题
onMounted(() => {
  initTheme();
  
  // 监听主题变化事件
  window.addEventListener('theme-changed', (e: any) => {
    const { theme } = e.detail;
    isDarkMode.value = theme === 'dark';
  });
});

// 格式化解读文本，添加HTML标签使其更易读
function formatAnalysisText(text: string): string {
  if (!text) return '';
  
  try {
    // 检查文本是否包含格式标记如"text-primary text-lg block mt-4 mb-2"
    if (text.includes('"text-primary') || text.includes('"block pl-4')) {
      // 直接移除这些格式标记
      let cleaned = text;
      
      // 移除带引号的CSS类标记
      cleaned = cleaned.replace(/"([^"]*text-[^"]*|[^"]*block[^"]*|[^"]*pl-\d+[^"]*)"/g, '""');
      
      // 确保文本被包裹在段落标签中
      if (!cleaned.startsWith('<p>')) {
        cleaned = '<p>' + cleaned;
      }
      if (!cleaned.endsWith('</p>')) {
        cleaned = cleaned + '</p>';
      }
      
      return cleaned;
    }
    
    // 如果已经包含HTML标签，直接清理并返回
    if (text.includes('<p>') || text.includes('<strong>') || text.includes('<span>')) {
      return cleanFormatMarkers(text);
    }
    
    // 常规文本处理
    let processedText = text;
    
    // 首先移除英文括号及其内容
    processedText = processedText.replace(/\s*\([^)]*\)/g, '');
    
    // 将换行符转换为HTML段落
    let formattedText = processedText
      .replace(/\n\n+/g, '</p><p>') // 连续多个换行作为段落分隔
      .replace(/\n([^\n])/g, '<br>$1'); // 单个换行转为<br>
    
    // 为标题添加样式（如【变化分析】【具体建议】等）
    formattedText = formattedText.replace(/【([^】]+)】/g, '<strong>【$1】</strong>');
    
    // 为列表项添加样式（如1. 2. 3.等）
    formattedText = formattedText.replace(/(\d+\.\s+[^<]+)(?=<br>|<\/p>|$)/g, '<span>$1</span>');
    
    // 确保文本被包裹在段落中
    if (!formattedText.startsWith('<p>')) {
      formattedText = '<p>' + formattedText;
    }
    if (!formattedText.endsWith('</p>')) {
      formattedText = formattedText + '</p>';
    }
    
    return formattedText;
  } catch (error) {
    console.error('格式化文本时出错:', error);
    // 发生错误时返回原始文本，但确保包含在段落标签中
    return `<p>${text.replace(/\n/g, '<br>')}</p>`;
  }
}

/**
 * 清理文本中的格式标记和英文内容
 * @param text 输入文本
 * @returns 清理后的文本
 */
function cleanFormatMarkers(text: string): string {
  if (!text) return '';
  
  let cleaned = text;
  
  // 移除带引号的CSS类标记
  cleaned = cleaned.replace(/"([^"]*text-[^"]*|[^"]*block[^"]*|[^"]*pl-\d+[^"]*)"/g, '""');
  
  // 移除CSS类标记，如[text-primary text-lg block mt-4 mb-2]
  cleaned = cleaned.replace(/\[[^\]]+\]/g, '');
  
  // 移除英文括号及其内容
  cleaned = cleaned.replace(/\s*\([^)]*\)/g, '');
  
  return cleaned;
}
</script>

<style scoped>
.highlight {
  /* 已通过Tailwind类实现高亮 */
}

.vintage-text {
  font-family: 'Kaiti', 'STKaiti', serif; 
}

/* 卦象信息样式 */
:deep(p) {
  margin-bottom: 0.75rem;
}

:deep(.text-primary) {
  color: var(--primary, #4C7EF3);
}

:deep(.text-primary-dark) {
  color: var(--primary-dark, #3060D0);
}

:deep(.text-accent) {
  color: var(--accent, #D0642A);
}

/* 添加一些动画类 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }

@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slideInDown { animation: slideInDown 0.5s ease-out forwards; }

@keyframes reveal {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-reveal { animation: reveal 0.5s ease-out forwards; }

/* 标签页样式优化 */
.tab-content {
  min-height: 200px;
}

/* 按钮悬停效果 */
button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 卡片悬停效果 */
.divination-result > div:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-out;
}

/* 进度条动画 */
.progress-bar {
  transition: width 1s ease-out;
}

/* 卦象变化动画 */
.hexagram-transition {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.changing-line-highlight {
  animation: changingLinePulse 2s ease-in-out infinite;
}

@keyframes changingLinePulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

/* 动爻高亮状态样式增强 */
.changing-line.highlight {
  animation: changingLinePulse 2s ease-in-out infinite;
  filter: brightness(1.2) contrast(1.1);
  z-index: 10;
}

.hexagram-flip {
  animation: hexagramFlip 1.5s ease-in-out;
  transform-style: preserve-3d;
}

@keyframes hexagramFlip {
  0% { 
    transform: rotateY(0deg) scale(1); 
    opacity: 1;
  }
  50% { 
    transform: rotateY(90deg) scale(1.1); 
    opacity: 0.8;
  }
  100% { 
    transform: rotateY(0deg) scale(1); 
    opacity: 1;
  }
}

/* 卦象变化完成状态 */
.hexagram-transition {
  animation: transitionComplete 0.5s ease-out;
}

@keyframes transitionComplete {
  0% { 
    transform: scale(1.05); 
    opacity: 0.9;
  }
  100% { 
    transform: scale(1); 
    opacity: 1;
  }
}

/* 思维模型卡片动画 */
.mental-model-card {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色模式样式 */
:deep(.dark) .divination-result {
  background-color: #1f2937;
  color: #f9fafb;
}

:deep(.dark) .bg-white {
  background-color: #374151;
}

:deep(.dark) .text-gray-900 {
  color: #f9fafb;
}

:deep(.dark) .text-gray-700 {
  color: #d1d5db;
}

:deep(.dark) .text-gray-600 {
  color: #9ca3af;
}

:deep(.dark) .border-gray-200 {
  border-color: #4b5563;
}

:deep(.dark) .bg-gray-50 {
  background-color: #374151;
}

:deep(.dark) .bg-blue-50 {
  background-color: #1e3a8a;
}

:deep(.dark) .bg-purple-50 {
  background-color: #581c87;
}

:deep(.dark) .bg-green-50 {
  background-color: #14532d;
}

:deep(.dark) .bg-orange-50 {
  background-color: #7c2d12;
}

:deep(.dark) .bg-indigo-50 {
  background-color: #312e81;
}

/* 修复深色模式选择器 - 使用正确的类名 */
.dark .divination-result {
  background-color: #1f2937;
  color: #f9fafb;
}

.dark .bg-white {
  background-color: #374151;
}

.dark .text-gray-900 {
  color: #f9fafb;
}

.dark .text-gray-700 {
  color: #d1d5db;
}

.dark .text-gray-600 {
  color: #9ca3af;
}

.dark .border-gray-200 {
  border-color: #4b5563;
}

.dark .bg-gray-50 {
  background-color: #374151;
}

.dark .bg-blue-50 {
  background-color: #1e3a8a;
}

.dark .bg-purple-50 {
  background-color: #581c87;
}

.dark .bg-green-50 {
  background-color: #14532d;
}

.dark .bg-orange-50 {
  background-color: #7c2d12;
}

.dark .bg-indigo-50 {
  background-color: #312e81;
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .flex.space-x-1 {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .flex.space-x-1 > button {
    width: 100%;
  }
  
  .hexagram-display {
    transform: scale(0.8);
  }
  
  /* 移动端卡片间距优化 */
  .divination-result > div {
    margin-bottom: 1rem;
  }
  
  /* 移动端字体大小优化 */
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  /* 移动端按钮优化 */
  button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  /* 移动端标签页优化 */
  .tab-content {
    min-height: 150px;
  }
}

/* 平板端优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .divination-result > div {
    margin-bottom: 1.5rem;
  }
  
  .hexagram-display {
    transform: scale(0.9);
  }
}
</style> 